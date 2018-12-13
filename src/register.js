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
        provider: '',
        facebookId: '',
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

const registerFacebookUser = (req, res, fbProfile) => {   
  const user = {
    _id: uniqid(),
    username: fbProfile.name.givenName + fbProfile.name.familyName,
    email: fbProfile.emails[0].value,
    password: '',
    provider: 'facebook',
    facebookId: fbProfile.id,
    verified: true
  }

  mongoUtils.saveUser(user)
    .then(data => {
      signAndSendToken(req, res, data.insertedId);
  }, err => {
      res.send(err);
  });  
};

const signAndSendToken = (req, res, userId) => {
  jwt.sign( {userId: userId}, config.get('App.jwt.JWT_SECRET'), {expiresIn: config.get('App.jwt.EXPIRATION')}, (err, token) => {
    res.send(token);
  });
}

module.exports = {
  registerEmailUser,
  registerFacebookUser,
  signAndSendToken
};
