
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
  const tags = await new Tag().getList('id');
  return new Promise((resolve, reject) => {
    const relations = [];
    const promises = users.map(user => (
      new Promise((res) => {
        for (let i = 0; i < chaosCounter; i += 1) {
          const tag = tags[rand(0, tags.length - 1)];
          const target = users[rand(0, users.length - 1)];
          relations.push(
            {
              node_a: {
                label: 'User',
                id: 'username',
                properties: { username: user },
              },
              node_b: {
                label: 'Tag',
                id: 'id',
                properties: { id: tag },
              },
              relation: {
                label: 'IS',
                properties: { creationDate: date.toISOString() },
              },
            },
          );
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
                  properties: { creationDate: date.toISOString() },
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
  return (
    randomRelations(type).then(relations => (
      new Promise((resolve, reject) => {
        const promises = relations.map(relation => (
          new Promise((res, rej) => {
            new RelationShip(relation).createRelationship()
              .then(() => res())
              .catch(err => res(err));
          })
        ));
        Promise.all(promises)
          .then(debug('All relationships created'))
          .then(() => resolve())
          .catch(err => reject(err));
      })
    ))
  );
}

module.exports = populateRelationships;
