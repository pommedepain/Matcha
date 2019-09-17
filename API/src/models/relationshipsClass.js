
const debug = require('debug')('models:relationships');
const config = require('config');
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;

class Relationship {

  constructor(data) {
    this.data = data;
    this.iDs = ['id', 'username'];
    if (this.data.node_a) this.id_a = this.data.node_a.id;
    if (this.data.node_b) this.id_b = this.data.node_b.id;
    debug('Relationship constructor called', this.data);
  }

  getRelationships() {
    return new Promise((resolve, reject) => {
      const query = `MATCH (a)-[r:${this.data.relation}]->(b) return (a)-[r]->(b)`;
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      session.run(query)
        .then((res) => {
          session.close();
          const result = [];
          res.records.forEach((record) => {
            result.push(_.pick(record._fields[0][0].start.properties, this.iDs),
              record._fields[0][0].segments[0].relationship.type,
              _.pick(record._fields[0][0].end.properties, this.iDs));
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
      const query = `MATCH (a)-[r]->(b) WHERE a.${this.data.node_a.id}=${this.data.node_a.value[this.id_a]} OR b.${this.data.node_a.id}=${this.data.node_a.value[this.id_a]} return [r]->(b)`;
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
      const query = `MATCH (a)-[r:${this.data.relation}]->(b) WHERE a.${this.data.node_a.id}=${this.data.node_a.value[this.id_a]} OR b.${this.data.node_a.id}=${this.data.node_a.value[this.id_a]} return r`;
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
      const query = `MATCH (a:${this.data.node_a.type} {${this.data.node_a.id}: '${this.data.node_a.value[this.id_a]}'}), (b:${this.data.node_b.type} {${this.data.node_b.id}: '${this.data.node_b.value[this.id_b]}'}) CREATE (a)-[r:${this.data.relation}]->(b) RETURN type(r)`;
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      debug(query);
      session.run(query)
        .then((res) => {
          session.close();
          debug(`${this.data.node_a.value[this.id_a]} ${res.records[0]._fields} ${this.data.node_b.value[this.id_b]} RELATION CREATED`);
          resolve(`${this.data.node_a.value[this.id_a]} ${res.records[0]._fields} ${this.data.node_b.value[this.id_b]} RELATION CREATED`);
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    });
  }

  deleteRelationship() {
    return new Promise((resolve, reject) => {
      const query = `MATCH (a:${this.data.node_a.type} {${this.data.node_a.id}: '${this.data.node_a.value[this.id_a]}'})-[r:${this.data.relation}]->(b:${this.data.node_b.type} {${this.data.node_b.id}: '${this.data.node_b.value[this.id_b]}'}) DELETE r return type(r)`;
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      session.run(query)
        .then((res) => {
          session.close();
          debug(`${this.data.node_a.value[this.id_a]} ${res.records[0]._fields} ${this.data.node_b.value[this.id_b]} RELATION DESTROYED`);
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
      const query = `MATCH (a)-[r]->(b) WHERE a.${this.data.node_a.id}='${this.data.node_a.value[this.id_a]}' OR b.${this.data.node_a.id}='${this.data.node_a.value[this.id_a]}' DELETE r`;
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      session.run(query)
        .then(() => {
          session.close();
          debug('Relationships destroyed for :', this.data.node_a.value[this.id_a]);
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
