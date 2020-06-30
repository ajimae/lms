const express = require('express');
const bodyParser = require('body-parser');
const { elasticClient } = require('./clients/elasticClient');

const { connectDB } = require('./db/database');
const { Book } = require('./model/Book');
const { recieve } = require('./messaging/queue');

const app = express();

recieve();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connect to database
connectDB().then(function (db) {
  console.log('connected to database');
});

app.get('/', function (req, res) {
  res.status(200).json({ success: true, message: 'this is the books service' });
});


// create books
app.post('/book', function (req, res) {
  if (!req.body.title) {
    return res.status(400).json({
      success: false,
      message: 'request body is empty',
    });
  }

  Book.create({ ...req.body }, function (error, result) {
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'book creation failed' + error.message,
        error,
      });
    }
    return res.status(201).json({
      message: 'successfully created a new book',
      data: result,
    });
  });
});


// get all books
app.get('/books', function (_, res) {
  Book.find({}, function (error, result) {
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'an error occurred while fetching book' + error.message,
        error
      });
    }
    return res.status(200).json({ success: true, message: 'fetched successully', data: result });
  });
});

// get a single book
app.get('/book/:id', function (req, res) {
  Book.findOne({ _id: req.params.id }, function (error, result) {
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'an error occurred while fetching book' + error.message,
        error
      });
    }
    return res.status(200).json({ success: true, message: 'fetched successully', data: result });
  });
});

// search --es { *?q=search_text}
app.get('/books/search', function (req, res, next) {
  if (req.query.q) {
    elasticClient.search({
      index: 'book',
      body: {
        query: {
          match: {
            title: req.query.q
          }
        }
      }
    }, function (error, results) {
      if (error) return next(error);
      // var data = results.body.hits.hits.map(function (hit) {
      //   return hit;
      // });
      
      const data = results.body.hits.hits.map(hit => hit);

      return res.status(200).json({
        message: 'search completed successfully',
        data,
      });
    }
    );
  }
});

app.listen(4545, function () { console.log(`books service up and running...`); });
// require('./utils/receive')
