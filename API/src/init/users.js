

const debug = require('debug')('init:users');
const _ = require('lodash');
const axios = require('axios');

const User = require('../models/userClass');

const props = ['gender', 'email', 'password'];
const requiredProperties = ['username', 'firstName', 'lastName', 'password', 'email', 'birthdate'];
const optionalProperties = ['bio', 'gender', 'sexOrient', 'ageMin', 'ageMax', 'tags', 'photo', 'localisation', 'optional', 'isAdmin'];
const amount = 10;

function rand(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const admin = {
  username: 'Camille',
  firstName: 'Camille',
  lastName: 'Julien',
  password: 'Test12345*',
  email: 'camille@gmail.com',
  birthdate: '1992-27-03',
  tags: [{ id: 'athlete', text: 'something' }, { id: 'book', text: 'lala' }],
  isAdmin: 'true',
};

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
      newUser.photo = user.photo;
      const date = new Date(user.birthday.raw * 1000);
      const birthdate = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
      newUser.birthdate = birthdate;
      const sexOrient = rand(1, 5);
      if (sexOrient === 1 || sexOrient === 5) newUser.sexOrient = 'hetero';
      else if (sexOrient === 2) newUser.sexOrient = 'homo';
      else if (sexOrient === 3) newUser.sexOrient = 'bi';
      else if (sexOrient === 4) newUser.sexOrient = 'pan';
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
        users.push(admin);
        Promise.all(promises)
          .then(() => resolve(users))
          .catch(err => reject(err));
      })
      .catch(err => debug(err));
  });
}


function populateUsers() {
  return new Promise((resolve, reject) => {
    getUsers()
      .then(users => randomTags(users))
      .then((users) => {
        const promises = users.map(user => (
          new Promise((res, rej) => {
            new User(_.pick(user, requiredProperties.concat(optionalProperties))).createUser()
              .then(() => res())
              .catch(err => res(err));
          })
        ));
        Promise.all(promises)
          .then(debug('All Users created'))
          .then(() => resolve())
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
}

module.exports = populateUsers;
