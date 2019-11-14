
const debug = require('debug')('init:fakeconv');
const Notifications = require('../models/notificationsClass');

const notifications = [
  {
    emitter: 'camille',
    receiver: 'philoutre',
    type: 'message',
    message: 'message 1',
  },
  {
    emitter: 'philoutre',
    receiver: 'camille',
    type: 'message',
    message: 'message 2',
  },
  {
    emitter: 'camille',
    receiver: 'philoutre',
    type: 'message',
    message: 'message 3',
  },
  {
    emitter: 'camille',
    receiver: 'amandine28',
    type: 'message',
    message: 'message 1',
  },
  {
    emitter: 'amandine28',
    receiver: 'camille',
    type: 'message',
    message: 'message 2',
  },
  {
    emitter: 'camille',
    receiver: 'amandine28',
    type: 'message',
    message: '<h1>mess\'age3`</h1>',
  },
  {
    emitter: 'philoutre',
    receiver: 'amandine28',
    type: 'message',
    message: 'message 1',
  },
  {
    emitter: 'amandine28',
    receiver: 'philoutre',
    type: 'message',
    message: 'message 2',
  },
  {
    emitter: 'philoutre',
    receiver: 'amandine28',
    type: 'message',
    message: '<h1>mess\'age3`</h1>',
  },
];

function populateFakeConv() {
  return notifications.reduce(async (prev, next) => {
    await prev;
    return new Notifications(next).create();
  }, Promise.resolve());
}

module.exports = populateFakeConv;
