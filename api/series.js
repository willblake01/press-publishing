const express = require('express');
const sqlite3 = require('sqlite3');

const seriesRouter = express.Router();

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

seriesRouter.param('seriesId', (req, res, next, seriesId) => {
  const sql = 'SELECT * FROM Series WHERE Series.id = $seriesId';
  const values = {
    $seriesId: seriesId
  }

  db.get(sql, values, (err, series) => {
    if (err) {
      next(err);
    } else if (series) {
      req.series = series;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

seriesRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Series', (err, series) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({
        series: series
      })
    }
  });
});

seriesRouter.get('/:seriesId', (req, res, next) => {
  res.status(200).json({
    series: req.series
  });
});

seriesRouter.post('/', (req, res, next) => {
  const name = req.body.series.name;
  const description = req.body.series.description;

  if (!name || !description) {
    res.sendStatus(404);
  }

  const sql = 'INSERT INTO Series (name, description) VALUES ($name, $description)';
  const values = {
    $name: name,
    $description: description
  }

  db.run(sql, values, function(error) {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Series WHERE Series.id = ${this.lastID}`, (err, series) => {
        if (err) {
          next(err);
        } else {
          res.status(201).json({series: series});
        }
      });
    }
  });
});

module.exports = seriesRouter;
