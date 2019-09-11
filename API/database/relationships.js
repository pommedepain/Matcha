
const neo4j = require('neo4j-driver').v1;
const debug = require('debug')('app:startup');
const _ = require('lodash');
const RelationShips = require('../models/relationships');

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
const session = driver.session();

const relationships = {
  user_a: 'Jean',
  user_b: 'Boby',
  type: 'LIKES',
};

function populateRelationships() {
  return new Promise((resolve, reject) => {
    debug('Creating Relationships...');
    new RelationShips(relationships).addRelationShip()
      .then(() => resolve(true))
      .catch(err => reject(err));
  });
}

module.exports = populateRelationships;
