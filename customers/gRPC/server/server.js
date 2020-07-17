// var fs = require('fs');
// var path = require('path');
// var grpc = require('grpc')
// var protoLoader = require('@grpc/proto-loader')
// var Mali = require('mali');

// // var packageDefinition = protoLoader.loadSync('proto/customer.proto');
// // var customerProto = grpc.loadPackageDefinition(packageDefinition);
// // var customerPackage; = customerProto.customerPackage;

// var { getCustomer } = require('./implementations/get_customer');
// var PORT = process.env.PORT || '50051';

// // var credentials = grpc.ServerCredentials.createInsecure();
// // var server = new grpc.Server()

// var server = new Mali(path.join(__dirname, "proto/customer.proto"));

// // server.addService(customerPackage.CustomerService.service, {
// //     getCustomer
// // })

// server.use({
//     getCustomer
// });

// // server.bind(`0.0.0.0:${PORT}`, credentials)
// server.bind(`[::]:${PORT}`, credentials)
// console.log(`server running on port ${PORT}`)
// server.start()

// const path = require('path')
// const Mali = require('mali')

// const PROTO_PATH = path.resolve(__dirname, 'proto/customer.proto')

// async function sayHello(ctx) {
//   ctx.res = { message: 'Hello '.concat(ctx.req.name) }
// }

// function sayHi(ctx) {
//   ctx.res = { message: 'Hi ' + ctx.req.name }
// }

// function main() {
//   const app = new Mali(PROTO_PATH, 'Greeter')
//   app.use({ sayHello, sayHi })
//   app.start('127.0.0.1:50051')
//   console.log('gRPC server running on 127.0.0.1:50051')
// }

// main()

const path = require('path')
// const hl = require('highland')
const Mali = require('mali')
const Database = require('../../db/database');
// const grpc = require('grpc')

// const createError = require('create-grpc-error')
// const apikey = require('mali-apikey')
// const logger = require('mali-logger')
const toJSON = require('@malijs/tojson')
const User = require('./user');
const mongoose = require('mongoose');

// connect to database
// connectDB().then(function (db) {
//   console.log('gRPC server connected to database');
// });

// const url = 'mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019/customer?replicaSet=spike';
// const db = new Database(url);
// db.connect();

const url = 'mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019/customer?replicaSet=spike';
const db = new Database(url, mongoose);
db.connect();

const PROTO_PATH = path.resolve(__dirname, 'proto/customer.proto')
const HOSTPORT = '0.0.0.0:50051'

let app
// const API_KEY = '654321'
// const apiKeyErrorMetadata = { type: 'AUTH', code: 'INVALID_APIKEY' }

async function getUser(ctx, next) {
  const user = await User.findById(ctx.req.id)
  ctx.res = user
  next()
}

// async function listUsers (ctx) {
//   const users = await User.list()
//   ctx.res = hl(users).map(u => u.toJSON())
// }

// async function createUser (ctx) {
//   const user = new User(ctx.req)
//   ctx.res = await user.save()
// }

// async function checkAPIKey (key, ctx, next) {
//   const err = createError('Not Authorized', grpc.status.UNAUTHENTICATED, apiKeyErrorMetadata)
//   if (key !== API_KEY) throw err
//   await next()
// }

function main() {
  app = new Mali(PROTO_PATH, 'UserService')

  // app.use(logger())
  // app.use(
  //   apikey(
  //     { error: { metadata: apiKeyErrorMetadata, code: grpc.status.UNAUTHENTICATED } },
  //     checkAPIKey
  //   )
  // )
  app.use(toJSON())

  app.use({
    getUser
  })

  app.start(HOSTPORT)
  console.log(`User service running @ ${HOSTPORT}`)
}

async function shutdown(err) {
  if (err) console.error(err)
  await app.close()
  process.exit()
}

// process.on('uncaughtException', shutdown)
// process.on('SIGINT', shutdown)
// process.on('SIGTERM', shutdown)

main()
