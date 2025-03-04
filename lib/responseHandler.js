class ResponseHandler {
    static success(message, data = null) {
      return { success: true, message, data };
    }
  
    static error(message ,error) {
      return { success: false, message, error };
    }
  }
  
  module.exports = ResponseHandler;