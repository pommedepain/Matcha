
const debug = require('debug')('init:tags');
const _ = require('lodash');
const Tag = require('../models/tagClass');

const requiredProperties = ['id', 'text'];

const tags = [
  { id: 'cinema', text: 'Cinema Lover' },
  { id: 'traveler', text: 'Traveler' },
  { id: 'cat', text: 'Cat Person' },
  { id: 'dog', text: 'Dog Person' },
  { id: 'nature', text: 'Nature Lover' },
  { id: 'family', text: 'Family-Oriented' },
  { id: 'party', text: 'Party Animal' },
  { id: 'book', text: 'Bookworm' },
  { id: 'extrovert', text: 'Extrovert' },
  { id: 'introvert', text: 'Introvert' },
  { id: 'creative', text: 'Creative' },
  { id: 'animal', text: 'Animal Lover' },
  { id: 'arts', text: 'Patron of the Arts' },
  { id: 'athlete', text: 'Athlete' },
  { id: 'geek', text: 'Geek' },
];

function populateTags() {
  return new Promise((resolve, reject) => {
    const promises = [];
    debug('Populating Tags in DB...');
    tags.forEach((tag) => {
      const p = new Tag(_.pick(tag, requiredProperties)).createTag();
      promises.push(p);
    });
    Promise.all(promises)
      .then(resolve())
      .catch(err => reject(err));
  });

}

module.exports = populateTags;
