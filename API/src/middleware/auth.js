const debug = require('debug')('middleware:auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/userClass');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token || token === null || token === undefined) {
    debug('Acces denied. No token provided');
    return res.status(401).send('Acces denied. No token provided');
  }
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded.data;
    debug('Valid token decoded : ', decoded);
    return (new User(decoded.username).generateAuthToken()
      .then((result) => { req.token = result; return (next()); }));
  } catch (ex) {
    debug('Invalid token');
    return (res.status(400).send('Invalid Token.'));
  }
};
