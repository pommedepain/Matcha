
const debug = require('debug')('init:relationships');
const RelationShip = require('../models/relationshipsClass');

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
];

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
