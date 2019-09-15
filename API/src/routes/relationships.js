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


router.get('/type/:relation', handler(async (req, res) => {
  debug('Request to get Relationship information for :', req.params.id);
  return (new Relationship({ relation: req.params.relation }).getRelationships()
    .then(relationship => (
      res.status(200).json({
        success: true,
        payload: { value: 'read', relationship },
      })
    )));
}));

router.post('/:type_a.:id_a.:value_a/:type_b.:id_b.:value_b/:relation', handler(async (req, res) => {
  debug('Request to add new Relationship :\n', _.pick(req.body, validProperties));
  return (new Relationship(
    {
      node_a: {
        type: req.params.type_a,
        id: req.params.id_a,
        value: req.params.value_a,
      },
      node_b: {
        type: req.params.type_b,
        id: req.params.id_b,
        value: req.params.value_b,
      },
      relation: req.param.relation,
    },
  ).createRelationship()
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
