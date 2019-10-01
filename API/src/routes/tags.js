const debug = require('debug')('routes:tag');
const _ = require('lodash');
const express = require('express');
const identify = require('../middleware/identify');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const wrapper = require('../middleware/wrapper');

const router = express.Router();
const Tag = require('../models/tagClass');

const validProperties = ['id', 'text'];
const publicProperties = ['id', 'text'];

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get('/', wrapper(async (req, res) => {
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

router.get('/:id', wrapper(async (req, res) => {
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

router.post('/', [auth, admin], wrapper(async (req, res) => {
  debug('Request to add new Tag :\n', _.pick(req.body, validProperties));
  return (new Tag(_.pick(req.body, validProperties)).createTag()
    .then(tag => (
      res.status(200).json({
        success: true,
        payload: { value: 'create', tag },
      })
    )));
}));

router.put('/:id', [auth, admin], wrapper(async (req, res) => {
  debug('Request to update :\n', _.pick(req.body, validProperties));
  return (new Tag(_.pick(req.body, validProperties)).updateTag()
    .then(tag => (
      res.status(200).json({
        success: true,
        payload: { value: 'update', tag },
      })
    )));
}));

router.delete('/:id', [auth, admin], wrapper(async (req, res) => {
  debug('Request to delete :', req.params.id);
  return (new Tag({ id: req.params.id }).deleteTag()
    .then(tag => (
      res.status(200).json({
        success: true,
        payload: { value: 'delete', tag },
      })
    )));
}));

router.delete('/delete/duplicates', wrapper(async (req, res) => {
  debug('Request to delete duplicates:', req.params.username);
  return (new Tag().deleteTagsDuplicates()
    .then(result => (
      res.status(200).json({
        success: true,
        payload: { value: 'delete', result },
      })
    )));
}));

module.exports = router;
