
const debug = require('debug')('app:model_tag');
const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const bcrypt = require('bcrypt');
const Tagvalidator = require('./tagvalidator');

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));


class Tag {

  constructor(tag) {
    this.tag = tag;
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

  redundancyCheck() {
    return new Promise((resolve, reject) => {
      debug('Checkin for', this.tag.id, 'in database.');
      const session = driver.session();
      session.run(
        'MATCH (n:Tag) WHERE n.id=$id  RETURN n',
        { id: this.tag.id },
      )
        .then((result) => {
          session.close();
          if (result.records.length === 0) { resolve(this.tag); }
          reject(new Error('tag exists'));
        })
        .catch((err) => { debug('An error during redundancy check :', err); });
    });
  }

  getTags() {
    return new Promise((resolve, reject) => {
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
      const session = driver.session();
      debug('Getting tag info for :', this.tag);
      new Tagvalidator(this.getRequirements, this.tag).validate()
        .then(() => {
          session.run(
            'MATCH (n:Tag) WHERE n.id=$id RETURN n',
            { id: this.tag.id },
          )
            .then((result) => {
              session.close();
              if (result.records.length === 1) {
                const tag = result.records[0]._fields[0].properties;
                debug('Data fetched :\n', tag);
                resolve(tag);
              } else reject(new Error('bad request'));
            })
            .catch((err) => { debug('An error occured while fetching tag info :', err); });
        })
        .catch((err) => { debug('An error occured while fetching tag info :', err); });
    });
  }

  deleteRelationships() {
    return new Promise((resolve) => {
      const session = driver.session();
      session.run(
        'MATCH p=(a)-[r]->(b) WHERE a.id=$id OR b.id=$id DELETE r',
        { id: this.tag.id },
      )
        .then(() => {
          session.close();
          resolve(true);
        })
        .catch((err) => { debug('An error occured during relationship deletion :', err); });
    });
  }

  deleteNode() {
    return new Promise((resolve, reject) => {
      const session = driver.session();
      session.run(
        'MATCH (n:Tag) WHERE n.id=$id DELETE n RETURN n',
        { id: this.tag.id },
      )
        .then((result) => {
          session.close();
          if (result.records.length === 1) {
            debug('Deleted tag :', this.tag.id);
            resolve(this.tag.id);
          } else reject(new Error('tag not found'));
        })
        .catch((err) => { debug('An error occured during node deletion :', err); });
    });
  }

  changeTagProperies(hash) {
    return new Promise((resolve, reject) => {
      const newProperties = Object.keys(this.tag);
      let changeReq = '{';
      newProperties.forEach((property) => { changeReq = ` ${changeReq}${property} : $${property},`; });
      changeReq = `${changeReq}}`;
      changeReq = changeReq.replace(',}', '}');
      const session = driver.session();
      session.run(
        `MATCH (n:Tag) WHERE n.id=$id OR n.text=$text SET n+= ${changeReq} RETURN n`,
        this.tag,
      )
        .then((result) => {
          session.close();
          if (result.records.length === 1) {
            const singleRecord = result.records[0];
            const node = singleRecord.get(0);
            resolve(node.properties);
          } else reject(new Error('Informations does not match existing tag'));
        })
        .catch(err => debug('An error occured during tag information update :', err));
    });
  }

  addTag() {
    return new Promise((resolve, reject) => {
      const newProperties = Object.keys(_.pick(this.tag, this.allProperties));
      let addReq = '{';
      newProperties.forEach((property) => { addReq = ` ${addReq}${property} : $${property},`; });
      addReq = `${addReq}}`;
      addReq = addReq.replace(',}', '}');
      const session = driver.session();
      session.run(`CREATE (n:Tag ${addReq}) RETURN n`, this.tag)
        .then((result) => {
          session.close();
          if (result.records.length === 1) {
            const singleRecord = result.records[0];
            const node = singleRecord.get(0);
            debug('tag added to DB :\n', node.properties);
            resolve(node.properties);
          } else reject(new Error('An error occured'));
        })
        .catch(err => debug('An error occured while adding new tag :', err));
    });
  }

  createTag() {
    return new Promise((resolve, reject) => (
      new Tagvalidator(this.creationRequirements, this.tag).validate()
        .then(() => this.redundancyCheck())
        .then(() => this.addTag())
        .then(tag => resolve(_.pick(tag, this.allProperties)))
        .catch(err => reject(err))
    ));
  }

  updateTag() {
    return new Promise((resolve, reject) => (
      new Tagvalidator(this.updateRequirements, this.tag).validate()
        .then(hash => this.changeTagProperies(hash))
        .then(tag => resolve(_.pick(tag, this.allProperties)))
        .catch(err => reject(err))
    ));
  }

  deleteTag() {
    return new Promise((resolve, reject) => (
      new Tagvalidator(this.deleteRequirements, this.tag).validate()
        .then(() => this.deleteRelationships())
        .then(() => this.deleteNode())
        .then(tag => resolve(tag))
        .catch(err => reject(err))
    ));
  }
}

module.exports = Tag;
