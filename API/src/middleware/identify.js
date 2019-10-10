const debug = require('debug')('middleware:identify');

module.exports = (req, res, next) => {
  if (req.user.username !== req.params.username && req.user.isAdmin !== 'true') {
    debug('Rejected request from:', req.user.username, 'regarding :', req.user.username);
    return res.status(403).send('Forbidden.');
  }
  return (next());
};
