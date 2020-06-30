var { Token } = require('../model/Token');

function getResumetoken(id) {
  console.log("getting resume token", {id})
  var result;
  Token.findOne({ "idr": id }, function(data) {
    result = JSON.parse(data);
  });
  
  return result ? result.resumeToken : null;
}

function saveResumeTaken(resumeToken, id) {
  console.log("saving resume token");
  Token.findOneAndUpdate(
    {"idr": id},
    {"$set": { resumeToken: JSON.stringify(resumeToken) } },
    {"upsert": true}, function(error, result) {
      console.log("token saved");
    }
  );
}

module.exports = {
  getResumetoken,
  saveResumeTaken
};
