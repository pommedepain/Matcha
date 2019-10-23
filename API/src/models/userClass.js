/* eslint-disable max-len */
/* eslint-disable camelcase */

const debug = require('debug')('models:users');
const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const UserValidator = require('../validation/users');
const TagValidator = require('../validation/tags');
const userTemplate = require('../util/userTemplate');
const Node = require('./nodeClass');
const Relationship = require('./relationshipsClass');
const driver = require('../util/driver');


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
    this.allProperties = ['age', 'isTags'];
    this.publicProperties = ['age', 'isTags'];
    this.optionalProperties = ['age'];

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
    this.relevantProperties = [
      'firsname',
      'age',
      'gender',
      'sexOrient',
      'bio',
      'photos',
      'username',
    ];
    debug('User constructor called');
    this.driver = driver;
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
            resolve(hash);
          })
          .catch(err => debug(err));
      } else resolve();
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

  deleteOrientRelationships() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (n:User { username:'${this.data.node_a.properties.username}'})-[r:IS]->(b:Orientation)
                    DELETE r`;
      session.run(query)
        .then(() => { session.close(); resolve(); })
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
            properties: { id: `${orientation}` },
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

  deleteCompatibilitiesRelationships() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (n:User { username:'${this.data.node_a.properties.username}'})-[r:COMPATIBLE]-(b:User)
                    DELETE r`;
      session.run(query)
        .then(() => { session.close(); resolve(); })
        .catch(err => reject(err));
    });
  }

  addCompatibilities() {
    return new Promise((resolve, reject) => {
      if (this.data.node_a.properties.sexOrient) {
        const session = this.driver.session();
        const query = `MATCH z=(a:User { username: '${this.data.node_a.properties.username}'})-[p:IS]->(c:Orientation)-[q:LOOK_FOR]-(d:Orientation)<-[r:IS]-(b:User)
                      WHERE (b.age <= a.ageMax AND b.age >= a.ageMin AND a.age <= b.ageMax AND a.age >= b.ageMin)
                      CREATE (a)-[t:COMPATIBLE]->(b)`;
        session.run(query)
          .then(() => { session.close(); debug(`User compatibilities created for ${this.data.node_a.properties.username}`); resolve(); })
          .catch(err => reject(err));
      } else resolve();
    });
  }

  deleteLookTagsRelationships() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (n:User { username:'${this.data.node_a.properties.username}'})-[r:LOOK_FOR]->(b:Tag)
                    DELETE r`;
      session.run(query)
        .then((res) => { debug(res); session.close(); resolve(); })
        .catch(err => reject(err));
    });
  }

  addLookTagsRelationships() {
    return new Promise((resolve, reject) => {
      const date = new Date();
      debug('Linking User with Tags ...');
      if (this.user.tags) {
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

  deleteIsTagsRelationships() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (n:User { username:'${this.data.node_a.properties.username}'})-[r:IS]->(b:Tag)
                    DELETE r`;
      session.run(query)
        .then((res) => { debug(res); session.close(); resolve(); })
        .catch(err => reject(err));
    });
  }

  addIsTagsRelationships() {
    return new Promise((resolve, reject) => {
      const date = new Date();
      debug('Linking User with Tags ...');
      if (this.user.isTags) {
        const promises = this.user.isTags.map(tag => (
          new Promise((res, rej) => {
            const data = {
              node_a: this.data.node_a,
              node_b: {
                label: 'Tag',
                id: 'id',
                properties: tag,
              },
              relation: {
                label: 'IS',
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

  validateLookTags() {
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

  validateIsTags() {
    return new Promise((resolve, reject) => {
      debug('Validating Tags ...');
      if (this.data.node_a.properties.isTags) {
        const promises = this.data.node_a.properties.isTags.map(tag => (
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

  generateAuthToken() {
    return new Promise((resolve, reject) => {
      this.getUserInfo()
        .then((infos) => {
          this.token = jwt.sign(_.omit(infos, 'password'), config.get('jwtPrivateKey'));
          this.token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (3600), // 30s
            data: _.omit(infos, 'password'),
          }, config.get('jwtPrivateKey'));

          debug('Generating Auth token :', this.token);
          resolve(this.token);
        })
        .catch(err => reject(err));
    });
  }

  getList(value) {
    return new Promise((resolve, reject) => {
      if (this.publicProperties.find(el => (el === value)) !== undefined) {
        this.getNodeList(value)
          .then(list => resolve(list))
          .catch(err => reject(err));
      } else (resolve());
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

  getSuggestions() {
    return new Promise((resolve, reject) => {
      this.getRelations('COMPATIBLE')
        .then((targets) => {
          this.targets = _.uniq(targets);
          this.promises = this.targets.map(user => (new User(user).getUserInfo()));
          return Promise.all(this.promises);
        })
        .then((targets) => { this.targets = targets; return (this.getCommonTags()); })
        .then((common) => { this.common = common; return (this.getReverseCommonTags()); })
        .then((reverseCommon) => {
          this.reverseCommon = reverseCommon;
          this.maxcomp = 0;
          this.list = this.targets.map((target) => {
            if (this.common.find(el => (target.username === el.user.username)) === undefined
              && this.reverseCommon.find(el => (target.username === el.user.username)) === undefined) {
              return ({ user: target, compTags: [], reverseCompTags: [] });
            } if (this.common.find(el => (target.username === el.user.username)) === undefined) {
              // eslint-disable-next-line prefer-destructuring
              const reverseCompTags = this.reverseCommon.find(el => (target.username === el.user.username)).reverseCompTags;
              return ({ user: target, compTags: [], reverseCompTags });
            } if (this.reverseCommon.find(el => (target.username === el.user.username)) === undefined) {
              // eslint-disable-next-line prefer-destructuring
              const compTags = this.common.find(el => (target.username === el.user.username)).compTags;
              return ({ user: target, compTags, reverseCompTags: [] });
            } const l = this.common.find(el => (target.username === el.user.username)).compTags.length;
            if (this.maxcomp <= l) { this.maxcomp = l; }
            // eslint-disable-next-line prefer-destructuring
            const compTags = this.common.find(el => (target.username === el.user.username)).compTags;
            // eslint-disable-next-line prefer-destructuring
            const reverseCompTags = this.reverseCommon.find(el => (target.username === el.user.username)).reverseCompTags;
            return ({ user: target, compTags, reverseCompTags });
          });
          this.result = [];
          for (let i = this.maxcomp; i >= 0; i -= 1) {
            this.list.forEach((element) => {
              if (element.compTags.length === i) this.result.push(element);
            });
          }
          resolve(this.result);
        })
        .catch(err => reject(err));
    });
  }

  getCommonTags() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (a:User { username: '${this.data.node_a.properties.username}'})-[r:LOOK_FOR]->(c:Tag)<-[l:IS]-(b:User),(a)-[m:COMPATIBLE]-(b)
                    WITH a,b, collect(properties(c)) as common
                    RETURN properties(b),common`;
      session.run(query)
        .then((res) => {
          session.close();
          this.result = [];
          if (res.records.length !== 0) {
            res.records.forEach((record) => {
              this.result.push({ user: _.pick(record._fields[0], this.relevantProperties), compTags: _.uniqBy(record._fields[1], 'id') });
            });
          }
          resolve(this.result);
        })
        .catch(err => reject(err));
    });
  }

  getReverseCommonTags() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (a:User { username: '${this.data.node_a.properties.username}'})-[r:IS]->(c:Tag)<-[l:LOOK_FOR]-(b:User),(a)-[m:COMPATIBLE]-(b)
                    WITH a,b, collect(properties(c)) as common
                    RETURN properties(b),common`;
      session.run(query)
        .then((res) => {
          session.close();
          this.result = [];
          if (res.records.length !== 0) {
            res.records.forEach((record) => {
              this.result.push({ user: _.pick(record._fields[0], this.relevantProperties), reverseCompTags: _.uniqBy(record._fields[1], 'id') });
            });
          }
          resolve(this.result);
        })
        .catch(err => reject(err));
    });
  }

  calcAge() {
    return new Promise((resolve, reject) => {
      if (this.data.node_a.properties.birthdate) {
        const getAge = birthDate => Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10);
        const age = getAge(this.data.node_a.properties.birthdate);
        this.data.node_a.properties.age = age;
        resolve();
      } resolve();
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

  getUserIsTags(username) {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (a:User {username:'${username}'})-[r:IS]->(b:Tag)
                    WITH a, collect(properties(b)) as tags
                    RETURN tags`;
      session.run(query)
        .then((res) => {
          session.close();
          if (res.records.length !== 0) {
            resolve(res.records[0]._fields[0]);
          } resolve();
        })
        .catch(err => reject(err));
    });
  }

  getUserLookTags(username) {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (a:User {username:'${username}'})-[r:LOOK_FOR]->(b:Tag)
                    WITH a, collect(properties(b)) as tags
                    RETURN tags`;
      session.run(query)
        .then((res) => {
          session.close();
          if (res.records.length !== 0) {
            resolve(res.records[0]._fields[0]);
          } resolve();
        })
        .catch(err => reject(err));
    });
  }

  getUserInfo() {
    return new Promise((resolve, reject) => {
      debug('Getting user info for :', this.user.username);
      new UserValidator(this.getRequirements, this.data.node_a.properties).validate()
        .then(() => this.getNodeInfo())
        .then((user) => { this.result = user; return (this.getUserIsTags(this.data.node_a.properties.username)); })
        .then((isTags) => { this.result.isTags = isTags; return (this.getUserLookTags(this.data.node_a.properties.username)); })
        .then((lookTags) => { this.result.lookTags = lookTags; return (resolve(this.result)); })
        .catch(err => reject(err));
    });
  }

  createUser() {
    return new Promise((resolve, reject) => (
      new UserValidator(this.creationRequirements, this.user).validate()
        .then(() => this.redundancyCheck())
        .then(() => this.hashGenerator())
        .then(() => this.calcAge())
        .then(() => { if (this.data.node_a.properties && !this.data.node_a.properties.sexOrient) { this.data.node_a.properties.sexOrient = 'bi'; } return this.createNode(); })
        .then(() => this.validateLookTags())
        .then(() => this.addLookTagsRelationships())
        .then(() => this.validateIsTags())
        .then(() => this.addIsTagsRelationships())
        .then(() => this.addOrientRelationships())
        .then(() => this.addCompatibilities())
        .then(() => resolve(_.pick(this.user,
          this.publicProperties.concat(this.optionalProperties))))
        .catch((err) => { debug(err); resolve(err); })
    ));
  }

  updateUser(newData) {
    return new Promise((resolve, reject) => (
      new UserValidator(this.updateRequirements, this.user).validate()
        .then(() => { if (newData.password) { this.user.password = newData.password; } return this.hashGenerator(); })
        .then((pass) => { this.newData = newData; debug(this.newData); this.newData.password = pass; return this.updateNode(this.newData); })
        .then((user) => {
          this.user = user;
          if (newData.tags) {
            this.user.tags = newData.tags;
            const node = {
              label: 'User',
              id: 'username',
              properties: this.user,
            };
            this.data = { node_a: node };
            return (this.deleteLookTagsRelationships()
              .then(() => this.addLookTagsRelationships()));
          } return (new Promise(res => res()));
        })
        .then(() => {
          if (newData.isTags) {
            this.user.isTags = newData.isTags;
            const node = {
              label: 'User',
              id: 'username',
              properties: this.user,
            };
            this.data = { node_a: node };
            return (this.deleteIsTagsRelationships()
              .then(() => this.addIsTagsRelationships()));
          } return (new Promise(res => res()));
        })
        .then(() => {
          if (newData.sexOrient) {
            this.user.sexOrient = newData.sexOrient;
            const node = {
              label: 'User',
              id: 'username',
              properties: this.user,
            };
            this.data = { node_a: node };
            return (this.deleteOrientRelationships()
              .then(() => this.addOrientRelationships()));
          } return (new Promise(res => res()));
        })
        .then(() => this.deleteCompatibilitiesRelationships())
        .then(() => this.addCompatibilities())
        .then(() => { this.updatedUser = this.user; return (new User(this.user).generateAuthToken()); })
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

  createResetToken() {
    debug('Reset Token generator');
    return new Promise((resolve) => {
      bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(this.user.username, salt))
        .then(hash => resolve(hash))
        .catch(err => debug(err));
    });
  }

  sendResetLink() {
    return new Promise((resolve, reject) => {
      this.createResetToken()
        .then((token) => {
          const newData = { resetToken: token };
          this.resetToken = token;
          return this.updateUser(newData);
        })
        .then(() => this.sendResetMail(this.resetToken))
        .then(() => resolve(true))
        .catch(err => reject(err));
    });
  }

  sendResetMail(oldtoken) {
    return new Promise((resolve, reject) => {
      debug('SENDING RESET MAIL');

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'cajulien.42.matcha@gmail.com',
          pass: 'Ff7midgar6',
        },
      });
      const token = oldtoken.replace(/\//gi, '\\');
      debug(token);
      transporter.sendMail({
        from: 'cajulien.42.matcha@gmail.com',
        to: 'kamillejulien@gmail.com',
        subject: 'Request to reset password for Matcha',
        text: 'Hi',
        html: `Hi ${this.user.username}, to complete your registration to Matcha, please click on <a href='http://localhost:4000/api/users/reset/${this.user.username}/${token}'>this link</a>`,
      }).then(() => resolve())
        .catch(err => reject(err));
    });
  }

  matchConfTokens(token) {
    return new Promise((resolve, reject) => {
      this.getUserInfo()
        .then((user) => {
          let decodedToken = token.replace(/%5C/gi, '/');
          decodedToken = token.replace(/\\/gi, '/');
          debug(user.resetToken, decodedToken);
          if (user.resetToken === decodedToken) resolve(true);
          else resolve(false);
        })
        .catch(err => reject(err));
    });
  }

  eraseResetToken() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query = `MATCH (n:User {username:'${this.user.username}'})
                      REMOVE n.resetToken
                      RETURN n`;
      session.run(query)
        .then(() => { session.close(); resolve(); })
        .catch(err => debug(err));
    });
  }

  resetPwd(token) {
    return new Promise((resolve, reject) => {
      this.matchConfTokens(token)
        .then(() => this.eraseResetToken())
        .then(user => resolve(true))
        .catch(err => reject(err));
    });
  }
}

module.exports = User;
