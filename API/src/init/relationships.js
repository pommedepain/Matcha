
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
  return new Promise((resolve, reject) => {
    const promises = relationships.map(relation => (
      new Promise((res, rej) => {
        new RelationShip(relation).createRelationship()
          .then(res())
          .catch(err => rej(err));
      })
    ));
    Promise.all(promises)
      .then(resolve())
      .catch(err => reject(err));
  });
}

module.exports = populateRelationships;
