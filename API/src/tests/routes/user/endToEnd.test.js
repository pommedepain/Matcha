/* eslint-disable max-len */
const debug = require('debug')('tests:user_route');
const _ = require('lodash');
const axios = require('axios');
const userTemplate = require('../../../util/userTemplate');

const infos = _.without(Object.keys(userTemplate), 'tags');
const route = 'http://localhost:4000/api';

const validNewUser = {
  username: 'testUser',
  firstName: 'testFname',
  lastName: 'testLname',
  gender: 'male',
  bio: ' THIS IS A TEST!',
  localisation: 77,
  ageMin: 18,
  ageMax: 99,
  password: 'Test12345*',
  email: 'testmail@gmail.com',
  birthdate: '1992-03-27',
  tags: [{ id: 'athlete', text: 'something' }, { id: 'book', text: 'lala' }],
  isTags: [{ id: 'cat', text: 'something' }, { id: 'book', text: 'lala' }],
  isAdmin: 'true',
};

const updatedUSer = {
  username: 'testUser',
  sexOrient: 'hetero',
  isTags: [{ id: 'dog', text: 'something' }],
  isAdmin: 'true',
};

test('POST request : /api/users, valid user expect user created', async () => {
  const res = await axios.post(`${route}/users`, validNewUser, null);
  return expect(res.data.success).toBe(true);
});

test('POST request : /api/auth, expect valid jwt', async () => {
  const res = await axios.post(`${route}/auth`, validNewUser, null);
  return expect(res.data.payload).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
});

// test('GET request : infos array, expect suggestions lists', async () => {
//   const res = await axios.get(`${route}/users//suggestions/${updatedUSer.username}`, null, null);
//   return expect(res.data.success).toBe(true);
// });

// test('PUT request : /api/users, successful update', async () => {
//   const token = await axios.post(`${route}/auth`, validNewUser, null);
//   const res = await axios.put(`${route}/users/${updatedUSer.username}`, updatedUSer, { headers: { 'x-auth-token': token.data.payload } });
//   return expect(res.data.success).toBe(true);
// });

// test('GET request : infos array, expect suggestions lists', async () => {
//   const res = await axios.get(`${route}/users//suggestions/${updatedUSer.username}`, null, null);
//   return expect(res.data.success).toBe(true);
// });
