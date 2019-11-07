/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable camelcase */

const debug = require('debug')('models:notifs');
const _ = require('lodash');
const driver = require('../util/driver');

class Notifications {

  constructor(data) {
    this.data = data;
    if (data.emitter) this.emitter = data.emitter;
    if (data.receiver) this.receiver = data.receiver;
    if (data.type) this.type = data.type;
    if (data.id) this.id = data.id;
    this.driver = driver;
    debug('Notif constructor called', this.data);
  }

  create() {
    return new Promise((resolve, reject) => {
      if (!this.emitter || !this.receiver || !this.type) resolve('Missing information');
      const date = new Date().toLocaleString();
      const session = this.driver.session();
      if (this.type === 'visit') this.previous = 'visit';
      if (this.type === 'like') this.previous = 'unlike';
      if (this.type === 'match') this.previous = 'unmatch';
      if (this.type === 'unlike') this.previous = 'like';
      if (this.type === 'unmatch') this.previous = 'match';
      const query0 = `MATCH (a:User {username:'${this.emitter}'})-[r:Notification {type:'${this.previous}'}]->(b:User {username:'${this.receiver}'})
                      DELETE r`;
      const query = `MATCH (a:User {username:'${this.emitter}'}),(b:User {username:'${this.receiver}'})
                      CREATE (a)-[r:Notification {type:'${this.type}', date:'${date}', read:false}]->(b)`;
      session.run(query0)
        .then(() => session.run(query))
        .then((res) => {
          debug('Notification created:', this.data);
          session.close();
          resolve(true);
        })
        .catch(err => debug(err));
    });
  }

  get() {
    return new Promise((resolve, reject) => {
      if (!this.receiver) resolve('No receiver Provided!');
      const session = this.driver.session();
      const query = `MATCH (a:User {username:'${this.receiver}'})<-[r:Notification]-(c:User)
                    RETURN r.type,r.read,properties(c),ID(r)
                    ORDER BY r.date`;
      session.run(query)
        .then((res) => {
          session.close();
          debug(res);
          const result = [];
          if (res.records.length !== 0) {
            res.records.forEach((record) => {
              result.push({
                type: record._fields[0],
                emitter: _.omit(record._fields[2], ['password', 'email']),
                read: record._fields[1],
                id: record._fields[3],
              });
            });
          } resolve(result);
        })
        .catch(err => debug(err));
    });
  }

  read() {
    return new Promise((resolve, reject) => {
      if (!this.id) resolve('No id Provided!');
      const session = this.driver.session();
      const query = `MATCH [r:notification]
                    WHERE ID(r) = ${this.id}
                    SET r.read=true`;
      session.run(query)
        .then(() => resolve('notification has been read'))
        .catch(err => debug(err));
    });
  }
}

module.exports = Notifications;
