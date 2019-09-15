const debug = require('debug')('middleware:admin');

module.exports = (req, res, next) => {
  if (!req.user.isAdmin) {
    debug('Rejected request from :', req.user.username, 'isAdmin : ', req.user.isAdmin);
    return res.status(403).send('Forbidden.');
  }
  return (next());
};
