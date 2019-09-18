

const debug = require('debug')('init:users');
const _ = require('lodash');
const axios = require('axios');

const User = require('../models/userClass');

const props = ['gender', 'email', 'password'];
const requiredProperties = ['username', 'firstName', 'lastName', 'password', 'email', 'birthdate'];
const optionalProperties = ['bio', 'gender', 'sexOrient', 'ageMin', 'ageMax', 'tags', 'localisation', 'optional', 'isAdmin'];
const amount = 25;

function rand(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

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

function randomTags(users) {
  return new Promise((resolve, reject) => {
    users.forEach((user) => {
      const len = tags.length;
      const random1 = rand(0, len - 1);
      const random2 = rand(0, len - 1);
      const random3 = rand(0, len - 1);
      user.tags.push(tags[random1]);
      if (random2 !== random1) user.tags.push(tags[random2]);
      if (random3 !== random2 && random3 !== random1) user.tags.push(tags[random3]);
    });
    resolve(users);
  });
}


function userParser(user) {
  return new Promise((resolve, reject) => {
    if (user !== undefined) {
      const newUser = _.pick(user, props);
      newUser.username = user.name;
      newUser.lastName = user.surname;
      newUser.firstName = user.name;
      const date = new Date(user.birthday.raw * 1000);
      const birthdate = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
      newUser.birthdate = birthdate;
      newUser.sexOrient = 'hetero';
      newUser.ageMin = rand(18, 99);
      newUser.ageMax = rand(newUser.ageMin, 100);
      newUser.tags = [];
      resolve(newUser);
    }
  });
}

function getUsers() {
  return new Promise((resolve, reject) => {
    axios.get(`https://uinames.com/api/?amount=${amount}&region=france&ext`)
      .then((res) => {
        const users = [];
        const promises = [];
        res.data.forEach((user) => {
          const p = userParser(user)
            .then(newuser => users.push(newuser))
            .catch(err => debug(err));
          promises.push(p);
        });
        Promise.all(promises)
          .then(resolve(users))
          .catch(err => reject(err));
      })
      .catch(err => debug(err));
  });
}

function populateUsers() {
  getUsers()
    .then(users => randomTags(users))
    .then((users) => {
      const promises = [];
      debug('Populating Users in DB...');
      users.forEach((user) => {
        const p = new User(_.pick(user, requiredProperties.concat(optionalProperties))).createUser()
          .catch(err => debug(err));
        promises.push(p);
      });
      return Promise.all(promises);
    });
}

module.exports = populateUsers;
