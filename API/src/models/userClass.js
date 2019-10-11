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

  constructor(data) {
    const node = {
      label: 'User',
      id: 'username',
      properties: data,
    };
    super({ node_a: node });
    this.data = { node_a: node };
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
    this.driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));

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

  addOrientRelationships() {
    return new Promise((resolve, reject) => {
      if (this.data.node_a.properties.sexOrient) {
        const date = new Date();
      let orientation = this.data.node_a.properties.gender === 'male' ? 'm' : 'f';
      orientation = `${orientation}_${this.data.node_a.properties.sexOrient}`;
      const data = {
        node_a: this.data.node_a,
        node_b: {
          label: 'Orientation',
          id: 'id',
          properties: { id: `${orientation}`},
        },
        relation: {
          label: 'IS',
          properties: { creationDate: date.toISOString() },
        },
      };
      new Relationship(data).createRelationship()
        .then(() => resolve())
        .catch(err => reject(err));
      } else resolve();
    });
  }

  getCommonTags() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (a:User { username: '${this.data.node_a.properties.username}'})-[r:LOOK_FOR]->(c:Tag)<-[l:IS]-(b:User),(a)-[m:COMPATIBLE]-(b)
                    WITH a,b, collect(c.id) as common
                    RETURN (b.username),common`;
      session.run(query)
        .then((res) => {
          this.result = [];
          if (res.records.length !== 0) {
            res.records.forEach((record) => {
              this.result.push({ username: record._fields[0] , commonTags: record._fields[1] });
            });
          }
          debug(this.result);
          resolve(this.result);
        })
        .catch(err => reject(err));
    });
  }

  addCompatibilities() {
    return new Promise((resolve, reject) => {
      if (this.data.node_a.properties.sexOrient) {
        let session = this.driver.session();
        const query = `MATCH z=(a:User { username: '${this.data.node_a.properties.username}'})-[p:IS]->(c:Orientation)-[q:LOOK_FOR]-(d:Orientation)<-[r:IS]-(b:User)
                    CREATE (a)-[t:COMPATIBLE]->(b)`;
        session.run(query)
          .then(() => { session.close(); debug(`User compatibilities created for ${this.data.node_a.properties.username}`); resolve()})
          .catch(err => reject(err));   
      } else resolve();            
    });
  }

  addTagsRelationships() {
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



  getRelations(relation) {
    return new Promise((resolve, reject) => {
      this.data.relation = {
        label: relation,
      };
      this.getNodetypeofRelationships()
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
        .then(() => this.addTagsRelationships())
        .then(() => this.addOrientRelationships())
        .then(() => this.addCompatibilities())
        .then(() => resolve(_.pick(this.user,
          this.publicProperties.concat(this.optionalProperties))))
        .catch(err => reject(err))
    ));
  }

  updateUser(newData) {
    return new Promise((resolve, reject) => (
      new UserValidator(this.updateRequirements, this.user).validate()
        .then(() => { if (newData.password) { this.user.password = newData.password }; return this.hashGenerator(); })
        .then((pass) => { this.newData = newData; this.newData.password = pass; return this.updateNode(this.newData) })
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
