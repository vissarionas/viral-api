const DbAdapter = require('./shared/dbAdapter');

const UsersDb = new DbAdapter('users');

class User {
  static create(userObject) {
    return UsersDb.create(userObject);
  }

  static get(filter) {
    return UsersDb.get(filter);
  }

  static update(filter, update) {
    return UsersDb.update(filter, update);
  }

  static delete(filter) {
    return UsersDb.delete(filter);
  }
}

module.exports = User;
