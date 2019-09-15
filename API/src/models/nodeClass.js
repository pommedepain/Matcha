const debug = require('debug')('models:users');
const config = require('config');
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const Relationship = require('./relationshipsClass');
const userTemplate = require('../util/userTemplate');
const tagTemplate = require('../util/tagTemplate');


class Node extends Relationship {

  constructor(data) {
    super();
    this.data = data;
    this.iDs = ['id', 'username'];
  }

}

module.exports = Node;
