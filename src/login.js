const database = require('./database');
const bcrypt = require('bcryptjs');

const loginWithEmail = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  database.getUserByEmail(email)
  .then(data => {
    if (data) {
      bcrypt.compare(password, data.value, (error, response) => {
        res.status(200).send(response ? 'passwords match': 'wrong password');
      });
    }
  });
}

module.exports = {
  loginWithEmail
}