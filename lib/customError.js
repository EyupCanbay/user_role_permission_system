class CustomError extends Error {
  constructor(statusCode, message, error) {
    super(`code: ${statusCode}, message: ${message}, description: ${error}`);
    this.statusCode = statusCode;
    this.message = message;
  }

}



module.exports = CustomError;