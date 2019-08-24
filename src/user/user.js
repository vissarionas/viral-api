const DbAdapter = require('../shared/dbAdapter');

const dbAdapter = new DbAdapter('users');
dbAdapter.connect();

class User {
  static async create(userDocument) {
    const result = await dbAdapter.create(userDocument);
    if (result.insertedCount) return result.ops[0];
    throw (new Error('nothing was created'));
  }

  static async get(filter) {
    const user = await dbAdapter.get(filter);
    if (user) return user;
    throw (new Error('user does not exist'));
  }

  static async update(docIdentifier, key, value) {
    const result = await dbAdapter.update({ docIdentifier }, { $set: { [key]: value } });
    if (result) return result;
    throw (new Error('nothing was updated'));
  }

  static async delete(filter) {
    const result = await dbAdapter.delete(filter);
    if (result.value) return result;
    throw (new Error('nothing was deleted'));
  }

  static isFacebookUser(userObject) {
    return userObject.facebookId;
  }
}

module.exports = User;
