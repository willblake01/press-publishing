const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');
const morgan = require('morgan');
const express = require('express');
const apiRouter = require('./api/api.js');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 4000

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/api', apiRouter);
app.use(errorhandler());

app.listen(PORT, (err) => {
  if (err) {
    console.log(`There was a problem starting the server`, err);
  }
  console.log(`Server was started on port ${PORT}`);
});

module.exports = app;
