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
    this.driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
  }

  redundancyCheck() {
    return new Promise((resolve, reject) => {
      const session = this.driver.session();
      const query1 = `MATCH (n:${this.data.node_a.label}) WHERE n.${this.unique[this.data.node_a.label][0]}='${this.data.node_a.properties[this.unique[this.data.node_a.label][0]]}' OR `;
      const query2 = this.unique[this.data.node_a.label][1] ? `n.${this.unique[this.data.node_a.label][1]}='${this.data.node_a.properties[this.unique[this.data.node_a.label][1]]}' RETURN n` : 'false RETURN n';
      const query = query1 + query2;
      session.run(query)
        .then((result) => {
          // debug(result);
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
      const session = this.driver.session();
      session.run(`MATCH (n:${this.data.node_a.label}) RETURN n.${this.data.node_a.id} LIMIT 1000`)
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
      const session = this.driver.session();
      debug(`Getting ${this.data.node_a.label} info for :`, this.data.node_a.properties[this.id_a]);
      const query = `MATCH (n:${this.data.node_a.label} {${this.data.node_a.id}:'${this.data.node_a.properties[this.id_a]}'}) RETURN n`;
      session.run(query)
        .then((res) => {
          session.close();
          if (res.records.length !== 0) {
            const result = res.records[0]._fields[0].properties;
            debug('Data fetched :\n', result);
            resolve(result);
          } else resolve({ error: true, value: 'user doesnt exists' });
        })
        .catch((err) => { debug('An error occured while fetching user info :', err); });

    });
  }

  updateNode() {
    return new Promise((resolve, reject) => {
      const props = _.omit(this.data.node_a.properties, 'tags');
      
      const session = this.driver.session();
      session.run(
        `MATCH (n:${this.data.node_a.label} {${this.data.node_a.id}:'${this.data.node_a.properties[this.id_a]}'}) SET n+=$props RETURN n`,
        { props },
      )
        .then((result) => {
          session.close();
          if (result.records.length === 1) {
            const singleRecord = result.records[0];
            const node = singleRecord.get(0);
            debug(`Updated ${this.data.node_a.label}: ${this.data.node_a.properties[this.id_a]}`);
            resolve(node.properties);
          } else reject(new Error(`Informations does not match existing ${this.data.node_a.label}`));
        })
        .catch(err => debug(`An error occured during ${this.data.node_a.label} information update :`, err));
    });
  }

  createNode() {
    return new Promise((resolve, reject) => {
      const date = new Date().toISOString();
      this.data.node_a.properties.creationDate = date;
      const props = _.omit(this.data.node_a.properties, 'tags');
      
      const session = this.driver.session();
      session.run(`CREATE (n:${this.data.node_a.label} $props) RETURN n`, { props })
        .then((result) => {
          session.close();
          if (result.records.length === 1) {
            const singleRecord = result.records[0];
            const node = singleRecord.get(0);
            debug(`${this.data.node_a.label} added to DB : ${this.data.node_a.properties[this.id_a]}`);
            resolve(node.properties);
          } else reject(new Error('An error occured'));
        })
        .catch(err => debug(`An error occured while adding new ${this.data.node_a.label} :`, err));
    });
  }

  deleteNode() {
    return new Promise((resolve, reject) => {
      
      const session = this.driver.session();
      const query = `MATCH (n:${this.data.node_a.label} {${this.data.node_a.id}:'${this.data.node_a.properties[this.id_a]}'}) DELETE n RETURN n`;
      session.run(query)
        .then((result) => {
          session.close();
          if (result.records.length === 1) {
            debug('Deleted Node :', this.data.node_a.properties[this.id_a]);
            resolve(this.data.node_a.properties[this.id_a]);
          } else reject(new Error('Node not found'));
        })
        .catch((err) => { debug('An error occured during node deletion :', err); });
    });
  }
}

module.exports = Node;
