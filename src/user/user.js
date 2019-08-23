const DbAdapter = require('../shared/dbAdapter');

const dbAdapter = new DbAdapter('users');
dbAdapter.connect();

class User {
  static async create(userDocument) {
    await dbAdapter.create(userDocument);
    return userDocument;
  }

  static get(filter) {
    return dbAdapter.get(filter);
  }

  static update(docIdentifier, key, value) {
    return dbAdapter.update({ docIdentifier }, { $set: { [key]: value } });
  }

  static delete(filter) {
    return dbAdapter.delete(filter);
  }

  static isFacebookUser(userObject) {
    return userObject.facebookId;
  }
}

module.exports = User;
