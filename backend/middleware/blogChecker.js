const mongoose = require('mongoose');


function validateAuthorObjectId(req, res, next) {
  const { author } = req.body;

  if (author && !mongoose.isValidObjectId(author)) {
    return res.status(400).json({ msg: 'Invalid author ObjectId' });
  }

  next();
}

module.exports = {
    validateAuthorObjectId
}
