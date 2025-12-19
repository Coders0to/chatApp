// utils/responseHandler.js

module.exports = {
  success: (res, message = "Success", data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  },

  error: (res, message = "Something went wrong", statusCode = 500) => {
    return res.status(statusCode).json({
      success: false,
      message
    });
  },

  unauthorized: (res, message = "Unauthorized access") => {
    return res.status(401).json({
      success: false,
      message
    });
  },

  notFound: (res, message = "Resource not found") => {
    return res.status(404).json({
      success: false,
      message
    });
  },

  validationError: (res, message = "Validation failed") => {
    return res.status(422).json({
      success: false,
      message
    });
  }
};
