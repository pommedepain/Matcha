const debug = require('debug')('app:route_Relationship');
const _ = require('lodash');
const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const handler = require('../middleware/handler');

const router = express.Router();
const Relationship = require('../models/relationships');

const validProperties = ['node_a', 'node_b', 'relation'];
const publicProperties = ['node_a', 'node_b', 'relation'];

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get('/type/:relation', handler(async (req, res) => {
  debug('Request to get Relationship information for :', req.params.id);
  return (new Relationship({ relation: req.params.relation }).getRelationships()
    .then((relationship) => {
      const result = _.pick(relationship, publicProperties);
      return res.status(200).json({
        success: true,
        payload: { value: 'read', result },
      });
    }));
}));

router.post('/node_a/:type.:id.:value/node_b/:type.:id.:value/:relation', [auth, admin], handler(async (req, res) => {
  debug('Request to add new Relationship :\n', _.pick(req.body, validProperties));
  return (new Relationship(_.pick(req.body, validProperties)).createRelationship()
    .then(relationship => (
      res.status(200).json({
        success: true,
        payload: { value: 'create', relationship },
      })
    )));
}));

router.delete('/:relation/:node_a/:node_b/:relation', [auth, admin], handler(async (req, res) => {
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
