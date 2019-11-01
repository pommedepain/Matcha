/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable camelcase */

const debug = require('debug')('models:notifs');
const _ = require('lodash');
const driver = require('../util/driver');

class Notification {

  constructor(data) {
    if (data.emitter) this.emitter = data.emitter;
    if (data.receiver) this.receiver = data.receiver;
    if (data.type) this.type = data.type;
    if (data.id) this.id = data.id;
    this.driver = driver;
    debug('Notif constructor called', data);
  }

  create() {
    return new Promise((resolve, reject) => {
      if (!this.emitter || !this.receiver || !this.type) resolve('Missing information');
      const date = new Date().toDateString();
      const session = this.driver.session();
      const query = `MATCH (a:User {username:'${this.emitter}'}),(b:User {username:'${this.receiver}'})
                      CREATE (a)-[:EMITTED]->(n:notification {type:'${this.type}', date:'${date}', read:'false'})-[:TO]->(b)`;
      session.run(query)
        .then((res) => {
          debug(res);
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
      const query = `MATCH (a:User {username:'${this.receiver}'})<-[:TO]-(b)<-[:EMITTED]-(c:User)
                    RETURN b.type,b.read,c.username,ID(b)
                    ORDER BY b.date`;
      session.run(query)
        .then((res) => {
          session.close();
          debug(res);
          const result = [];
          if (res.records.length !== 0) {
            res.records.forEach((record) => {
              result.push({
                type: record._fields[0],
                emitter: record._fields[2],
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
      const query = `MATCH (n)
                    WHERE ID(n) = ${this.id}
                    SET n.read=true`;
      session.run(query)
        .then(() => resolve('notification has been read'))
        .catch(err => debug(err));
    });
  }
}

module.exports = Notification;
