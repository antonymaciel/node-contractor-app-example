const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const {
  unexpectedErrorHandler
} = require('./middleware/unexpectedErrorHandler');
const { getProfile } = require('./middleware/getProfile');
const contracts = require('./routes/contracts');
const jobs = require('./routes/jobs');
const balances = require('./routes/balances');
const admin = require('./routes/admin');

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);
app.use('/contracts', getProfile, contracts);
app.use('/jobs', getProfile, jobs);
app.use('/balances', getProfile, balances);
app.use('/admin', getProfile, admin);
app.use(unexpectedErrorHandler);

module.exports = app;
