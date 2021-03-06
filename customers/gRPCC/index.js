const grpc = require('grpc');
const qlik = require('./qlik_grpc');
const { MongoClient } = require('./mongo-client');

class MongoDbGrpcConnector {
  constructor(mongoClient) {
    this.mongoClient = mongoClient;
  }

  getData(call) {
    this.mongoClient.query(call);
  }
}

function main() {
  const server = new grpc.Server();
  const mongoClient = new MongoClient();
  const mongoDbGrpcConnector = new MongoDbGrpcConnector(mongoClient);
  server.addService(qlik.Connector.service, mongoDbGrpcConnector);
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();
  console.log('Server started on 50051');
}
console.log('Starting...');
main();
