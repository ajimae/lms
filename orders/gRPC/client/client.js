// var fs = require('fs');
// var grpc = require('grpc')
// var protoLoader = require('@grpc/proto-loader')

// var PORT = process.env.PORT || '50051';

// var packageDefinition = protoLoader.loadSync('proto/customer.proto', {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true
// })
// // console.log(packageDefinition, '>>>')
// var customerProto = grpc.loadPackageDefinition(packageDefinition);
// var customerPackage = customerProto.customerPackage;

// var credentials = grpc.credentials.createInsecure();

// var host = process.env.CLIENT_HOST || '127.0.0.1';
// var client = new customerPackage.CustomerService(`${host}:${PORT}`, credentials);

// module.exports = client


const path  = require('path')
const caller = require('grpc-caller')
// import sprom from 'sprom'

// import User from '../user'

// const users = require('../user_db.json')

const PROTO_PATH = path.resolve(__dirname, 'proto/customer.proto')
const HOSTPORT = '0.0.0.0:50051'
const client = caller(HOSTPORT, PROTO_PATH, 'UserService')

module.exports = client;