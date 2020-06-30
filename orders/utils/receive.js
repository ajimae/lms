const rabbit = require('../messaging');
const { response } = require('./response');

function consume(ctx) {
  rabbit.getInstance().then(broker => {
    broker.subscribe('test', (msg, ack) => {
      console.log('Message:', msg.content.toString())
      response(ctx.res, ctx.status, ctx.msg, msg.content.toString());
      ack()
    });

  });
}

module.exports = {
  consume
}