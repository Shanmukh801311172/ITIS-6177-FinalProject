const { body, validationResult } = require('express-validator');

const validateTextToSpeech = [
  body('text').notEmpty().withMessage('Text is required')
    .isLength({ max: 300 }).withMessage('Text length exceeds 300 characters')
    .trim(),
  body('voice').optional().isString().withMessage('Voice must be a string').trim(),
];

const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateTextToSpeech,
  checkValidationResult
};
