
const Joi = require('@hapi/joi');
const Complexity = require('joi-password-complexity');
const debug = require('debug')('validation:user');

class UserValidator {

  constructor(requirements, data) {
    this.req = requirements;
    this.data = data;
    this.passwordConf = {
      min: 7,
      max: 20,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 1,
    };
    if (
      this.data.username === 'undefined' || this.data.username === 0 || this.data.username === null
      || this.data.firstName === 'undefined' || this.data.firstName === 0 || this.data.firstName === null
      || this.data.lastName === 'undefined' || this.data.lastName === 0 || this.data.lastName === null
      || this.data.firstName === 'undefined' || this.data.firstName === 0 || this.data.firstName === null
      || this.data.password === 'undefined' || this.data.password === 0 || this.data.password === null
      || this.data.birthdate === 'undefined' || this.data.birthdate === 0 || this.data.birthdate === null
      || this.data.bio === 'undefined' || this.data.bio === 0 || this.data.bio === null
      || this.data.gender === 'undefined' || this.data.gender === 0 || this.data.gender === null
      || this.data.ageMin === 'undefined' || this.data.ageMin === 0 || this.data.ageMin === null
      || this.data.ageMax === 'undefined' || this.data.ageMax === 0 || this.data.ageMax === null
      || this.data.sexOrient === 'undefined' || this.data.sexOrient === 0 || this.data.sexOrient === null
      || this.data.isAdmin === 'undefined' || this.data.isAdmin === 0 || this.data.isAdmin === null
    ) this.data = null;
    debug('Validating user data...');
  }

  validate() {
    return new Promise((resolve, reject) => {
      const sch = {};

      if (this.req.username) sch.username = Joi.string().alphanum().min(4).max(30).required();
      else sch.username = Joi.string().alphanum().min(4).max(30);

      if (this.req.firstName) sch.firstName = Joi.string().regex(/^[a-zA-Z]{3,30}$/).required();
      else sch.firstName = Joi.string().regex(/^[a-zA-Z]{3,30}$/);

      if (this.req.lastName) sch.lastName = Joi.string().regex(/^[a-zA-Z]{3,30}$/).required();
      else sch.lastName = Joi.string().regex(/^[a-zA-Z]{3,30}$/);

      if (this.req.password) sch.password = new Complexity(this.passwordConf).required();
      else sch.password = new Complexity(this.passwordConf);

      if (this.req.birthdate) {
        sch.birthdate = Joi.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).required();
      } else sch.birthdate = Joi.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/);

      if (this.req.email) sch.email = Joi.string().email({ minDomainSegments: 2 }).required();
      else sch.email = Joi.string().email({ minDomainSegments: 2 });

      if (this.req.bio) sch.bio = Joi.string().regex(/^[\w 0-9]{1,255}$/).required();
      else sch.bio = Joi.string().regex(/^[\w 0-9]{1,255}$/);

      if (this.req.gender) sch.gender = Joi.string().regex(/^(male|female|genderqueer)$/).required();
      else sch.gender = Joi.string().regex(/^(male|female|genderqueer)$/);

      if (this.req.ageMin) sch.ageMin = Joi.number().integer().min(18).max(99).required();
      else sch.ageMin = Joi.number().integer().min(18).max(99);

      if (this.req.ageMax) sch.ageMax = Joi.number().integer().min(19).max(100).required();
      else sch.ageMax = Joi.number().integer().min(19).max(100);

      if (this.req.localisation) {
        sch.localisation = Joi.number().integer().min(5).max(160).required();
      } else sch.localisation = Joi.number().integer().min(5).max(160);

      if (this.req.sexOrient) sch.sexOrient = Joi.string().regex(/^(hetero|homo|bi|pan)$/).required();
      else sch.sexOrient = Joi.string().regex(/^(hetero|homo|bi|pan)$/);

      if (this.req.tags) sch.tags = Joi.any().required();
      else sch.tags = Joi.any();

      if (this.req.optional) sch.optional = Joi.string().alphanum().min(3).max(30).required();
      else sch.optional = Joi.string().alphanum().min(3).max(30);

      if (this.req.isAdmin) sch.isAdmin = Joi.string().regex(/^(true|false)$/).required();
      else sch.isAdmin = Joi.string().regex(/^(true|false)$/);

      Joi.validate(this.data, sch, (err, value) => {
        if (err === null) resolve({ success: true, value });
        else {
          debug(err);
          reject(err);
        }
      });
    });
  }
}

module.exports = UserValidator;
