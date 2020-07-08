const express = require('express');
const bodyParser = require('body-parser');

const { connectDB } = require('./db/database');
const { Order } = require('./model/Order');
const { send, recieve } = require('./messaging/queue');
// const { send } = require('./utils/send');
const { consume } = require('./utils/receive');
const { getReturnDate } = require('./utils/dateHelper');
const { getCustomer } = require('./gRPC/client/implementations/get_customer');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connect to database
connectDB().then(function (db) {
  console.log('connected to database');
});

app.get('/', function (req, res) {
  res.status(200).json({ success: true, message: 'this is the orders service' });
});


// create orders
app.post('/order', function (req, res) {
  if (!req.body.bookID || !req.body.customerID) {
    return res.status(400).json({
      success: false,
      message: 'request body is empty',
    });
  }

  req.body.returnDate = getReturnDate(req.body.duration);
  Order.create({ ...req.body }, function (error, result) {
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'order creation failed' + error.message,
        error,
      });
    }
    return res.status(201).json({
      message: 'successfully created a new order',
      data: result,
    });
  });
});


// get all orders
app.get('/orders', function (_, res) {
  Order.find({}, function (error, result) {
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'an error occurred while fetching order' + error.message,
        error
      });
    }
    return res.status(200).json({ success: true, message: 'fetched successully', data: result });
  });
});

// get a single order
app.get('/order/:id', function (req, res) {
  Order.findOne({ _id: req.params.id }, async function (error, result) {
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'an error occurred while fetching order' + error.message,
        error
      });
    }
    // here we include our gRPC or RabbitMQ message here
    // send out book and custom ids
    await send(result)
    // console.log('this...')
    // recieve book and customer details
    // for(var i = 0; i < 1000; i++) {}

    const customer = await getCustomer(result.customerID);
    // watch for change in queue
    // console.log(customer, 'POPOPOP')
    await recieve({ res, data: { order: result, customer } });
    return true
    // return consume({res, status: 200, msg: 'fetched successully'});
    // return res.status(200).json({ success: true, message: 'fetched successully', data: result });
  });
});


// search --es { *?q=search_text}
app.get('/orders/search', function (req, res, next) {
  if (req.query.q) {
    elasticClient.search({
      index: 'customer',
      body: {
        query: {
          match: {
            // name: req.query.q // will decide on search phrase later...
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


app.listen(6565, function () {
  console.log(`orders service up and running...`);
});
