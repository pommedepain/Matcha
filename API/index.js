
const config = require('config');
const debug = require('debug')('index');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const users = require('./src/routes/users');
const tags = require('./src/routes/tags');
const relationships = require('./src/routes/relationships');
const auth = require('./src/routes/auth');
const initdb = require('./src/init/initdb');
const error = require('./src/middleware/error');

const app = express();

if (!config.get('jwtPrivateKey')) {
  debug('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

app.use(helmet());
app.use(express.static('public'));
app.use(morgan('tiny'));

app.use('/api/users', users);
app.use('/api/tags', tags);
app.use('/api/relationships', relationships);
app.use('/api/auth', auth);

app.use(error);

initdb()
  .then(() => {
    const port = process.env.PORT || 4000;
    app.listen(port, () => debug(`Listening on port ${port}...`));
  })
  .catch(err => debug(err));
