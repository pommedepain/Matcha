
const Joi = require('@hapi/joi');
const Complexity = require('joi-password-complexity');

class Validator {

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
      || this.data.optional === 'undefined' || this.data.optional === 0 || this.data.optional === null
      || this.data.isAdmin === 'undefined' || this.data.isAdmin === 0 || this.data.isAdmin === null
    ) this.data = null;
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

      if (this.req.birthdate) sch.birthdate = Joi.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).required();
      else sch.birthdate = Joi.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/);

      if (this.req.email) sch.email = Joi.string().email({ minDomainSegments: 2 }).required();
      else sch.email = Joi.string().email({ minDomainSegments: 2 });

      if (this.req.optional) sch.optional = Joi.string().alphanum().min(3).max(30).required();
      else sch.optional = Joi.string().alphanum().min(3).max(30);

      if (this.req.isAdmin) sch.isAdmin = Joi.string().alphanum().min(3).max(30).required();
      else sch.isAdmin = Joi.string().alphanum().min(3).max(30);

      Joi.validate(this.data, sch, (err, value) => {
        if (err === null) resolve({ success: true, value });
        else reject(err);
      });
    });
  }
}

module.exports = Validator;
