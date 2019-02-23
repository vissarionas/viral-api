const jwt = require('jsonwebtoken');

class Token {
  static generate(payload, duration) {
    jwt.sign(
      payload,
      duration, process.env.JWT_SECRET,
      { expiresIn: duration }
    );
  }
}

module.exports = Token;
