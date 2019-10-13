/* eslint-disable max-len */
const debug = require('debug')('tests:user_route');
const _ = require('lodash');
const axios = require('axios');
const userTemplate = require('../util/userTemplate');

const infos = _.without(Object.keys(userTemplate), 'tags');
const route = 'http://localhost:4000/api/users';


test('GET request : infos array, expect lists', async () => {
  const promises = infos.map(info => (
    axios.get(`${route}/${info}`, null, null)
  ));
  return expect(Promise.all(promises)).resolves.toBeTruthy();
});

// test('POST request : /api/users, valid user expect user created', async () => {
//   const data = await new Request('/api/users/', validNewUser, null).post().catch(err => debug(err));
//   return expect(data).toBeTruthy();
// });

// test('POST request : /api/auth, expect valid jwt', async () => {
//   const data = await new Request('/api/auth', validNewUser, null).post().catch(err => debug(err));
//   return expect(data).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
// });

// test('PUT request : /api/users/Claudinete, valid user expect user updated', async () => {
//   const req = {};
//   req.value = updatedUser;
//   const token = await new Request('/api/auth', validNewUser).post().catch(err => debug(err));
//   const res = await new Request('/api/users/Claudinete', req, { headers: { 'x-auth-token': token } }).put().catch(err => debug(err));
//   return expect(res).toBeTruthy();
// });

// test('POST request : /api/users, valid user expect user created', async () => {
//   const data = await new Request('/api/users/', adminUser, null).post().catch(err => debug(err));
//   console.log(data);
//   return expect(data).toBeTruthy();
// });

// test('GET request : /api/users/user, expect user list, true', async () => {
//   const data = await new Request('/api/users', null, null).get().catch(err => debug(err));
//   return expect(data).toBeTruthy();
// });

// test('GET request : /api/users/user, invalid Auth expect 400 error', async () => {
//   const data = await new Request('/api/users/Claude', null, { headers: { 'x-auth-token': '42' } }).get().catch(err => debug(err));
//   return expect(data).toBe(false);
// });

// test('GET request : /api/users/user, no token expect 401 error', async () => {
//   const data = await new Request('/api/users/Claude', null, null).get().catch(err => debug(err));
//   return expect(data).toBe(false);
// });

// test('POST request : /api/auth, expect valid jwt', async () => {
//   const data = await new Request('/api/auth', validUserAuth, null).post().catch(err => debug(err));
//   return expect(data).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
// });

// test('POST request : /api/auth, invalid user expect 400 error', async () => {
//   const data = await new Request('/api/auth', invalidUserAuth, null).post().catch(err => debug(err));
//   return expect(data).toBe(false);
// });

// test('GET request : /api/users/Jean, expect user info, true', async () => {
//   const data = await new Request('/api/auth', validUserAuth).post().catch(err => debug(err));
//   const res = await new Request('/api/users/Jean', { headers: { 'x-auth-token': data } }, { headers: { 'x-auth-token': data } }).get().catch(err => debug(err));
//   return expect(res).toBeTruthy();
// });

// test('POST request : /api/users, valid user expect user created', async () => {
//   const data = await new Request('/api/users/', validNewUser, null).post().catch(err => debug(err));
//   return expect(data).toBeTruthy();
// });

// test('POST request : /api/users, user exists expect 400 error', async () => {
//   const data = await new Request('/api/users/', validNewUser, null).post().catch(err => debug(err));
//   return expect(data).toBe(false);
// });

// test('POST request : /api/users, invalid user expect error', async () => {
//   const data = await new Request('/api/users/', invalidNewUser, null).post().catch(err => debug(err));
//   return expect(data).toBe(false);
// });

// test('PUT request : /api/users/Jean, valid user expect user updated', async () => {
//   const req = {};
//   req.value = updatedUser;
//   const token = await new Request('/api/auth', validUserAuth).post().catch(err => debug(err));
//   const res = await new Request('/api/users/Jean', req, { headers: { 'x-auth-token': token } }).put().catch(err => debug(err));
//   return expect(res).toBeTruthy();
// });

// test('POST request : /api/auth, invalid user expect 400:bad request error', async () => {
//   const data = await new Request('/api/auth', invalidUserAuth).post().catch(err => debug(err));
//   return expect(data).toBe(false);
// });

// test('POST request : /api/auth, expect valid jwt', async () => {
//   const data = await new Request('/api/auth', updatedUser).post().catch(err => debug(err));
//   return expect(data).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
// });

// test('PUT request : /api/users/Jean, valid user expect user updated', async () => {
//   const req = {};
//   req.value = validUserAuth;
//   const token = await new Request('/api/auth', updatedUser).post().catch(err => debug(err));
//   const res = await new Request('/api/users/Jean', req, { headers: { 'x-auth-token': token } }).put().catch(err => debug(err));
//   return expect(res).toBeTruthy();
// });


// test('PUT request : /api/users/Jean, wrong user expect error 403:forbidden', async () => {
//   const req = {};
//   req.value = updatedUser;
//   const token = await new Request('/api/auth', validNewUser).post().catch(err => debug(err));
//   const res = await new Request('/api/users/Jean', req, { headers: { 'x-auth-token': token } }).put().catch(err => debug(err));
//   return expect(res).toBe(false);
// });


// test('PUT request : /api/users/Jean, Admin user expect user updated', async () => {
//   const req = {};
//   req.value = validUserAuth;
//   const token = await new Request('/api/auth', adminUser).post().catch(err => debug(err));
//   const res = await new Request('/api/users/Jean', req, { headers: { 'x-auth-token': token } }).put().catch(err => debug(err));
//   return expect(res).toBeTruthy();
// });

// test('DEL request : /api/users/Claudinete, wrong user expect error 403:forbidden', async () => {
//   const data = await new Request('/api/auth', validNewUser).post().catch(err => debug(err));
//   const res = await new Request('/api/users/Claudinete', data).delete().catch(err => debug(err));
//   return expect(res).toBe(false);
// });

// test('DEL request : /api/users/Claudinete, Admin user expect user deleted', async () => {
//   const token = await new Request('/api/auth', adminUser).post().catch(err => debug(err));
//   const res = await new Request('/api/users/Claudinete', { headers: { 'x-auth-token': token } }, { headers: { 'x-auth-token': token } }).delete().catch(err => debug(err));
//   return expect(res).toBeTruthy();
// });
