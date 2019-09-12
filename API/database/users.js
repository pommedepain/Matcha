
const neo4j = require('neo4j-driver').v1;
const debug = require('debug')('app:startup');
const _ = require('lodash');
const User = require('../models/users');
const RelationShips = require('../models/relationships');

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
const session = driver.session();


const requiredProperties = ['username', 'firstName', 'lastName', 'password', 'email', 'birthdate'];
const optionalProperties = ['bio', 'gender', 'sexOrient', 'ageMin', 'ageMax', 'tags', 'localisation', 'optional', 'isAdmin'];
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
    localisation: '42',
    sexOrient: 'hetero',
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

function populateUsers() {
  const promises = [];
  debug('Populating Users in DB...');
  users.forEach((user) => {
    const p = new User(_.pick(user, requiredProperties.concat(optionalProperties))).createUser();
    promises.push(p);
  });
  return Promise.all(promises);
}

module.exports = populateUsers;
