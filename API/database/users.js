
const neo4j = require('neo4j-driver').v1;
const debug = require('debug')('app:startup');
const _ = require('lodash');
const User = require('../models/users');
const RelationShips = require('../models/relationships');

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
const session = driver.session();


const requiredProperties = ['username', 'firstName', 'lastName', 'password', 'email', 'birthdate'];
const optionalProperties = ['bio', 'gender', 'sexOrient', 'ageMin', 'ageMax', 'tags', 'optional'];
const users = [
  {
    username: 'Jean',
    firstName: 'Jean',
    lastName: 'Camille',
    password: 'Test123*',
    email: 'jean@gmail.com',
    birthdate: '1995-03-28',
    bio: 'ce est un test',
    gender: 'male',
    ageMin: '19',
    ageMax: '31',
    sexOrient: 'Heterosexual',
    tags: [{ id: 'cinema', text: 'Cinema Lover' }, { id: 'cat', text: 'Cat Person' }],
  },
  {
    username: 'Camille',
    firstName: 'Jean',
    lastName: 'Camille',
    password: 'Test123*',
    email: 'kamillejulien@gmail.com',
    birthdate: '1995-03-28',
    isAdmin: 'true',
  },
  {
    username: 'Boby',
    firstName: 'Jean',
    lastName: 'Camille',
    password: 'Test123*',
    email: 'marley@gmail.com',
    birthdate: '1995-03-28',
  },
  {
    username: 'Pilip',
    firstName: 'Jean',
    lastName: 'Camille',
    password: 'Test123*',
    email: 'pilip@gmail.com',
    birthdate: '1995-03-28',
  },
  {
    username: 'Claude',
    firstName: 'Jean',
    lastName: 'Camille',
    password: 'Test123*',
    email: 'claude@gmail.com',
    birthdate: '1995-03-28',
  },
];

const relationships = {
  user_a: 'Jean',
  user_b: 'Boby',
  type: 'LIKES',
};

function resetDb() {
  return new Promise((resolve) => {
    debug('Reseting DB...');
    session.run('MATCH p=()-[r]->() DELETE p')
      .then(() => (session.run('MATCH (n) DELETE n')))
      .then(() => resolve(true))
      .catch(err => debug(err));
  });
}

function populateUsers() {
  const promises = [];
  debug('Populating DB...');
  users.forEach((user) => {
    const p = new User(_.pick(user, requiredProperties.concat(optionalProperties))).createUser();
    promises.push(p);
  });
  return Promise.all(promises);
}

function createRelationships() {
  return new Promise((resolve, reject) => {
    debug('Creating Relationships...');
    new RelationShips(relationships).addRelationShip()
      .then(() => resolve(true))
      .catch(err => reject(err));
  });
}

function populateDb() {
  return new Promise((resolve, reject) => {
    resetDb()
      .then(() => populateUsers())
      .then(() => createRelationships())
      .then(() => resolve(true))
      .catch(err => reject(err));
  });
}

module.exports = populateDb;
