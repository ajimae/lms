var fs = require('fs');
var path = require('path');
var grpc = require('grpc')
var protoLoader = require('@grpc/proto-loader')
var Mali = require('mali');

// var packageDefinition = protoLoader.loadSync('proto/customer.proto');
// var customerProto = grpc.loadPackageDefinition(packageDefinition);
// var customerPackage; = customerProto.customerPackage;

var { getCustomer } = require('./implementations/get_customer');
var PORT = process.env.PORT || '50051';

// var credentials = grpc.ServerCredentials.createInsecure();
// var server = new grpc.Server()

var server = new Mali(path.join(__dirname, "proto/customer.proto"));

// server.addService(customerPackage.CustomerService.service, {
//     getCustomer
// })

server.use({
    getCustomer
});

// server.bind(`0.0.0.0:${PORT}`, credentials)
server.bind(`[::]:${PORT}`, credentials)
console.log(`server running on port ${PORT}`)
server.start()
