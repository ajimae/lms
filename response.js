class Respose {
  constructor(response, status, message = null, data = null) {
    this.response = response;
    this.message = message;
    this.data = data;
    this.status = status;
  }

  successResponse() {
    return this.response.status(this.status).json({
      message: this.message,
      data: this.data
    })
  }

  errorResponse() {
    return this.response.status(this.status).json({
      message: this.message,
      data: this.data
    })
  }
}

module.exports = Respose;
