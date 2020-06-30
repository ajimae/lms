const amp = require('amqplib/callback_api');

function send(message) {
  // connect and create channel
  amp.connect('amqp://127.0.0.1', function (error, connection) {
    if (error) throw Error(error);
    connection.createChannel(function (error, channel) {
      if (error) throw Error(error);
      var queue = 'order';
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
      var queue = 'order';

      channel.assertQueue(queue, { durable: false });
      console.log(`waiting for message in ${queue}`);

      // consume message from queue
      channel.consume(queue, function (message) {
        // parse message content to json response 
        console.log(`Received ${message.content}`);
      }, { noAck: true });
    });
  });
}

module.exports = {
  send,
  recieve
};
