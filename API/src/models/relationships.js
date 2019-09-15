
const debug = require('debug')('models:relationships');
const config = require('config');
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;

class Relationship {

  constructor(data) {
    this.data = data;
    this.properties = ['id', 'username'];
  }

  getRelationships() {
    return new Promise((resolve, reject) => {
      const query = `MATCH (a)-[r:${this.data.relation}]->(b) return (a)-[r]->(b)`;
      debug(query);
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      session.run(query)
        .then((res) => {
          session.close();
          const result = [];
          res.records.forEach((record) => {
            result.push(_.pick(record._fields[0][0].start.properties, this.properties),
              record._fields[0][0].segments[0].relationship.type,
              _.pick(record._fields[0][0].end.properties, this.properties));
          });
          debug(result);
          resolve(result);
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    });
  }

  getNodeRelationships() {
    return new Promise((resolve, reject) => {
      const query = `MATCH (a)-[r]->(b) WHERE a.${this.data.node_a.id}=${this.data.node_a.value} OR b.${this.data.node_a.id}=${this.data.node_a.value} return [r]->(b)`;
      debug(query);
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
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

  getNodeTypeofRelationships() {
    return new Promise((resolve, reject) => {
      const query = `MATCH (a)-[r:${this.data.relation}]->(b) WHERE a.${this.data.node_a.id}=${this.data.node_a.value} OR b.${this.data.node_a.id}=${this.data.node_a.value} return r`;
      debug(query);
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
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

  createRelationship() {
    return new Promise((resolve, reject) => {
      const query = `MATCH (a:${this.data.node_a.type} {${this.data.node_a.id}: '${this.data.node_a.value}'}), (b:${this.data.node_b.type} {${this.data.node_b.id}: '${this.data.node_b.value}'}) CREATE (a)-[r:${this.data.relation}]->(b) RETURN type(r)`;
      debug(query);
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
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

  deleteRelationship() {
    return new Promise((resolve, reject) => {
      const query = `MATCH (a:${this.data.node_a.type} {${this.data.node_a.id}: '${this.data.node_a.value}'})-[r:${this.data.relation}]->(b:${this.data.node_b.type} {${this.data.node_b.id}: '${this.data.node_b.value}'}) DELETE r`;
      debug(query);
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
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

  deleteThisNodeRelationships() {
    return new Promise((resolve, reject) => {
      const query = `MATCH (a)-[r]->(b) WHERE a.${this.data.node_a.id}='${this.data.node_a.value}' OR b.${this.data.node_a.id}='${this.data.node_a.value}' DELETE r`;
      debug(query);
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      session.run(query)
        .then(() => {
          session.close();
          debug('Relationships destroyed for :', this.data.node_a);
          resolve(true);
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    });
  }

  deleteThisTypeofRelationship() {
    return new Promise((resolve, reject) => {
      const query = `MATCH (a)-[r:${this.data.relation}]->(b) DELETE r RETURN r`;
      debug(query);
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      session.run(query)
        .then((res) => {
          session.close();
          debug(res.records[0]._fields);
          resolve(true);
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    });
  }
}

module.exports = Relationship;
