const neo4j = require('neo4j-driver').v1;
const debug = require('debug')('init:main');
const _ = require('lodash');
const populateUsers = require('./users');
const populateTags = require('./tags');
const populateRelationships = require('./relationships');
const RelationShip = require('../models/relationshipsClass');
const User = require('../models/userClass');
const Tag = require('../models/tagClass');

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
const session = driver.session();


function resetDb() {
  return new Promise((resolve) => {
    debug('Reseting DB...');
    session.run('MATCH p=()-[r]->() DELETE p')
      .then(() => (session.run('MATCH (n) DELETE n')))
      .then(() => resolve(true))
      .catch(err => debug(err));
  });
}

function populateDb() {
  return new Promise((resolve, reject) => {
    resetDb()
      .then(() => populateTags())
      .then(() => populateUsers())
      .then(() => populateRelationships())
      .then(() => resolve())
      .catch(err => reject(err));
  });
}

function seed() {
  return (
    populateDb()
      .then(() => new RelationShip().deleteRelationshipsDuplicates('User', 'LOOK_FOR', 'Tag'))
      .then(() => new Tag().deleteTagsDuplicates('User', 'LOOK_FOR', 'Tag'))
      .then(() => new User().deleteUsersDuplicates('User', 'LOOK_FOR', 'Tag'))
  );
}

module.exports = seed;
