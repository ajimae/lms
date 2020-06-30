const rabbit = require('../messaging')

const send = async (ctx) => {
  const broker = await rabbit.getInstance()
  await broker.send('test', Buffer.from(JSON.stringify(ctx)))
  // ctx.body = ''
}

module.exports = {
  send
}
