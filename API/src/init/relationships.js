
const debug = require('debug')('init:relationships');
const RelationShip = require('../models/relationshipsClass');

const relationships = [
  {
    node_a: {
      type: 'User',
      id: 'username',
      value: { username: 'Jean' },
    },
    node_b: {
      type: 'User',
      id: 'username',
      value: { username: 'Boby' },
    },
    relation: 'LIKES',
  },
  {
    node_a: {
      type: 'User',
      id: 'username',
      value: { username: 'Camille' },
    },
    node_b: {
      type: 'Tag',
      id: 'id',
      value: { id: 'cat' },
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
