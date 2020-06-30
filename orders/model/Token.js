var mongoose = require('mongoose'); 

var TokenSchema = new mongoose.Schema({
  idr: String,
  resumeToken: String
}, { timestamps: true });

var Token = mongoose.model('Token', TokenSchema);

module.exports = {
  Token
};
