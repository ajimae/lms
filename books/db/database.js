var mongoose = require('mongoose');
var config = require('config');

const dbUrl = config.mongo.db + "://" + config.mongo.host + ":" + config.mongo.port1 + "," + config.mongo.host + ":" + config.mongo.port2 + "," + config.mongo.host + ":" + config.mongo.port3 + "/" + config.mongo.database + "?replicaSet=" + config.mongo.replSetName;

class Databse {
  constructor(url = dbUrl, instance = mongoose, option = { useUnifiedTopology: true, useNewUrlParser: true }) {
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
