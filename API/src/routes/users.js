const debug = require('debug')('routes:user');
const _ = require('lodash');
const express = require('express');
const identify = require('../middleware/identify');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const wrapper = require('../middleware/wrapper');

const router = express.Router();
const User = require('../models/userClass');

const validProperties = ['username', 'firstName', 'lastName', 'password', 'email', 'birthdate', 'bio', 'gender', 'sexOrient', 'ageMin', 'ageMax', 'localisation', 'tags', 'optional'];
const publicProperties = ['username', 'firstName', 'lastName', 'password', 'email', 'birthdate', 'bio', 'gender', 'sexOrient', 'ageMin', 'ageMax', 'localisation', 'tags', 'optional', 'error', 'value'];

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get('/:value', wrapper(async (req, res) => {
  debug('Requesting user list...');
  return (new User().getList(req.params.value)
    .then(users => (
      res.status(200).json({
        success: true,
        payload: { value: 'read', users },
      })
    ))
  );
}));

router.get('/infos/:username', wrapper(async (req, res) => {
  debug('Request to get user information for :', req.params.username);
  return (new User({ username: req.params.username }).getUserInfo()
    .then((user) => {
      const result = _.pick(user, publicProperties);
      return res.status(200).json({
        success: true,
        payload: { value: 'read', result },
      });
    }));
}));

router.get('/matches/:username', wrapper(async (req, res) => {
  debug('Request to get user matches :', req.params.username);
  return (new User({ username: req.params.username }).getMatches()
    .then((list) => {
      debug(list);
      return res.status(200).json({
        success: true,
        payload: { value: 'read', list },
      });
    }));
}));

router.post('/', wrapper(async (req, res) => {
  debug('Request to add new user :\n', _.pick(req.body, validProperties));
  return (new User(_.pick(req.body, validProperties)).createUser()
    .then(user => (
      res.status(200).json({
        success: true,
        payload: { value: 'create', user },
      })
    )));
}));

router.put('/:username', [auth, identify], wrapper(async (req, res) => {
  debug('Request to update :\n', _.pick(req.body, validProperties));
  return (new User(_.pick(req.body, validProperties)).updateUser()
    .then(user => (
      res.status(200).json({
        success: true,
        payload: { value: 'update', user },
      })
    )));
}));

router.delete('/:username', [auth, admin], wrapper(async (req, res) => {
  debug('Request to delete :', req.params.username);
  return (new User({ username: req.params.username }).deleteUser()
    .then(user => (
      res.status(200).json({
        success: true,
        payload: { value: 'delete', user },
      })
    )));
}));

router.delete('/delete/duplicates', wrapper(async (req, res) => {
  debug('Request to delete duplicates');
  return (new User().deleteUsersDuplicates()
    .then(user => (
      res.status(200).json({
        success: true,
        payload: { value: 'delete', user },
      })
    )));
}));

module.exports = router;
