const debug = require('debug')('app:route_Tag');
const _ = require('lodash');
const express = require('express');
const identify = require('../middleware/identify');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const handler = require('../middleware/handler');

const router = express.Router();
const Tag = require('../models/tags');

const validProperties = ['id', 'text'];
const publicProperties = ['id', 'text'];

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get('/', handler(async (req, res) => {
  debug('Requesting Tag list...');
  return (new Tag().getTags()
    .then(tags => (
      res.status(200).json({
        success: true,
        payload: { value: 'read', tags },
      })
    ))
  );
}));

router.get('/:id', handler(async (req, res) => {
  debug('Request to get Tag information for :', req.params.id);
  return (new Tag({ id: req.params.id }).getTagInfo()
    .then((tag) => {
      const result = _.pick(tag, publicProperties);
      return res.status(200).json({
        success: true,
        payload: { value: 'read', result },
      });
    }));
}));

router.post('/', [auth, admin], handler(async (req, res) => {
  debug('Request to add new Tag :\n', _.pick(req.body, validProperties));
  return (new Tag(_.pick(req.body, validProperties)).createTag()
    .then(tag => (
      res.status(200).json({
        success: true,
        payload: { value: 'create', tag },
      })
    )));
}));

router.put('/:id', [auth, admin], handler(async (req, res) => {
  debug('Request to update :\n', _.pick(req.body, validProperties));
  return (new Tag(_.pick(req.body, validProperties)).updateTag()
    .then(tag => (
      res.status(200).json({
        success: true,
        payload: { value: 'update', tag },
      })
    )));
}));

router.delete('/:id', [auth, admin], handler(async (req, res) => {
  debug('Request to delete :', req.params.id);
  return (new Tag({ id: req.params.id }).deleteTag()
    .then(tag => (
      res.status(200).json({
        success: true,
        payload: { value: 'delete', tag },
      })
    )));
}));

module.exports = router;
