var mongoose = require('mongoose');
// var config = require('config');

// // var dbOptions;
// // if (config.dbOptions.indexOf('replicaSet') > -1) {
// // 	dbOptions = config.dbOptions
// // }

// var connectDB = (url = '') => {
//   // var url = config.mongo.db + "://" + config.mongo.host + ":" + config.mongo.port1 + "," + config.mongo.host + ":" + config.mongo.port2 + "," + config.mongo.host + ":" + config.mongo.port3 + "/" + config.mongo.database + "?replicaSet=" + config.mongo.replSetName;

//   if(url == '')
//     url = "mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019/customer?replicaSet=spike";
//   console.log(url);
//   return mongoose.connect(url, config.dbOptions);
// };

// module.exports = {
//   connectDB
// };



class Databse {
  constructor(url, instance = mongoose, option = { useUnifiedTopology: true, useNewUrlParser: true }) {
    this.url = url;
    this.instance = instance;
    this.option = option;
  }

  connect() {
    return this.instance.connect(this.url, this.option);
  }

  disconnect() {
    return this.instance.disconnect();
  }
}

module.exports = Databse;
