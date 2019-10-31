const debug = require('debug')('routes:user');
const _ = require('lodash');
const express = require('express');
const identify = require('../middleware/identify');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const wrapper = require('../middleware/wrapper');

const router = express.Router();
const User = require('../models/userClass');

const validProperties = ['username', 'firstName', 'lastName', 'password', 'email', 'birthdate', 'bio', 'gender', 'sexOrient', 'ageMin', 'ageMax', 'localisation', 'photos', 'tags', 'optional'];
const publicProperties = ['age', 'isTags', 'blocked', 'lookTags', 'username', 'firstName', 'lastName', 'birthdate', 'bio', 'gender', 'sexOrient', 'ageMin', 'ageMax', 'localisation', 'tags', 'photos', 'optional', 'error', 'value'];

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

router.get('/sendReset/:username', wrapper(async (req, res) => {
  debug('Request to send reset pwd mail to :', req.params.username);
  return (new User({ username: req.params.username }).sendResetLink()
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'sendReset', result },
      });
    }));
}));

router.get('/reset/:username/:token', wrapper(async (req, res) => {
  debug('Request to reset pwd:\n', req.params.username);
  return (new User({ username: req.params.username }).resetPwd(req.params.token)
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'resetPwd', result },
      });
    }));
}));

router.get('/confirm/:username/:token', wrapper(async (req, res) => {
  debug('Request to confirm mail:\n', req.params.username);
  return (new User({ username: req.params.username }).confirmUser(req.params.token)
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'confirmation', result },
      });
    }));
}));

router.get('/infos/:username', wrapper(async (req, res) => {
  debug('Request to get user information for :', req.params.username);
  return (new User({ username: req.params.username }).getUserInfo()
    .then((user) => {
      debug(user);
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
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'read', result },
      });
    }));
}));


router.get('/:username/commonTags', wrapper(async (req, res) => {
  debug('Requesting list...');
  return (new User({ username: req.params.username }).getCommonTags()
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'read', result },
      });
    })
  );
}));

router.get('/:username/likedBy', wrapper(async (req, res) => {
  debug('Requesting list...');
  return (new User({ username: req.params.username }).getLikedBy()
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'read', result },
      });
    })
  );
}));

router.get('/:username/viewedBy', wrapper(async (req, res) => {
  debug('Requesting list...');
  return (new User({ username: req.params.username }).getViewedBy()
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'read', result },
      });
    })
  );
}));

router.get('/:username/BLOCK', wrapper(async (req, res) => {
  debug('Requesting relation list...');
  return (new User({ username: req.params.username }).getBlocked()
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'read', result },
      });
    })
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
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'create', result },
      });
    }));
}));


router.put('/:username', [auth, identify], wrapper(async (req, res) => {
  debug('Request to update :\n', _.pick(req.user, validProperties));
  return (new User(_.pick(req.user, validProperties)).updateUser(req.body)
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'update', result },
      });
    }));
}));

router.delete('/:username', [auth, admin], wrapper(async (req, res) => {
  debug('Request to delete :', req.params.username);
  return (new User({ username: req.params.username }).deleteUser()
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'delete', result },
      });
    }));
}));

router.delete('/delete/duplicates', wrapper(async (req, res) => {
  debug('Request to delete duplicates');
  return (new User().deleteUsersDuplicates()
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'delete', result },
      });
    }));
}));

module.exports = router;
