
const debug = require('debug')('models:tags');
const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const bcrypt = require('bcrypt');
const Tagvalidator = require('../validation/tags');
const Node = require('./nodeClass');


class Tag extends Node {

  constructor(data) {
    const node = {
      type: 'Tag',
      id: 'id',
      value: data,
    };
    super({ node_a: node });
    this.data = { node_a: node };
    this.tag = this.data.node_a.value;
    this.allProperties = ['id', 'text'];
    this.publicProperties = ['id', 'text'];
    this.creationRequirements = {
      id: true,
      text: true,
    };
    this.getRequirements = {
      id: true,
    };
    this.updateRequirements = {
      id: true,
    };
    this.deleteRequirements = {
      id: true,
    };
    this.getRequirements = {
      id: true,
    };
  }

  getTags() {
    return new Promise((resolve, reject) => {
      const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
      const session = driver.session();
      session.run('MATCH (n:Tag) RETURN n.id')
        .then((result) => {
          session.close();
          if (result.records.length !== 0) {
            this.tags = [];
            result.records.forEach((record) => { this.tags.push(record._fields[0]); });
            debug('Records :\n', this.tags);
            resolve(this.tags);
          } else reject(new Error('No tag in database'));
        })
        .catch((err) => { debug('An error occured while fetching tag list :', err); });
    });
  }

  getTagInfo() {
    return new Promise((resolve, reject) => {
      debug('Getting tag info for :', this.tag);
      new Tagvalidator(this.getRequirements, this.tag).validate()
        .then(() => this.getNodeInfo())
        .then(tag => resolve(tag))
        .catch(err => reject(err));
    });
  }

  createTag() {
    return new Promise((resolve, reject) => (
      new Tagvalidator(this.creationRequirements, this.tag).validate()
        .then(() => this.redundancyCheck())
        .then(() => this.createNode())
        .then(tag => resolve(_.pick(tag, this.allProperties)))
        .catch(err => reject(err))
    ));
  }

  updateTag() {
    return new Promise((resolve, reject) => (
      new Tagvalidator(this.updateRequirements, this.tag).validate()
        .then(() => this.updateNode())
        .then(tag => resolve(_.pick(tag, this.allProperties)))
        .catch(err => reject(err))
    ));
  }

  deleteTag() {
    return new Promise((resolve, reject) => (
      new Tagvalidator(this.deleteRequirements, this.tag).validate()
        .then(() => this.deleteThisNodeRelationships())
        .then(() => this.deleteNode())
        .then(tag => resolve(tag))
        .catch(err => reject(err))
    ));
  }
}

module.exports = Tag;
