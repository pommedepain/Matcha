
const debug = require('debug')('init:orientation');
const _ = require('lodash');
const Orientation = require('../models/orientationClass');

const requiredProperties = ['gender', 'type'];
const genders = ['male', 'female'];
const types = ['hetero', 'homo', 'bi', 'pan'];

function populateOrientations() {
  return new Promise((resolve, reject) => {
    const promises = genders.map(gender => (
      types.forEach(type => (
        new Promise((res, rej) => (
          new Orientation({ id: `${gender}_${type}` }).createOrientation()
            .then(() => res())
            .catch(err => rej(err))
        ))
      ))
    ));
    Promise.all(promises)
      .then(debug('All Orientations created'))
      .then(() => resolve())
      .catch(err => reject(err));
  });
}

module.exports = populateOrientations;
