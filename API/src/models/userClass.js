
const debug = require('debug')('models:users');
const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const bcrypt = require('bcrypt');
const UserValidator = require('../validation/users');
const TagValidator = require('../validation/tags');
const userTemplate = require('../util/userTemplate');
const Node = require('./nodeClass');
const Relationship = require('./relationshipsClass');


class User extends Node {

  constructor(data) {
    const node = {
      type: 'User',
      id: 'username',
      value: data,
    };
    super({ node_a: node });
    this.data = { node_a: node };
    this.user = this.data.node_a.value;
    this.allProperties = [];
    this.publicProperties = [];
    this.optionalProperties = [];

    Object.keys(userTemplate).forEach((property) => {
      this.allProperties.push(property);
      if (userTemplate[property].public === true) this.publicProperties.push(property);
      if (userTemplate[property].public === true) this.optionalProperties.push(property);
    });

    this.creationRequirements = {
      username: true,
      firstName: true,
      lastName: true,
      password: true,
      email: true,
      birthdate: true,
      isAdmin: false,
    };
    this.authRequirements = {
      username: true,
      password: true,
    };
    this.updateRequirements = {
      username: true,
    };
    this.deleteRequirements = {
      username: true,
    };
    this.getRequirements = {
      username: true,
    };
    this.tagRequirements = {
      id: true,
    };
    debug('User constructor called');
  }

  hashGenerator() {
    debug('hash generator');
    return new Promise((resolve) => {
      if (this.user.password) {
        const data = this.user.password;
        bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(data, salt))
          .then((hash) => {
            this.user.password = hash;
            this.data.node_a.value.password = hash;
            resolve();
          })
          .catch(err => debug(err));
      } else resolve(null);
    });
  }

  matchPasswords(user) {
    debug(user.password);
    debug(this.user.password);
    return new Promise((resolve, reject) => {
      bcrypt.compare(this.user.password, user.password)
        .then((valid) => {
          if (valid === true) {
            debug('Verifying password for :', user.username);
            resolve(user);
          } else reject(new Error('bad request'));
        })
        .catch(err => reject(err));
    });
  }

  addRelationships() {
    const promises = [];
    debug('Linking User with Tags ...');
    if (this.user.tags) {
      debug(this.user.tags);
      this.user.tags.forEach((tag) => {
        const data = {
          node_a: this.data.node_a,
          node_b: {
            type: 'Tag',
            id: 'id',
            value: tag,
          },
          relation: 'LOOK_FOR',
        };
        const p = new Relationship(data).createRelationship();
        promises.push(p);
      });
    }
    return Promise.all(promises);
  }

  validateTags() {
    const promises = [];
    debug('Validating Tags ...');
    if (this.user.tags) {
      this.user.tags.forEach((tag) => {
        debug('tag:', tag);
        const p = new TagValidator(this.tagRequirements, tag).validate();
        promises.push(p);
      });
    }
    return Promise.all(promises);
  }

  generateAuthToken(user) {
    this.token = jwt.sign({ username: user.username, isAdmin: user.isAdmin }, config.get('jwtPrivateKey'));
    debug('Generating Auth token :', this.token);
    return this.token;
  }

  getUsers() {
    return new Promise((resolve, reject) => {
      this.getNodeList()
        .then(list => resolve(list))
        .catch(err => reject(err));
    });
  }

  getUserInfo() {
    return new Promise((resolve, reject) => {
      debug('Getting user info for :', this.user);
      new UserValidator(this.getRequirements, this.user).validate()
        .then(() => this.getNodeInfo())
        .then(user => resolve(user))
        .catch(err => reject(err));
    });
  }

  createUser() {
    return new Promise((resolve, reject) => (
      new UserValidator(this.creationRequirements, this.user).validate()
        .then(() => this.redundancyCheck())
        .then(() => this.hashGenerator())
        .then(() => this.createNode())
        .then(() => this.validateTags())
        .then(() => this.addRelationships())
        .then(() => resolve(_.pick(this.user,
          this.publicProperties.concat(this.optionalProperties))))
        .catch(err => reject(err))
    ));
  }

  updateUser() {
    return new Promise((resolve, reject) => (
      new UserValidator(this.updateRequirements, this.user).validate()
        .then(() => this.hashGenerator())
        .then(() => this.updateNode())
        .then(user => resolve(_.pick(user, this.publicProperties.concat(this.optionalProperties))))
        .catch(err => reject(err))
    ));
  }

  deleteUser() {
    return new Promise((resolve, reject) => (
      new UserValidator(this.deleteRequirements, this.user).validate()
        .then(() => this.deleteThisNodeRelationships())
        .then(() => this.deleteNode())
        .then(user => resolve(user))
        .catch(err => reject(err))
    ));
  }

  authenticateUser() {
    return new Promise((resolve, reject) => (
      new UserValidator(this.authRequirements, this.user).validate()
        .then(() => this.getUserInfo())
        .then(existingUser => this.matchPasswords(existingUser))
        .then(existingUser => this.generateAuthToken(existingUser))
        .then(token => resolve(token))
        .catch(err => reject(err))
    ));
  }
}

module.exports = User;
