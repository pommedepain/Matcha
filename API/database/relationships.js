
const neo4j = require('neo4j-driver').v1;
const debug = require('debug')('app:startup');
const _ = require('lodash');
const RelationShip = require('../models/relationships');

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
const session = driver.session();

// const relationships = {
//   user_a: 'Jean',
//   user_b: 'Boby',
//   type: 'LIKES',
// };

const relationships = [
  {
    node_a: {
      type: 'User',
      id: 'username',
      value: 'Jean',
    },
    node_b: {
      type: 'User',
      id: 'username',
      value: 'Boby',
    },
    relation: 'LIKES',
  },
  {
    node_a: {
      type: 'User',
      id: 'username',
      value: 'Camille',
    },
    node_b: {
      type: 'Tag',
      id: 'id',
      value: 'cat',
    },
    relation: 'IS',
  },
  {
    node_a: {
      type: 'User',
      id: 'username',
      value: 'Pilip',
    },
    node_b: {
      type: 'Tag',
      id: 'id',
      value: 'dog',
    },
    relation: 'LOOK_FOR',
  },
];

// function populateRelationships() {
//   return new Promise((resolve, reject) => {
//     debug('Creating Relationships...');
//     new RelationShips(relationships).addRelationShip()
//       .then(() => resolve(true))
//       .catch(err => reject(err));
//   });
// }

function populateRelationships() {
  const promises = [];
  debug('Populating Relationships in DB...');
  relationships.forEach((relation) => {
    const p = new RelationShip(relation).createRelationship();
    promises.push(p);
  });
  return Promise.all(promises);
}

module.exports = populateRelationships;
