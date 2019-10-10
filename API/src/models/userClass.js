/* eslint-disable camelcase */

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

  constructor(data, newData) {
    const node = {
      label: 'User',
      id: 'username',
      properties: data,
    };
    super({ node_a: node });
    this.data = { node_a: node };
    this.newData = newData;
    this.user = this.data.node_a.properties;
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
            this.data.node_a.properties.password = hash;
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
    return new Promise((resolve, reject) => {
      const date = new Date();
      debug('Linking User with Tags ...');
      if (this.user.tags) {
        debug(this.user.tags);
        const promises = this.user.tags.map(tag => (
          new Promise((res, rej) => {
            const data = {
              node_a: this.data.node_a,
              node_b: {
                label: 'Tag',
                id: 'id',
                properties: tag,
              },
              relation: {
                label: 'LOOK_FOR',
                properties: { creationDate: date.toISOString() },
              },
            };
            new Relationship(data).createRelationship()
              .then(() => res())
              .catch(err => rej(err));
          })
        ));
        Promise.all(promises)
          .then(() => resolve())
          .catch(err => reject(err));
      } else resolve();
    });
  }

  validateTags() {
    return new Promise((resolve, reject) => {
      debug('Validating Tags ...');
      if (this.data.node_a.properties.tags) {
        const promises = this.data.node_a.properties.tags.map(tag => (
          new Promise((res, rej) => {
            new TagValidator(this.tagRequirements, tag).validate()
              .then(() => res())
              .catch(err => rej(err));
          })
        ));
        Promise.all(promises)
          .then(() => resolve())
          .catch(err => reject(err));
      } else resolve();
    });
  }

  generateAuthToken(user) {
    return new Promise((resolve, reject) => {
      this.token = jwt.sign(_.omit(user, 'password'), config.get('jwtPrivateKey'));
      this.token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (3600), // 30s
        data: _.omit(user, 'password'),
      }, config.get('jwtPrivateKey'));

      debug('Generating Auth token :', this.token);
      resolve(this.token);
    });
  }

  getList(value) {
    return new Promise((resolve, reject) => {
      this.getNodeList(value)
        .then(list => resolve(list))
        .catch(err => reject(err));
    });
  }

  getMatches() {
    return new Promise((resolve, reject) => {
      this.data.relation = {
        label: 'LIKES',
      };
      this.getNodeMutualRelationships()
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
        .then(() => this.updateNode(this.newData))
        .then((user) => { this.updatedUser = user; return (this.generateAuthToken(user)); })
        .then((token) => { this.updatedUser.token = token; resolve(_.omit(this.updatedUser, 'password')); })
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

  deleteUsersDuplicates() {
    return new Promise((resolve, reject) => {
      this.data = {
        node_a: {
          label: 'User',
          id: 'username',
        },
      };
      this.deleteNodeDuplicates()
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }
}

module.exports = User;
