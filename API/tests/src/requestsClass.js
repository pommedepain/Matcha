const debug = require('debug')('app:test');
const axios = require('axios');

module.exports = class Request {

  constructor(route, data, header) {
    this.route = route;
    this.data = data;
    if (header) this.header = header;
  }

  post() {
    return (
      axios.post(`http://localhost:4000${this.route}`, this.data, this.header)
        .then((response) => {
          debug('Success: ', response.data.payload);
          return (response.data.payload);
        })
        .catch((error) => {
          debug('Failure:', error.message);
          return (false);
        })
    );
  }

  get() {
    return (
      axios.get(`http://localhost:4000${this.route}`, this.data)
        .then((response) => {
          debug('Success: ', response.data.payload);
          return (response.data.success);
        })
        .catch((error) => {
          debug('Failure:', error.message);
          return (false);
        })
    );
  }

  put() {
    return (
      axios.put(`http://localhost:4000${this.route}`, this.data.value, { headers: { 'x-auth-token': this.data.token } })
        .then((response) => {
          debug('Success: ', response.data.payload);
          return (response.data.success);
        })
        .catch((error) => {
          debug('Failure:', error.message);
          return (false);
        })
    );
  }

  delete() {
    return (
      axios.delete(`http://localhost:4000${this.route}`, { headers: { 'x-auth-token': this.data } })
        .then((response) => {
          debug('Success: ', response.data.payload);
          return (response.data.success);
        })
        .catch((error) => {
          debug('Failure:', error.message);
          return (false);
        })
    );
  }

};
