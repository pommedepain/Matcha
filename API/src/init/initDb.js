const neo4j = require('neo4j-driver').v1;
const debug = require('debug')('init:main');
const _ = require('lodash');
const populateUsers = require('./users');
const populateTags = require('./tags');
const populateOrientations = require('./orientations');
const populateUserRelationships = require('./userRelationships');
const populateOrientationsRelationships = require('./orientationsRelationships');
const RelationShip = require('../models/relationshipsClass');
const User = require('../models/userClass');
const Tag = require('../models/tagClass');

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));



function resetDb() {
  return new Promise((resolve) => {
    let session = driver.session();
    debug('Reseting DB...');
    session.run('MATCH p=()-[]-() DELETE p')
      .then(() => session.close())
      .then(() => { session = driver.session(); return session.run('MATCH (n) DELETE n') })
      .then(() => session.close())
      .then(() => resolve(true))
      .catch(err => debug(err));
  });
}

function populateDb() {
  return new Promise((resolve, reject) => {
    resetDb()
      .then(() => populateTags())
      .then(() => populateOrientations())
      .then(() => populateOrientationsRelationships())
      .then(() => populateUsers())
      .then(() => populateUserRelationships())
      .then(() => resolve())
      .catch(err => reject(err));
  });
}

function seed() {
  return (
    populateDb()
      .then(() => new RelationShip().deleteRelationshipsDuplicates('User', 'LOOK_FOR', 'Tag'))
      .then(() => new RelationShip().deleteRelationshipsDuplicates('User', 'IS', 'Tag'))
      .then(() => new RelationShip().deleteRelationshipsDuplicates('User', 'LIKES', 'User'))
      .then(() => new RelationShip().deleteRelationshipsDuplicates('User', 'COMPATIBLE', 'User'))
      .then(() => new Tag().deleteTagsDuplicates('User', 'LOOK_FOR', 'Tag'))
      .then(() => new User().deleteUsersDuplicates('User', 'LOOK_FOR', 'Tag'))
  );
}

module.exports = seed;
