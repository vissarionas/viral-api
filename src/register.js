const jwt = require('jsonwebtoken');

const registerEmailUser = (req, res) => {
  const email = req.body.email;
  database.getUserByEmail(email)
  .then(userObject => {
    if (!userObject) {
      const user = {};
      user.userName = email.split('@')[0];
      user.email = email;
      user.password = bcrypt.hashSync(req.body.password, 10);
      user.active = true;
    
      database.saveEmailUser(user)
        .then( data => {
          signAndSendToken(req, res, data.id);
      }, err => {
          res.send(err);
      });
    } else {
      res.status(409).send();
    }
  }, err => {
    res.send(err);
  });
}

const registerFacebookUser = (req, res, profile) => {
  database.getUserByFacebookId(profile.id)
  .then(data => {
    if (!data) {
      const user = {};
      user.userName = profile.name.givenName + profile.name.familyName;
      user.email = profile.emails[0].value;
      user.provider = profile.provider;
      user.facebookId = profile.id;
      user.active = true;
    
      database.saveFacebookUser(user)
        .then( data => {
          signAndSendToken(req, res, data.id);
      }, err => {
          res.send(err);
      });
    } else {
      res.status(409).send();
    }
  }, err => {
    res.send(err).send();
  });
}

const signAndSendToken = (req, res, userId) => {
  jwt.sign( {userId: userId}, config.get('App.jwt.JWT_SECRET'), {expiresIn: config.get('App.jwt.EXPIRATION')}, (err, token) => {
    // Move this elsewhere
    jwt.verify(token, config.get('App.jwt.JWT_SECRET'), (err, decoded) => {
      res.status(200).send(decoded ? decoded.userId : err.message);
    });
  });
}

module.exports = {
  registerFacebookUser,
  registerEmailUser
};
