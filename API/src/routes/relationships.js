const debug = require('debug')('routes:relationships');
const _ = require('lodash');
const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const handler = require('../middleware/wrapper');

const router = express.Router();
const Relationship = require('../models/relationshipsClass');

const validProperties = ['node_a', 'node_b', 'relation'];
const publicProperties = ['node_a', 'node_b', 'relation'];

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get('/get/:type', handler(async (req, res) => {
  debug('Request to get Relationship information for :', req.params.type);
  return (new Relationship({ relation: req.params.type }).getRelationships()
    .then(relationship => (
      res.status(200).json({
        success: true,
        payload: { value: 'read', relationship },
      })
    )));
}));

router.post('/create', handler(async (req, res) => {
  debug('Request to add new Relationship :\n', _.pick(req.body, validProperties));
  return (new Relationship(req.body).createRelationship()
    .then(relationship => (
      res.status(200).json({
        success: true,
        payload: { value: 'create', relationship },
      })
    )));
}));

router.post('/toggle', handler(async (req, res) => {
  debug('Request to add new Relationship :\n', _.pick(req.body, validProperties));
  return (new Relationship(req.body).toggleRelationship()
    .then(relationship => (
      res.status(200).json({
        success: true,
        payload: { value: 'toggle', relationship },
      })
    )));
}));

router.delete('/delete/:node_a/:node_b/:relation', [auth, admin], handler(async (req, res) => {
  debug('Request to delete :', req.params.id);
  return (new Relationship({ id: req.params.id }).deleteRelationship()
    .then(relationship => (
      res.status(200).json({
        success: true,
        payload: { value: 'delete', relationship },
      })
    )));
}));

module.exports = router;
