const express = require('express');
const bodyParser = require('body-parser');
const { elasticClient } = require('./clients/elasticClient');

const Database = require('./db/database');
const { Customer } = require('./model/Customer');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const url = "mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019/customer?replicaSet=spike";
const db = new Database(url)
db.connect();

app.get('/', function (req, res) {
  res.status(200).json({ success: true, message: 'this is the customer service' });
});

// create customer
app.post('/customer', function (req, res) {
  if (!req.body.name) {
    return res.status(400).json({
      success: false,
      message: 'request body is empty',
    });
  }

  Customer.create({ ...req.body }, function (error, result) {
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'customer creation failed' + error.message,
        error,
      });
    }
    return res.status(201).json({
      message: 'successfully created a new customer',
      data: result,
    });
  });
});


// get all customers
app.get('/customers', function (_, res) {
  Customer.find({}, function (error, result) {
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'an error occurred while fetching customer' + error.message,
        error
      });
    }
    return res.status(200).json({ success: true, message: 'fetched successully', data: result });
  });
});

// get a single customer
app.get('/customer/:id', function (req, res) {
  Customer.findOne({ _id: req.params.id }, function (error, result) {
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'an error occurred while fetching customer' + error.message,
        error
      });
    }
    return res.status(200).json({ success: true, message: 'fetched successully', data: result });
  });
});

// search --es { *?q=search_text}
app.get('/customers/search', function (req, res, next) {
  if (req.query.q) {
    elasticClient.search({
      index: 'customer',
      body: {
        query: {
          match: {
            name: req.query.q
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
    });
  }
});

app.listen(5555, function () { console.log(`customers service up and running...`); });
