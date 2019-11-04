const debug = require('debug')('middleware:auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/userClass');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token || token === null || token === undefined) {
    debug(token);
    debug('Acces denied. No token provided');
    return res.status(401).send('Acces denied. No token provided');
  }
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    res.locals.user = decoded.data;
    if (req.params.username) res.locals.check = req.params.username;
    else if (req.body.reeiver) res.locals.check = req.body.reeiver;
    // debug('Valid token decoded : ', decoded);
    // return (new User(decoded.username).generateAuthToken()
    //   .then((result) => { req.token = result; return (next()); }));
    return (next());
  } catch (ex) {
    debug('Invalid token');
    return (res.status(401).send('Invalid Token.'));
  }
};
