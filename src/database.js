const NodeCouchDb = require('node-couchdb');

const couch = new NodeCouchDb();

const saveUser = (user) => {
  return new Promise(function (resolve, reject) {
    couch.insert("users", {
      _id: Date.now().toString(),
      userName: user.userName,
      email: user.email,
      password: user.password,
      active: user.active,
      provider: user.provider,
      providerUserId: user.providerUserId
  
      }).then(({data, headers, status}) => {
        resolve(data)
      }, err => {
        reject(err)
    });
  });
};

module.exports = {
  saveUser
}