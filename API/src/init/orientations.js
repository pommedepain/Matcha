
const debug = require('debug')('init:orientation');
const _ = require('lodash');
const Orientation = require('../models/orientationClass');

const orientations = [
  'm_hetero',
  'm_homo',
  'm_bi',
  'm_pan',
  'f_hetero',
  'f_homo',
  'f_bi',
  'f_pan',
];

function populateOrientations() {
  return new Promise((resolve, reject) => {
    const promises = orientations.map(orientation => (
      new Promise((res, rej) => (
        new Orientation({ id: orientation }).createOrientation()
          .then(() => res())
          .catch(err => res(err))
      ))
    ));
    Promise.all(promises)
      .then(debug('All Orientations created'))
      .then(() => resolve())
      .catch(err => reject(err));
  });
}

module.exports = populateOrientations;
