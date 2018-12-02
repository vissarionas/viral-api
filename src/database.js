require('dotenv').config();
const NodeCouchDb = require('node-couchdb');
const config = require('config');

const couch = new NodeCouchDb({
  host: config.get('couch.dbConfig.host'),
  protocol: config.get('couch.dbConfig.protocol'),
  port: config.get('couch.dbConfig.port'),
  auth: {
    user: process.env.DB_USERNAME,
    pass: process.env.DB_PASSWORD
  },
});

const saveUser = (user) => {
  const dbName = config.get('couch.databases.users');
  const viewUrl = config.get('couch.views.usersByEmail');
  
  return new Promise(function (resolve, reject) {

    couch.get(dbName, viewUrl, {key: user.email})
    .then(({data, headers, status}) => {
      if (!data.rows.length) {
        couch.insert(dbName, {
          _id: Date.now().toString(),
          userName: user.userName,
          email: user.email,
          password: user.password,
          active: user.active,
          provider: user.provider,
          providerUserId: user.providerUserId
          }).then(({data, headers, status}) => {
            resolve(data);
          }, err => {
            reject(err);
        });
      } else {
        reject(`Email ${user.email} already exists`);
      }
    }, err => {
      reject(err);
    });
  });
};

module.exports = {
  saveUser
}
