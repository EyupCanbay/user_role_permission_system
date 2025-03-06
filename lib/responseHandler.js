const CustomError = require('./customError')
const Enum = require('../config/Enum')
class ResponseHandler {
    static success(message, data = null) {
      return { success: true, message, data };
    }
  
    static error(message, error, lang) {
      console.error(error);
      if (error instanceof CustomError) {
          return {
              code: error.code,
              error: {
                  message,
                    error,
                  description: error
              }
          }
        }
      return {
          code: Enum.HTTP_CODES.INT_SERVER_ERROR,
          error: {
              description: error
          }
      }
  }
  }
  
  module.exports = ResponseHandler;