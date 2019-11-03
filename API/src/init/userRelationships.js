
const debug = require('debug')('init:relationships');
const RelationShip = require('../models/relationshipsClass');
const User = require('../models/userClass');
const Tag = require('../models/tagClass');

const date = new Date();
const chaosCounter = 2;

function rand(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function randomRelations() {
  const users = await new User().getList('username');
  return new Promise((resolve, reject) => {
    const relations = [];
    const promises = users.map(user => (
      new Promise((res) => {
        for (let i = 0; i < chaosCounter; i += 1) {
          const target = users[rand(0, users.length - 1)];
          if (target !== user) {
            relations.push(
              {
                node_a: {
                  label: 'User',
                  id: 'username',
                  properties: { username: user },
                },
                node_b: {
                  label: 'User',
                  id: 'username',
                  properties: { username: target },
                },
                relation: {
                  label: 'LIKES',
                  properties: { creationDate: date.toLocaleString() },
                },
              },
            );
          }
          res();
        }
      })
    ));

    Promise.all(promises)
      .then(() => resolve(relations))
      .catch(err => reject(err));
  });
}

function populateRelationships(type) {
  return (randomRelations(type)
    .then((relations) => {
      relations.push(
        {
          node_a: {
            label: 'User',
            id: 'username',
            properties: { username: 'camille' },
          },
          node_b: {
            label: 'User',
            id: 'username',
            properties: { username: 'philoutre' },
          },
          relation: {
            label: 'LIKES',
            properties: { creationDate: date.toLocaleString() },
          },
        },
      );
      return (relations.reduce(async (prev, next) => {
        await prev;
        return new RelationShip(next).createRelationship();
      }, Promise.resolve()));
    }));
}

module.exports = populateRelationships;
