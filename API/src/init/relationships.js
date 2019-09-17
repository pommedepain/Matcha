
const debug = require('debug')('init:relationships');
const RelationShip = require('../models/relationshipsClass');

const date = new Date();

const relationships = [
  {
    node_a: {
      label: 'User',
      id: 'username',
      properties: { username: 'Jean' },
    },
    node_b: {
      label: 'User',
      id: 'username',
      properties: { username: 'Boby' },
    },
    relation: {
      label: 'LIKES',
      properties: { creationDate: date.toISOString() },
    },
  },
  {
    node_a: {
      label: 'User',
      id: 'username',
      properties: { username: 'Camille' },
    },
    node_b: {
      label: 'Tag',
      id: 'id',
      properties: { id: 'cat' },
    },
    relation: {
      label: 'IS',
      properties: { creationDate: date.toISOString() },
    },
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
