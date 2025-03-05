const CustomError = require('./customError')
const Enum = require('../config/Enum')
class ResponseHandler {
    static success(message, data = null) {
      return { success: true, message, data };
    }
  
    static error(message = null, error, lang) {
      console.error(error);
      if (error instanceof CustomError) {
          return {
              code: error.code,
              error: {
                  message: error.message,
                  description: error.description
              }
          }
      } else if (error.message.includes("E11000")) {
          return {
              code: Enum.HTTP_CODES.CONFLICT,
              error: {
                  message: i18n.translate("COMMON.ALREADY_EXIST", lang),
                  description: i18n.translate("COMMON.ALREADY_EXIST", lang)
              }
          }
      }

      return {
          code: Enum.HTTP_CODES.INT_SERVER_ERROR,
          error: {
              description: error.message
          }
      }
  }
  }
  
  module.exports = ResponseHandler;