
const debug = require('debug')('init:orientation');
const _ = require('lodash');
const Orientation = require('../models/orientationClass');

const requiredProperties = ['gender', 'type'];
const genders = ['male', 'female'];
const types = ['hetero', 'homo', 'bi', 'pan'];

function populateOrientations() {
  return new Promise((resolve, reject) => {
    const promises = genders.map(gender => (
      types.forEach((type) => {
        new Promise{ gender, type }
      }))

  });
}


async function populateOrientation() {
  const orientations = await getOrientations();
  return new Promise((resolve, reject) => {
    debug(orientations);
    resolve();
  });
}

module.exports = populateOrientation;
