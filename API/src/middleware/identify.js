const debug = require('debug')('middleware:identify');

module.exports = (req, res, next) => {
  if (req.body.username !== req.params.username && req.body.isAdmin !== 'true') {
    debug('Rejected request from:', req.body.username, 'regarding :', req.params.username);
    return res.status(403).send('Forbidden.');
  }
  return (next());
};
