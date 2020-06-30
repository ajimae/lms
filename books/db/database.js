var mongoose = require('mongoose');
var config = require('config');

// var dbOptions;
// if (config.dbOptions.indexOf('replicaSet') > -1) {
// 	dbOptions = config.dbOptions
// }

var connectDB = () => {
  var url = config.mongo.db + "://" + config.mongo.host + ":" + config.mongo.port1 + "," + config.mongo.host + ":" + config.mongo.port2 + "," + config.mongo.host + ":" + config.mongo.port3 + "/" + config.mongo.database + "?replicaSet=" + config.mongo.replSetName;

  // var url = "mongodb://127.0.0.1:27017/workout";
  console.log(url);
  return mongoose.connect(url, config.dbOptions);
};

module.exports = {
  connectDB
};
