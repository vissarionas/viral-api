require('dotenv').config();
const NodeCouchDb = require('node-couchdb');
const config = require('config').couch;

const couch = new NodeCouchDb({
  host: config.get('dbConfig.host'),
  protocol: config.get('dbConfig.protocol'),
  port: config.get('dbConfig.port'),
  auth: {
    user: process.env.DB_USERNAME,
    pass: process.env.DB_PASSWORD
  },
});

const usersDb = config.get('databases.users');
const usersByEmailView = config.get('views.usersByEmail');
const userByFacebookId = config.get('views.usersByFacebookId');
const postsDb = config.get('databases.posts');
const postsByUserIdView = config.get('views.postsByUserId')

const saveEmailUser = (user) => {
  return new Promise(function (resolve, reject) {
    couch.insert(usersDb, {
      _id: Date.now().toString(),
      userName: user.userName,
      email: user.email,
      password: user.password,
      active: user.active
      }).then(({data, headers, status}) => {
        resolve(data);
      }, err => {
        reject(err);
    });
  });
};

const saveFacebookUser = (user) => {
  return new Promise(function (resolve, reject) {
    couch.insert(usersDb, {
      _id: Date.now().toString(),
      userName: user.userName,
      email: user.email,
      active: user.active,
      provider: user.provider,
      facebookId: user.facebookId
      }).then(({data, headers, status}) => {
        resolve(data);
      }, err => {
        reject(err);
    });
  });
};

const getUserById = (userId) => {
  return new Promise(function (resolve, reject) {
    couch.get(usersDb, userId)
    .then(({data, headers, status}) => {
      resolve(data);
    }, err => {
      reject(err);
    });
  });
};

const getProfile = (req, res, userId) => {
  couch.get(usersDb, userId)
  .then(({data, headers, status}) => {
    res.status(200).send(data);
  }, err => {
    res.send(err);
  });
};

const getUserByEmail = (email) => {
  return new Promise(function (resolve, reject) {
    couch.get(usersDb, usersByEmailView, {key: email})
    .then(({data, headers, status}) => {
      if (data.rows[0]) {
        resolve(data.rows[0]);
      } else {
        reject();
      };
    }, err => {
      reject(err);
    });
  });
};

const getUserByFacebookId = (facebookId) => {
  return new Promise(function (resolve, reject) {
    couch.get(usersDb, userByFacebookId, {key: facebookId})
    .then(({data, headers, status}) => {
      if (data.rows[0]) {
        resolve(data.rows[0]);
      } else {
        reject();
      }
    }, err => {
      reject(err);
    })
  });
};

const getAllPosts = (req, res) => {
    couch.get(postsDb, postsByUserIdView, {})
    .then(({data, headers, status}) => {
      res.status(200).send(data.rows);
    }, err => {
      res.send(err);  
    });
};

module.exports = {
  getUserById,
  getUserByEmail,
  saveEmailUser,
  getUserByFacebookId,
  saveFacebookUser,
  getAllPosts,
  getProfile
}
