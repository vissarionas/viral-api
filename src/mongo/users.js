const MongoClient = require('mongodb').MongoClient;
const config = require('config').mongo;

const dbName = config.get('databases.viral');
const client = new MongoClient(config.get('url'), {
  useNewUrlParser: true,
  authSource: dbName,
  auth: {
    user: config.get('credentials.user'),
    password: config.get('credentials.password')
  }
});

const getProfile = (req, res, id) => {
  client.connect()
  .then(() => {
    const db = client.db(dbName);
    db.collection(config.get('collections.users')).findOne({_id: id})
    .then(profile => res.status(200).send(profile));
  }, err => {
    console.log(err);
  });
};

const getUserByFacebookId = (facebookId) => {
  return new Promise(function (resolve, reject) {
    client.connect()
    .then(() => {
      const db = client.db(dbName);
      db.collection(config.get('collections.users')).findOne({facebookId: facebookId})
      .then(userObject => {
        resolve(userObject);
        client.close();
      }, err => {
        reject(err);
        client.close();
      });
    });
  });
};

const getUserByEmail = (email) => {
  return new Promise(function (resolve, reject) {
    client.connect()
    .then(() => {
      const db = client.db(dbName);
      db.collection('users').findOne({
        email: email
      })
      .then(userObject => {
        resolve(userObject);
        client.close();
      }, err => {
        reject(err);
        client.close();
      });
    });
  });
};

const saveEmailUser = (user) => {
  return new Promise(function (resolve, reject) {
    client.connect()
    .then(() => {
      const db = client.db(dbName);
      db.collection('users').findOne({email: user.email})
      .then(userObject => {
        if (!userObject) {
          db.collection('users').insertOne(user)
          .then((data) => {
            resolve(data);
            client.close();
          }, err => {
            reject(err);
            client.close();
          });
        } else {
          resolve(userObject);
        }
      }, err => {
        reject(err);
        client.close();
      });
    });
  });
};

const saveFacebookUser = (user) => {
  return new Promise(function (resolve, reject) {
    client.connect()
    .then(() => {
      const db = client.db(dbName);
      db.collection('users').findOne({facebookId: user.facebookId})
      .then(userObject => {
        if (!userObject) {
          db.collection('users').insertOne(user)
          .then(() => {
            resolve(user);
            client.close();
          }, err => {
            reject(err);
            client.close();
          });
        } else {
          resolve(userObject);
        }
      }, err => {
        reject(err);
        client.close();
      });
    });
  });
};

module.exports = {
  getProfile,
  getUserByEmail,
  getUserByFacebookId,
  saveEmailUser,
  saveFacebookUser
};
