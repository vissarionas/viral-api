const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
const mongoUtils = require('./mongo/utils');
const config = require('config');

const registerEmailUser = (req, res) => {
  const email = req.body.email;
  mongoUtils.getUserByEmail(email)
  .then(userObject => {
    if (userObject) {
      res.status(409).send(userObject);
    } else {
      const user = {
        _id: uniqid(),
        username: email.split('@')[0],
        email: email,
        password: bcrypt.hashSync(req.body.password, 10),
        verified: false
      }
    
      mongoUtils.saveUser(user)
        .then(data => {
          signAndSendToken(req, res, data.insertedId);
      }, err => {
          res.send(err);
      }); 
    }
  });
};

// const registerFacebookUser = (req, res, profile) => {
//   const user = {
//     userName: profile.name.givenName + profile.name.familyName,
//     email: profile.emails[0].value,
//     provider: profile.provider,
//     facebookId: profile.id,
//     active: true
//   };

//   database.saveFacebookUser(user)
//     .then( data => {
//       signAndSendToken(req, res, data.id);
//   });
// }

const signAndSendToken = (req, res, userId) => {
  jwt.sign( {userId: userId}, config.get('App.jwt.JWT_SECRET'), {expiresIn: config.get('App.jwt.EXPIRATION')}, (err, token) => {
    res.send(token);
  });
}

module.exports = {
  registerEmailUser,
  signAndSendToken
};
