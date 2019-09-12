
const neo4j = require('neo4j-driver').v1;
const debug = require('debug')('app:startup');
const _ = require('lodash');
const Tags = require('../models/tags');

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
const session = driver.session();

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
  const promises = [];
  debug('Populating Tags in DB...');
  tags.forEach((tag) => {
    const p = new Tags(_.pick(tag, requiredProperties)).createTag();
    promises.push(p);
  });
  return Promise.all(promises);
}

module.exports = populateTags;
