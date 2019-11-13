
const debug = require('debug')('init:fakeconv');
const Notifications = require('../models/notificationsClass');

const notifications = [
  {
    emitter: 'camille',
    receiver: 'philoutre',
    type: 'message',
    message: 'coucou ?',
  },
  {
    emitter: 'philoutre',
    receiver: 'camille',
    type: 'message',
    message: 'coucou !',
  },
  {
    emitter: 'camille',
    receiver: 'philoutre',
    type: 'message',
    message: 'HAHA',
  },
  {
    emitter: 'camille',
    receiver: 'amandine28',
    type: 'message',
    message: 'coucou ?',
  },
  {
    emitter: 'amandine28',
    receiver: 'camille',
    type: 'message',
    message: 'coucou !',
  },
  {
    emitter: 'camille',
    receiver: 'amandine28',
    type: 'message',
    message: 'HAHA',
  },
];

function populateFakeConv() {
  return notifications.reduce(async (prev, next) => {
    await prev;
    return new Notifications(next).create();
  }, Promise.resolve());
}

module.exports = populateFakeConv;
