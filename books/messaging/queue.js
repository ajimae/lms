const amp = require('amqplib/callback_api');
const { Book } = require('../model/Book');

function send(message) {
  // connect and create channel
  amp.connect('amqp://127.0.0.1', function (error, connection) {
    if (error) throw Error(error);
    connection.createChannel(function (error, channel) {
      if (error) throw Error(error);
      var queue = 'response';
      // var message = { type: '2', content: 'Hello RabbitMQ' };

      channel.assertQueue(queue, { durable: false });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
      console.info('message was sent...')
    });

    setTimeout(function () {
      connection.close();
      // process.exit(0);
    }, 500);
  });
}

function recieve() {
  // connect and create a channel and listen through the it
  amp.connect('amqp://127.0.0.1', function (error, connection) {
    if (error) throw Error(error);
    connection.createChannel(function (error, channel) {
      if (error) throw Error(error);
      var queue = 'request';

      channel.assertQueue(queue, { durable: false });
      console.log(`waiting for message in ${queue}`);

      // consume message from queue
      channel.consume(queue, function (message) {
        console.log(`Received ${message.content}`);
        // parse message content to json response
        let msgBody = message.content.toString();
        let data = JSON.parse(msgBody);
        const { bookID } = data;
        Book.findOne({ _id: bookID }, function(error, result) {
          if(error) throw Error(error);
          send(result);
        });
      }, { noAck: true });
    });
  });
}

module.exports = {
  send,
  recieve
};
