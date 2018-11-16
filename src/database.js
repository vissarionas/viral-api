const NodeCouchDb = require('node-couchdb');

const couch = new NodeCouchDb();
 
function getUsers(req, res) {
  couch.get("users", "c3b04eec4bed82351a34561469000156").then(({data, headers, status}) => {
    res.send(data);
  }, err => {
    res.send(err);
  });
}

function saveUser(user) {
  console.log(user.name, 'saving user to db');
}

module.exports = {
  getUsers: getUsers,
  saveUser: saveUser
}