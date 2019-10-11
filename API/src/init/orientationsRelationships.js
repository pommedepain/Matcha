
const debug = require('debug')('init:relationships');
const RelationShip = require('../models/relationshipsClass');
const orientationsRelationships = require('../util/orientationsRelationships');


function populateOrientationsRelationships() {
  return new Promise((resolve, reject) => {
        const promises = orientationsRelationships.map(relation => (
          new Promise((res, rej) => {
            new RelationShip(relation).createRelationship()
              .then(() => res())
              .catch(err => res(err));
          })
        ));
        Promise.all(promises)
          .then(debug('All orientationsrelationships created'))
          .then(() => resolve())
          .catch(err => reject(err));
      });
}

module.exports = populateOrientationsRelationships;