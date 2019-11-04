const debug = require('debug')('middleware:identify');

module.exports = (req, res, next) => {
  if (res.locals.user.username !== res.locals.check && res.locals.user.isAdmin !== 'true') {
    debug('Rejected request from:', res.locals.user.username, 'regarding :', res.locals.check);
    return res.status(403).send('Forbidden.');
  }
  return (next());
};
