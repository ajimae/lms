const rabbit = require('../messaging');
const { send } = require('./send')

let message = {}
rabbit.getInstance().then(async function(broker) {
  broker.subscribe('test', async function(msg, ack) {
    // await send(msg.content.toString());
    message = msg.content.toString();
    console.log('Message:', msg.content.toString())
    ack()
  });

  await send(message);
});
