const Joi = require('@hapi/joi');
const debug = require('debug')('validation:relationships');
const UserValidator = require('./users');
const TagValidator = require('./tags');

class RelationshipValidator {

  constructor(requirements, data) {
    this.req = requirements;
    this.data = data;
    if (
      this.data.relation === 'undefined' || this.data.relation === 0 || this.data.relation === null
    ) this.data = null;
    debug('Validating relationship data...');
    // debug(this.data);
  }

  validateNodea() {
    return new Promise((resolve) => {
      if (this.req.node_a && this.data.node_a.type === 'User') {
        resolve(new UserValidator({ username: true }, this.data.node_a.value).validate());
      } else if (this.req.node_a && this.data.node_a.type === 'Tag') {
        resolve(new TagValidator({ id: true }, this.data.noda_a.value).validate());
      } else resolve(true);
    });
  }

  validateNodeb() {
    return new Promise((resolve) => {
      if (this.req.node_b && this.data.node_b.type === 'User') {
        resolve(new UserValidator({ username: true }, this.data.node_b.value).validate());
      } else if (this.req.node_b && this.data.node_b.type === 'Tag') {
        resolve(new TagValidator({ id: true }, this.data.node_b.value).validate());
      } else resolve(true);
    });
  }

  validateRelationship() {
    return new Promise((resolve, reject) => {
      const sch = {};

      if (this.req.relation) sch.relation = Joi.string().regex(/^[a-zA-Z-_]{2,30}$/).required();
      else sch.relation = Joi.string().regex(/^[a-zA-Z-_]{2,30}$/);

      Joi.validate({ relation: this.data.relation }, sch, (err, value) => {
        if (err === null) resolve({ success: true, value });
        else {
          debug(err);
          reject(err);
        }
      });
    });
  }

  validate() {
    return new Promise((resolve, reject) => {
      this.validateNodea()
        .then(() => this.validateNodea())
        .then(() => this.validateNodeb())
        .then(() => this.validateRelationship())
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

}

module.exports = RelationshipValidator;
