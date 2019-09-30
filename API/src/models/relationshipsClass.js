
const debug = require('debug')('models:relationships');
const config = require('config');
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const RelationshipValidator = require('../validation/relationships');

class Relationship {

  constructor(data) {
    this.data = data;
    this.iDs = ['id', 'username'];
    if (this.data && this.data.node_a) this.id_a = this.data.node_a.id;
    if (this.data && this.data.node_b) this.id_b = this.data.node_b.id;
    debug('Relationship constructor called');
  }

  wrapper(method, requirements) {
    return new Promise((resolve, reject) => {
      new RelationshipValidator(requirements, this.data).validate()
        .then(() => method())
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  getRelationships() {
    const requirements = {
      node_a: false,
      node_b: false,
      relation: true,
    };
    const method = () => (new Promise((resolve, reject) => {
      const query = `MATCH (a)-[r:${this.data.relation.label}]->(b) return (a)-[r]->(b)`;
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      session.run(query)
        .then((res) => {
          session.close();
          if (res.records.length !== 0) {
            const result = [];
            res.records.forEach((record) => {
              const node_a = _.pick(record._fields[0][0].start.properties, this.iDs);
              const rel = this.data.relation.label;
              const node_b = _.pick(record._fields[0][0].end.properties, this.iDs);
              result.push({ node_a, rel, node_b });
            });
            debug(result);
            resolve(result);
          } else resolve('No such relation yet');
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    }));
    return (this.wrapper(method, requirements));
  }

  getNodeRelationships() {
    const requirements = {
      node_a: true,
      node_b: false,
      relation: false,
    };
    const method = () => (new Promise((resolve, reject) => {
      const query = `MATCH (a:${this.data.node_a.label} {${this.data.node_a.id}: '${this.data.node_a.properties[this.id_a]}'})-[r]->(b) return [r]->(b)`;
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
    }));
    return (this.wrapper(method, requirements));
  }

  getNodeMutualRelationships() {
    const requirements = {
      node_a: true,
      relation: true,
    };
    const method = () => (new Promise((resolve, reject) => {
      const query = `MATCH (a)-[r:${this.data.relation.label}]-(b) WHERE a.${this.data.node_a.id}='${this.data.node_a.properties[this.id_a]}' return b.${this.data.node_a.id}`;
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      session.run(query)
        .then((res) => {
          const list = [];
          session.close();
          debug(res.records);
          res.records.forEach((record) => {
            list.push(record._fields[0]);
          });
          debug(_.uniq(list));
          resolve(_.uniq(list));
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    }));
    return (this.wrapper(method, requirements));
  }

  getNodetypeofRelationships() {
    const requirements = {
      node_a: false,
      node_b: false,
      relation: true,
    };
    const method = () => (new Promise((resolve, reject) => {
      const query = `MATCH (a:${this.data.node_a.label} {${this.data.node_a.id}: '${this.data.node_a.properties[this.id_a]}'})-[r:${this.data.relation.label}]->(b) return r`;
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
    }));
    return (this.wrapper(method, requirements));
  }

  toggleRelationship() {
    const requirements = {
      node_a: true,
      node_b: true,
      relation: true,
    };
    const method = () => (new Promise((resolve, reject) => {
      const query = `MATCH (a:${this.data.node_a.label} {${this.data.node_a.id}: '${this.data.node_a.properties[this.id_a]}'})-[r:${this.data.relation.label}]->(b:${this.data.node_b.label} {${this.data.node_b.id}: '${this.data.node_b.properties[this.id_b]}'}) RETURN (a)-[r:${this.data.relation.label}]->(b)`;
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      debug(query);
      session.run(query)
        .then((res) => {
          session.close();
          debug(res.records);
          if (res.records.length === 0) {
            debug('RELATION FOUND');
            resolve(this.createRelationship());
          } else resolve(this.deleteRelationship());
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    }));
    return (this.wrapper(method, requirements));
  }

  createRelationship() {
    const requirements = {
      node_a: true,
      node_b: true,
      relation: true,
    };
    const method = () => (new Promise((resolve, reject) => {
      debug(this.data.relation.properties);
      const query = `MATCH (a:${this.data.node_a.label} {${this.data.node_a.id}: '${this.data.node_a.properties[this.id_a]}'}), (b:${this.data.node_b.label} {${this.data.node_b.id}: '${this.data.node_b.properties[this.id_b]}'}) CREATE (a)-[r:${this.data.relation.label} $props]->(b) RETURN (a)-[r:${this.data.relation.label}]->(b)`;
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      const props = this.data.relation.properties;
      debug(query);
      session.run(query, { props })
        .then((res) => {
          session.close();
          debug(`${this.data.node_a.properties[this.id_a]} ${this.data.relation.label} ${this.data.node_b.properties[this.id_b]} RELATION CREATED`);
          resolve(`${this.data.node_a.properties[this.id_a]} ${this.data.relation.label} ${this.data.node_b.properties[this.id_b]} RELATION CREATED`);
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    }));
    return (this.wrapper(method, requirements));
  }

  deleteRelationship() {
    const requirements = {
      node_a: true,
      node_b: true,
      relation: true,
    };
    const method = () => (new Promise((resolve, reject) => {
      const query = `MATCH (a:${this.data.node_a.label} {${this.data.node_a.id}: '${this.data.node_a.properties[this.id_a]}'})-[r:${this.data.relation.label}]->(b:${this.data.node_b.label} {${this.data.node_b.id}: '${this.data.node_b.properties[this.id_b]}'}) DELETE r return type(r)`;
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      session.run(query)
        .then((res) => {
          session.close();
          if (res.records.length !== 0) {
            debug(`${this.data.node_a.properties[this.id_a]} ${this.data.relation.label} ${this.data.node_b.properties[this.id_b]} RELATION DESTROYED`);
            resolve(`${this.data.node_a.properties[this.id_a]} ${this.data.relation.label} ${this.data.node_b.properties[this.id_b]} RELATION DESTROYED`);
          } else resolve('No such relationship');
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    }));
    return (this.wrapper(method, requirements));
  }

  deleteThisNodeRelationships() {
    const requirements = {
      node_a: true,
    };
    const method = () => (new Promise((resolve, reject) => {
      const query = `MATCH (a)-[r]->(b) WHERE a.${this.data.node_a.id}='${this.data.node_a.properties[this.id_a]}' OR b.${this.data.node_a.id}='${this.data.node_a.properties[this.id_a]}' DELETE r return type(r)`;
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      session.run(query)
        .then((res) => {
          session.close();
          debug('Relationships destroyed for :', this.data.node_a.properties[this.id_a]);
          resolve(`Relationships destroyed for : ${this.data.node_a.properties[this.id_a]}`);
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    }));
    return (this.wrapper(method, requirements));
  }

  deleteThisTypeofRelationship() {
    const requirements = {
      relation: true,
    };
    const method = () => (new Promise((resolve, reject) => {
      const query = `MATCH (a)-[r:${this.data.relation.label}]->(b) DELETE r RETURN type(r)`;
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      session.run(query)
        .then((res) => {
          session.close();
          if (res.records.length !== 0) {
            debug(res.records[0]._fields);
            resolve(`${this.data.relation.label} DESTROYED`);
          } else resolve('No such relationship');
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    }));
    return (this.wrapper(method, requirements));
  }

  deleteThisNodelabelofRelationships() {
    const requirements = {
      node_a: true,
      relation: true,
    };
    const method = () => (new Promise((resolve, reject) => {
      const query = `MATCH (a)-[r:${this.data.relation.label}]->(b) WHERE a.${this.data.node_a.id}='${this.data.node_a.properties[this.id_a]}' OR b.${this.data.node_a.id}='${this.data.node_a.properties[this.id_a]}' DELETE r return type(r)`;
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      session.run(query)
        .then((res) => {
          session.close();
          debug('Relationships destroyed for :', this.data.node_a.properties[this.id_a]);
          resolve(`${this.data.relation.label} Relations destroyed for ${this.data.node_a.properties[this.id_a]}`);
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    }));
    return (this.wrapper(method, requirements));
  }

  deleteDuplicates() {
    const requirements = {
      node_a: false,
      relation: false,
    };
    const method = () => (new Promise((resolve, reject) => {
      const query = `match (s)-[r]->(e)
      with s,e,type(r) as typ, tail(collect(r)) as coll 
      foreach(x in coll | delete x)`;
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      session.run(query)
        .then((res) => {
          session.close();
          debug('Relationships duplicates destroyed');
          resolve('Relationships duplicates destroyed');
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    }));
    return (this.wrapper(method, requirements));
  }
}

module.exports = Relationship;
