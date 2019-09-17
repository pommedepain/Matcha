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


router.get('/type/:type', handler(async (req, res) => {
  debug('Request to get Relationship information for :', req.params.type);
  return (new Relationship({ relation: { label: req.params.type } }).getRelationships()
    .then(relationship => (
      res.status(200).json({
        success: true,
        payload: { value: 'read', relationship },
      })
    )));
}));

router.get('/mutual', handler(async (req, res) => {
  debug('Request to get Relationship information for :', req.body);
  return (new Relationship(req.body).getNodeMutualRelationships()
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

router.delete('/delete/relation', [auth, admin], handler(async (req, res) => {
  debug('Request to delete :', req.body.relation);
  return (new Relationship(req.body).deleteRelationship()
    .then(relationship => (
      res.status(200).json({
        success: true,
        payload: { value: 'delete', relationship },
      })
    )));
}));

router.delete('/delete/node/', [auth, admin], handler(async (req, res) => {
  debug('Request to delete :', req.body.node_a);
  return (new Relationship(req.body).deleteThisNodeRelationships()
    .then(relationship => (
      res.status(200).json({
        success: true,
        payload: { value: 'delete', relationship },
      })
    )));
}));

router.delete('/delete/type', [auth, admin], handler(async (req, res) => {
  debug('Request to delete :', req.body.node_a);
  return (new Relationship(req.body).deleteThisTypeofRelationship()
    .then(relationship => (
      res.status(200).json({
        success: true,
        payload: { value: 'delete', relationship },
      })
    )));
}));

router.delete('/delete/node/type', [auth, admin], handler(async (req, res) => {
  debug('Request to delete :', req.body.node_a);
  return (new Relationship(req.body).deleteThisNodeTypeofRelationship()
    .then(relationship => (
      res.status(200).json({
        success: true,
        payload: { value: 'delete', relationship },
      })
    )));
}));

module.exports = router;
