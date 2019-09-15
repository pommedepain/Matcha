const debug = require('debug')('middleware:error');

module.exports = (err, req, res, next) => {
  debug(err);
  return (
    res.status(400).json({
      success: false,
      payload: err.message,
    }));
};
