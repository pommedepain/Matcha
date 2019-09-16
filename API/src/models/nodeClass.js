const debug = require('debug')('models:node');
const config = require('config');
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const Relationship = require('./relationshipsClass');
const userTemplate = require('../util/userTemplate');
const tagTemplate = require('../util/tagTemplate');


class Node extends Relationship {

  constructor(data) {
    super(data);
    this.data = data;
    this.iDs = ['id', 'username'];
    this.unique = {
      User: [],
      Tag: [],
    };

    Object.keys(userTemplate).forEach((property) => {
      if (userTemplate[property].unique === true) this.unique.User.push(property);
    });
    Object.keys(tagTemplate).forEach((property) => {
      if (tagTemplate[property].unique === true) this.unique.Tag.push(property);
    });

    this.id_a = this.data.node_a.id;
    debug('Node constructor called');
  }

  redundancyCheck() {
    return new Promise((resolve, reject) => {
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      const query1 = `MATCH (n:${this.data.node_a.type}) WHERE n.${this.unique[this.data.node_a.type][0]}='${this.data.node_a.value[this.unique[this.data.node_a.type][0]]}' OR `;
      const query2 = this.unique[this.data.node_a.type][1] ? `n.${this.unique[this.data.node_a.type][1]}='${this.data.node_a.value[this.unique[this.data.node_a.type][1]]}' RETURN n` : 'false RETURN n';
      const query = query1 + query2;
      session.run(query)
        .then((result) => {
          session.close();
          if (result.records.length === 0) {
            resolve(this.data.node_a);
          } else reject(new Error('Node exists'));
        })
        .catch((err) => { debug('An error during redundancy check :', err); });
    });
  }

  getNodeList() {
    return new Promise((resolve, reject) => {
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      session.run(`MATCH (n:${this.data.node_a.type}) RETURN n.${this.data.node_a.id}`)
        .then((res) => {
          session.close();
          if (res.records.length !== 0) {
            this.result = [];
            res.records.forEach((record) => { this.result.push(record._fields[0]); });
            debug('Records :\n', this.result);
            resolve(this.result);
          } else reject(new Error('No users in database'));
        })
        .catch((err) => { debug('An error occured while fetching user list :', err); });
    });
  }

  getNodeInfo() {
    return new Promise((resolve, reject) => {
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      debug('Getting user info for :', this.data.node_a.value[this.id_a]);
      const query = `MATCH (n:${this.data.node_a.type} {${this.data.node_a.id}:'${this.data.node_a.value[this.id_a]}'}) RETURN n`;
      session.run(query)
        .then((res) => {
          session.close();
          if (res.records.length === 1) {
            const result = res.records[0]._fields[0].properties;
            debug('Data fetched :\n', result);
            resolve(result);
          } else reject(new Error('bad request'));
        })
        .catch((err) => { debug('An error occured while fetching user info :', err); });

    });
  }

  updateNode() {
    return new Promise((resolve, reject) => {
      const newProperties = _.without(Object.keys(this.data.node_a.value), 'tags');
      let changeReq = '{';
      newProperties.forEach((property) => { changeReq = ` ${changeReq}${property} : $${property},`; });
      changeReq = `${changeReq}}`;
      changeReq = changeReq.replace(',}', '}');
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      session.run(
        `MATCH (n:${this.data.node_a.type} {${this.data.node_a.id}: $${this.data.node_a.id}}) SET n+= ${changeReq} RETURN n`,
        this.data.node_a.value,
      )
        .then((result) => {
          session.close();
          if (result.records.length === 1) {
            const singleRecord = result.records[0];
            const node = singleRecord.get(0);
            debug(`Updated ${this.data.node_a.type}: ${this.data.node_a.value[this.id_a]}`);
            resolve(node.properties);
          } else reject(new Error(`Informations does not match existing ${this.data.node_a.type}`));
        })
        .catch(err => debug(`An error occured during ${this.data.node_a.type} information update :`, err));
    });
  }

  createNode() {
    return new Promise((resolve, reject) => {
      const newProperties = _.without(Object.keys(this.data.node_a.value), 'tags');
      let addReq = '{';
      newProperties.forEach((property) => { addReq = ` ${addReq}${property} : $${property},`; });
      addReq = `${addReq}}`;
      addReq = addReq.replace(',}', '}');
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      session.run(`CREATE (n:${this.data.node_a.type} ${addReq}) RETURN n`, this.data.node_a.value)
        .then((result) => {
          session.close();
          if (result.records.length === 1) {
            const singleRecord = result.records[0];
            const node = singleRecord.get(0);
            debug(`${this.data.node_a.type} added to DB : ${this.data.node_a.value[this.id_a]}`);
            resolve(node.properties);
          } else reject(new Error('An error occured'));
        })
        .catch(err => debug(`An error occured while adding new ${this.data.node_a.type} :`, err));
    });
  }

  deleteNode() {
    return new Promise((resolve, reject) => {
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      const query = `MATCH (n:${this.data.node_a.type} {${this.data.node_a.id}:'${this.data.node_a.value[this.id_a]}'}) DELETE n RETURN n`;
      session.run(query)
        .then((result) => {
          session.close();
          if (result.records.length === 1) {
            debug('Deleted Node :', this.data.node_a.value[this.id_a]);
            resolve(this.data.node_a.value[this.id_a]);
          } else reject(new Error('Node not found'));
        })
        .catch((err) => { debug('An error occured during node deletion :', err); });
    });
  }
}

module.exports = Node;
