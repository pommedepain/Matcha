const debug = require('debug')('routes:user');
const _ = require('lodash');
const express = require('express');
const identify = require('../middleware/identify');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const wrapper = require('../middleware/wrapper');

const router = express.Router();
const User = require('../models/userClass');

const validProperties = ['username', 'firstName', 'lastName', 'password', 'email', 'birthdate', 'bio', 'gender', 'sexOrient', 'ageMin', 'ageMax', 'localisation', 'photo', 'tags', 'optional'];
const publicProperties = ['age', 'username', 'firstName', 'lastName', 'password', 'email', 'birthdate', 'bio', 'gender', 'sexOrient', 'ageMin', 'ageMax', 'localisation', 'tags', 'photo', 'optional', 'error', 'value'];

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/:value', wrapper(async (req, res) => {
  debug('Requesting list...');
  return (new User().getList(req.params.value)
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'read', result },
      });
    })
  );
}));

router.get('/infos/:username', wrapper(async (req, res) => {
  debug('Request to get user information for :', req.params.username);
  return (new User({ username: req.params.username }).getUserInfo()
    .then((user) => {
      const result = _.pick(user, publicProperties);
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'read', result },
      });
    }));
}));

router.get('/matches/:username', wrapper(async (req, res) => {
  debug('Request to get user matches :', req.params.username);
  return (new User({ username: req.params.username }).getMatches()
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'read', result },
      });
    }));
}));

router.get('/suggestions/:username', wrapper(async (req, res) => {
  debug('Request to get user matches :', req.params.username);
  return (new User({ username: req.params.username }).getSuggestions()
    .then((result) => {
      debug('haha', result);
      return res.status(200).json({
        success: true,
        payload: { value: 'read', result },
      });
    }));
}));


router.get('/:username/commonTags', wrapper(async (req, res) => {
  debug('Requesting list...');
  return (new User({ username: req.params.username }).getCommonTags()
    .then(result => (
      res.status(200).json({
        success: true,
        payload: { value: 'read', result },
      })
    ))
  );
}));

router.get('/:username/:relation', wrapper(async (req, res) => {
  debug('Requesting relation list...');
  return (new User({ username: req.params.username }).getRelations(req.params.relation)
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'read', result },
      });
    })
  );
}));

router.post('/', wrapper(async (req, res) => {
  debug('Request to add new user :\n', req.body);
  return (new User(req.body).createUser()
    .then(result => (
      res.status(200).json({
        success: true,
        payload: { value: 'create', result },
      })
    )));
}));

router.put('/:username', [auth, identify], wrapper(async (req, res) => {
  debug('Request to update :\n', _.pick(req.user, validProperties));
  return (new User(_.pick(req.user, validProperties)).updateUser(req.body)
    .then(result => (
      res.status(200).json({
        success: true,
        payload: { value: 'update', result },
      })
    )));
}));

router.delete('/:username', [auth, admin], wrapper(async (req, res) => {
  debug('Request to delete :', req.params.username);
  return (new User({ username: req.params.username }).deleteUser()
    .then(result => (
      res.status(200).json({
        success: true,
        payload: { value: 'delete', result },
      })
    )));
}));

router.delete('/delete/duplicates', wrapper(async (req, res) => {
  debug('Request to delete duplicates');
  return (new User().deleteUsersDuplicates()
    .then(result => (
      res.status(200).json({
        success: true,
        payload: { value: 'delete', result },
      })
    )));
}));

module.exports = router;
