
const Joi = require('@hapi/joi');
const debug = require('debug')('app:validator');

class TagValidator {

  constructor(requirements, data) {
    this.req = requirements;
    this.data = data;
    if (
      this.data.id === 'undefined' || this.data.id === 0 || this.data.id === null
      || this.data.text === 'undefined' || this.data.text === 0 || this.data.text === null
    ) this.data = null;

  }

  validate() {
    return new Promise((resolve, reject) => {
      const sch = {};

      if (this.req.id) sch.id = Joi.string().regex(/^[a-zA-Z- ]{3,30}$/).required();
      else sch.id = Joi.string().regex(/^[a-zA-Z- ]{3,30}$/);

      if (this.req.text) sch.text = Joi.string().regex(/^[a-zA-Z- ]{3,30}$/).required();
      else sch.text = Joi.string().regex(/^[a-zA-Z- ]{3,30}$/);

      Joi.validate(this.data, sch, (err, value) => {
        if (err === null) resolve({ success: true, value });
        else reject(err);
      });
    });
  }
}

module.exports = TagValidator;
