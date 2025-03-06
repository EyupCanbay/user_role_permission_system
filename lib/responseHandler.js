const CustomError = require('./customError')
const Enum = require('../config/Enum')
let i18n = require('../i18n/index')
i18n = i18n[Enum.DEFAULT_LANG]
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
                  message: i18n.translate("COMMON.ALREADY_EXIST", lang),
                  description: i18n.translate("COMMON.ALREADY_EXIST", lang)
              }
          }
        }
      return {
          code: Enum.HTTP_CODES.INT_SERVER_ERROR,
          error: {
            message: i18n.translate("COMMON.UNKNOW_ERRO", lang),
            description: error.message
          }
      }
  }
  }
  
  module.exports = ResponseHandler;