const debug = require('debug')('routes:user');
const _ = require('lodash');
const express = require('express');
const identify = require('../middleware/identify');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const wrapper = require('../middleware/wrapper');

const router = express.Router();
const Notifications = require('../models/notificationsClass');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/:username', wrapper(async (req, res) => {
  debug('############ Getting notif list ##############');
  return (new Notifications({ receiver: req.params.username }).get()
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'read', result },
      });
    })
  );
}));

router.post('/create', wrapper(async (req, res) => {
  debug('############# Creating notif ###########');
  return (new Notifications(req.body).create()
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'read', result },
      });
    })
  );
}));

router.put('/read', wrapper(async (req, res) => {
  debug('############# Creating notif ###########');
  return (new Notifications(req.body).read()
    .then((result) => {
      debug(result);
      return res.status(200).json({
        success: true,
        payload: { value: 'read', result },
      });
    })
  );
}));

module.exports = router;
