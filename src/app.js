const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');

const app  = express();

function initServer() {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      'GET,PUT,POST,DELETE,OPTIONS,PATCH',
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    if (req.method === 'OPTIONS') {
      //  respond with 200
      res.sendStatus(200);
    } else {
      next();
    }
  });
  
  app.use(express.json({ limit: '115MB' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  const bookRouter = require('./modules/book/routes');

  app.use('/book', bookRouter);

  app.use((req, res, next) => {
    next(createError(404));
  });


  app.use((err, req, res, next) => {
    // set locals, only providing error in development
    console.log(err.message);
    res.status(500).send(err.message || 'Internal server error');
  });


}

module.exports = { app, initServer };