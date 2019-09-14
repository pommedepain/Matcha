const debug = require('debug')('app:reqtest');
const Request = require('./src/requestsClass');

const adminUser = {
  username: 'Camille',
  password: 'Test123*',
};

test('GET request : /api/tags/, expect tag list, true', async () => {
  const data = await new Request('/api/tags', null).get().catch(err => debug(err));
  return expect(data).toBeTruthy();
});

test('GET request : /api/tags/user, tag detail', async () => {
  const data = await new Request('/api/tags/cat', null).get().catch(err => debug(err));
  return expect(data).toBeTruthy();
});

// test('POST request : /api/auth, invalid user expect 400 error', async () => {
//   const data = await new Request('/api/auth', invalidUserAuth).post().catch(err => debug(err));
//   return expect(data).toBe(false);
// });

// test('GET request : /api/tags/Jean, expect user info, true', async () => {
//   const data = await new Request('/api/auth', validUserAuth).post().catch(err => debug(err));
//   const res = await new Request('/api/tags/Jean', data).get().catch(err => debug(err));
//   return expect(res).toBeTruthy();
// });

// test('POST request : /api/tags, valid user expect user created', async () => {
//   const data = await new Request('/api/tags/', validNewUser).post().catch(err => debug(err));
//   return expect(data).toBeTruthy();
// });

// test('POST request : /api/tags, invalid user expect error', async () => {
//   const data = await new Request('/api/tags/', invalidNewUser).post().catch(err => debug(err));
//   return expect(data).toBe(false);
// });

// test('PUT request : /api/tags/Jean, valid user expect user updated', async () => {
//   const req = {};
//   req.user = updatedUser;
//   req.token = await new Request('/api/auth', validUserAuth).post().catch(err => debug(err));
//   const res = await new Request('/api/tags/Jean', req).put().catch(err => debug(err));
//   return expect(res).toBeTruthy();
// });

// test('PUT request : /api/tags/Jean, wrong user expect error 403:forbidden', async () => {
//   const req = {};
//   req.user = updatedUser;
//   req.token = await new Request('/api/auth', validNewUser).post().catch(err => debug(err));
//   const res = await new Request('/api/tags/Jean', req).put().catch(err => debug(err));
//   return expect(res).toBe(false);
// });

// test('PUT request : /api/tags/Jean, Admin user expect user updated', async () => {
//   const req = {};
//   req.user = updatedUser;
//   req.token = await new Request('/api/auth', adminUser).post().catch(err => debug(err));
//   const res = await new Request('/api/tags/Jean', req).put().catch(err => debug(err));
//   return expect(res).toBeTruthy();
// });

// test('DEL request : /api/tags/Claudinete, wrong user expect error 403:forbidden', async () => {
//   const data = await new Request('/api/auth', validNewUser).post().catch(err => debug(err));
//   const res = await new Request('/api/tags/Claudinete', data).delete().catch(err => debug(err));
//   return expect(res).toBe(false);
// });

// test('DEL request : /api/tags/Claudinete, Admin user expect user deleted', async () => {
//   const data = await new Request('/api/auth', adminUser).post().catch(err => debug(err));
//   const res = await new Request('/api/tags/Claudinete', data).delete().catch(err => debug(err));
//   return expect(res).toBeTruthy();
// });
