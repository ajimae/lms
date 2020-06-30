function response(response, statusCode, msg=null, data=null) {
  response.status(statusCode).json({
    msg,
    data
  });
}

module.exports = {
  response
}