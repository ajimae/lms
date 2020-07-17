const config = require('config');
const { Client } = require('@elastic/elasticsearch');

const elasticClient = new Client(config.elasticSearch);
// const elasticClient = new Client({ "node": "http://localhost:9200" });

module.exports = {
  elasticClient
}
