const Token = require('./token');

const generate = payload => Token.generate(payload, process.env.JWT_DURATION);

const generateTemp = payload => Token.generate(payload, process.env.JWT_TEMP_DURATION);

module.exports = {
  generateTemp,
  generate,
};
