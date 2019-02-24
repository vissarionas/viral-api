const jwt = require('jsonwebtoken');

class Token {
  static generate(payload, duration) {
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: duration }
    );
    return token;
  }
}

module.exports = Token;
