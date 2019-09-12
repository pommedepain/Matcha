
const debug = require('debug')('app:model_relationship');
const config = require('config');
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const Validator = require('./uservalidator');
const User = require('./users');

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
const session = driver.session();

class Relationship {

  constructor(data) {
    this.data = data;
  }

  createRelationship() {
    return new Promise((resolve, reject) => {
      const query = `MATCH (a:${this.data.node_a.type} {${this.data.node_a.id}: '${this.data.node_a.value}'}), (b:${this.data.node_b.type} {${this.data.node_b.id}: '${this.data.node_b.value}'}) CREATE (a)-[r:${this.data.relation}]->(b) RETURN type(r)`;
      debug(query);
      session.run(query)
        .then((res) => {
          session.close();
          debug(res.records[0]._fields);
          resolve(res);
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    });
  }
}

module.exports = Relationship;
