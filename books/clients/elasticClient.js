const config = require('config');
const { Client } = require('@elastic/elasticsearch');

const elasticClient = new Client(config.elasticSearch);

module.exports = {
  elasticClient
}
