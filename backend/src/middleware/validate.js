const { validationResult } = require('express-validator');

function validate(req, res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: result.array()
    });
  }

  return next();
}

module.exports = validate;
