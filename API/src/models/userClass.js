
const debug = require('debug')('models:users');
const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const bcrypt = require('bcrypt');
const UserValidator = require('../validation/users');
const TagValidator = require('../validation/tags');
const Relationship = require('./relationshipsClass');
const userTemplate = require('../util/userTemplate');


class User {

  constructor(user) {
    if (user && user.username) this.user = user;
    else if (user) {
      this.user = {};
      this.user.username = user;
    }

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
  }

  redundancyCheck() {
    return new Promise((resolve, reject) => {
      debug('Checkin for', this.user.username, ', ', this.user.email, 'in database.');
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      session.run(
        'MATCH (n:User) WHERE n.username=$username OR n.email=$email RETURN n',
        { username: this.user.username, email: this.user.email },
      )
        .then((result) => {
          session.close();
          if (result.records.length === 0) { resolve(this.user); }
          reject(new Error('User exists'));
        })
        .catch((err) => { debug('An error during redundancy check :', err); });
    });
  }

  hashGenerator() {
    return new Promise((resolve) => {
      if (this.user.password) {
        const data = this.user.password;
        bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(data, salt))
          .then(hash => resolve(hash))
          .catch(err => debug(err));
      } else resolve(null);
    });
  }

  matchPasswords(user) {
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

  getUsers() {
    return new Promise((resolve, reject) => {
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      session.run('MATCH (n:User) RETURN n.username')
        .then((result) => {
          session.close();
          if (result.records.length !== 0) {
            this.users = [];
            result.records.forEach((record) => { this.users.push(record._fields[0]); });
            debug('Records :\n', this.users);
            resolve(this.users);
          } else reject(new Error('No users in database'));
        })
        .catch((err) => { debug('An error occured while fetching user list :', err); });
    });
  }

  getUserInfo() {
    return new Promise((resolve, reject) => {
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      debug('Getting user info for :', this.user);
      new UserValidator(this.getRequirements, this.user).validate()
        .then(() => {
          session.run(
            'MATCH (n:User) WHERE n.username=$username RETURN n',
            { username: this.user.username },
          )
            .then((result) => {
              session.close();
              if (result.records.length === 1) {
                const user = result.records[0]._fields[0].properties;

                debug('Data fetched :\n', user);
                resolve(user);
              } else reject(new Error('bad request'));
            })
            .catch((err) => { debug('An error occured while fetching user info :', err); });
        })
        .catch((err) => { debug('An error occured while fetching user info :', err); });
    });
  }

  deleteRelationships() {
    return new Promise((resolve, reject) => {
      const node = {
        node_a: {
          type: 'User',
          id: 'username',
          value: `${this.user.username}`,
        },
      };
      new Relationship(node).deleteThisNodeRelationships()
        .then(() => resolve(true))
        .catch(err => reject(err));
    //   const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
    //   const session = driver.session();
    //   session.run(
    //     'MATCH p=(a)-[r]->(b) WHERE a.username=$username OR b.username=$username DELETE r',
    //     { username: this.user.username },
    //   )
    //     .then(() => {
    //       session.close();
    //       resolve(true);
    //     })
    //     .catch((err) => { debug('An error occured during relationship deletion :', err); });
    // });
    });
  }

  deleteNode() {
    return new Promise((resolve, reject) => {
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      session.run(
        'MATCH (n:User) WHERE n.username=$username DELETE n RETURN n',
        { username: this.user.username },
      )
        .then((result) => {
          session.close();
          if (result.records.length === 1) {
            debug('Deleted user :', this.user.username);
            resolve(this.user.username);
          } else reject(new Error('User not found'));
        })
        .catch((err) => { debug('An error occured during node deletion :', err); });
    });
  }

  changeUserProperies(hash) {
    return new Promise((resolve, reject) => {
      if (hash) this.user.password = hash;
      const newProperties = Object.keys(_.pick(this.user, _.without(this.allProperties, 'tags')));
      let changeReq = '{';
      newProperties.forEach((property) => { changeReq = ` ${changeReq}${property} : $${property},`; });
      changeReq = `${changeReq}}`;
      changeReq = changeReq.replace(',}', '}');
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      session.run(
        `MATCH (n:User {username: $username}) SET n+= ${changeReq} RETURN n`,
        this.user,
      )
        .then((result) => {
          session.close();
          if (result.records.length === 1) {
            const singleRecord = result.records[0];
            const node = singleRecord.get(0);
            resolve(node.properties);
          } else reject(new Error('Informations does not match existing user'));
        })
        .catch(err => debug('An error occured during user information update :', err));
    });
  }

  addUser(hash) {
    return new Promise((resolve, reject) => {
      this.user.password = hash;
      const newProperties = Object.keys(_.pick(this.user, _.without(this.allProperties, 'tags')));
      let addReq = '{';
      newProperties.forEach((property) => { addReq = ` ${addReq}${property} : $${property},`; });
      addReq = `${addReq}}`;
      addReq = addReq.replace(',}', '}');
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      session.run(`CREATE (n:User ${addReq}) RETURN n`, this.user)
        .then((result) => {
          session.close();
          if (result.records.length === 1) {
            const singleRecord = result.records[0];
            const node = singleRecord.get(0);
            debug('User added to DB :\n', node.properties);
            resolve(node.properties);
          } else reject(new Error('An error occured'));
        })
        .catch(err => debug('An error occured while adding new user :', err));
    });
  }

  addRelationships() {
    const promises = [];
    const relationships = [];
    debug('Linking User with Tags ...');
    if (this.user.tags) {
      this.user.tags.forEach((tag) => {
        relationships.push({
          node_a: {
            type: 'User',
            id: 'username',
            value: `${this.user.username}`,
          },
          node_b: {
            type: 'Tag',
            id: 'id',
            value: `${tag.id}`,
          },
          relation: 'LOOK_FOR',
        });
      });
      relationships.forEach((relation) => {
        debug('relation:', relation);
        const p = new Relationship(relation).createRelationship();
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

  createUser() {
    return new Promise((resolve, reject) => (
      new UserValidator(this.creationRequirements, this.user).validate()
        .then(() => this.redundancyCheck())
        .then(() => this.hashGenerator())
        .then(hash => this.addUser(hash))
        .then(() => this.validateTags())
        .then(() => this.addRelationships())
        .then(user => resolve(_.pick(user, this.publicProperties.concat(this.optionalProperties))))
        .catch(err => reject(err))
    ));
  }

  updateUser() {
    return new Promise((resolve, reject) => (
      new UserValidator(this.updateRequirements, this.user).validate()
        .then(() => this.hashGenerator())
        .then(hash => this.changeUserProperies(hash))
        .then(user => resolve(_.pick(user, this.publicProperties.concat(this.optionalProperties))))
        .catch(err => reject(err))
    ));
  }

  deleteUser() {
    return new Promise((resolve, reject) => (
      new UserValidator(this.deleteRequirements, this.user).validate()
        .then(() => this.deleteRelationships())
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
