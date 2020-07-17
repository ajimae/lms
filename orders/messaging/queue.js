const amp = require('amqplib/callback_api');
const amqp = require('amqplib')
const Response = require('../../response');

function send(message) {
  // connect and create channel
  amp.connect('amqp://127.0.0.1', function (error, connection) {
    if (error) throw Error(error);
    connection.createChannel(function (error, channel) {
      if (error) throw Error(error);
      var queue = 'request';
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

async function recieve(ctx) {
  const conn = await amqp.connect('amqp://localhost?heartbeat=5s')
  const ch = await conn.createChannel()

  const queueName = 'response'
  const message = 'message'

  await ch.assertQueue(queueName, { durable: false })
  // Publish
  // await ch.sendToQueue(queueName, Buffer.from(msg, 'utf8'))
  // subscribe
  // await ch.consume(queueName, msg => {
  //   if (msg !== null) {
  //     // oopsEmitter.emit('event', msg.content.toString())
  //     // ch.ack(msg)
  //     console.log(msg, '>>>>>')
  //   }
  // })

  let m
  await ch.consume(queueName, function (message) {
    if (message !== null) {
      m = message.content.toString()
    }
  })

  console.log(JSON.parse(m), '<><>>><<<>');
  const data = {
    order: ctx.data.order,
    book: JSON.parse(m),
    customer: ctx.data.customer
  }
  const response = new Response(ctx.res, 200, 'fetched successfully', data)
  return response.successResponse()
}

module.exports = {
  send,
  recieve
}
