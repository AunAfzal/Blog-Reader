const User = require('../models/users');

async function checkUsernameOrEmailExistence(req, res, next) {
  const { username, email } = req.body;

  try {
    // Check if the username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ msg: 'Username already exists' });
    }

    // Check if the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    // If neither username nor email exists in the database, move to the next middleware
    next();
  } catch (error) {
    console.error('Error checking username or email existence:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
}
function validateUser(req, res, next) {
  const { email, password, username } = req.body;

  // Check if the email contains '.' and '@'
  if (!email || !email.includes('.') || !email.includes('@')) {
    return res.status(400).json({ msg: 'Invalid email format' });
  }

  // Check if the password has at least 1 number, 1 capital letter, and is at least 8 characters long
  const passwordRegex = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;
  if (!password || !password.match(passwordRegex)) {
    return res.status(400).json({ msg: 'Invalid password format' });
  }

  // Check if the username is at least 4 characters long and only contains alphabets
  const usernameRegex = /^[A-Za-z]{4,}$/;
  if (!username || !username.match(usernameRegex)) {
    return res.status(400).json({ msg: 'Invalid username format' });
  }

  next();
}

  
  module.exports = {
    validateUser,
    checkUsernameOrEmailExistence
  }