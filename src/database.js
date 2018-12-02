const NodeCouchDb = require('node-couchdb');
const config = require('config');

require('dotenv').config();

const couch = new NodeCouchDb({
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
        couch.insert("users", {
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
            console.log(err);
        });
      } else {
        reject(`Email ${user.email} already exists`);
      }
    }, err => {
      reject(err);
      console.log(err);
    });
  });
};

module.exports = {
  saveUser
}