const MongoClient = require('mongodb').MongoClient;
const config = require('config').mongo;

const dbName = config.get('databases.viral');
const client = new MongoClient(config.get('uri'), {
  useNewUrlParser: true,
  auth: {
    user: config.get('credentials.user'),
    password: config.get('credentials.password')
  }
});

client.connect()
.then(() => {
  console.log('MongoDb connection opened');
}, err => {
  console.log(err);
});

const getUserById = (req, res, id) => {
  const db = client.db(dbName);
  db.collection(config.get('collections.users')).findOne({_id: id})
  .then(profile => res.status(200).send(profile));
};

const getUserByFacebookId = (facebookId) => {
  return new Promise(function (resolve, reject) {
    const db = client.db(dbName);
    db.collection(config.get('collections.users')).findOne({facebookId: facebookId})
    .then(userObject => {
      resolve(userObject);
    }, err => {
      reject(err);
    });
  });
};

const getUserByEmail = (email) => {
  return new Promise(function (resolve, reject) {
    const db = client.db(dbName);
    db.collection('users').findOne({email: email})
    .then(userObject => {
      if (userObject) {
        resolve(userObject);
      } else {
        reject(null);
      };
    }, err => {
      reject(err);
    });
  });
};

const saveEmailUser = (user) => {
  return new Promise(function (resolve, reject) {
    const db = client.db(dbName);
    db.collection('users').findOne({email: user.email})
    .then(userObject => {
      if (!userObject) {
        db.collection('users').insertOne(user)
        .then((data) => {
          resolve(data);
        }, err => {
          reject(err);
        });
      } else {
        resolve(userObject);
      }
    }, err => {
      reject(err);
    });
  });
};

const saveFacebookUser = (user) => {
  return new Promise(function (resolve, reject) {
    const db = client.db(dbName);
    db.collection('users').findOne({facebookId: user.facebookId})
    .then(userObject => {
      if (!userObject) {
        db.collection('users').insertOne(user)
        .then(() => {
          resolve(user);
        }, err => {
          reject(err);
        });
      } else {
        resolve(userObject);
      }
    }, err => {
      reject(err);
    });
  });
};

module.exports = {
  getUserById,
  getUserByEmail,
  getUserByFacebookId,
  saveEmailUser,
  saveFacebookUser
};
