const DbAdapter = require('../shared/dbAdapter');

const usersDb = new DbAdapter('users');
usersDb.connect();

class User {
  static async create(userDocument) {
    const result = await usersDb.create(userDocument);
    if (result.insertedCount) return result.ops[0];
    throw (new Error('nothing was created'));
  }

  static async get(filter) {
    const user = await usersDb.get(filter);
    if (user) return user;
    throw (new Error('user not found'));
  }

  static async update(email, key, value) {
    const filter = { email };
    const updateResult = await usersDb.update(filter, key, value);
    if (updateResult.modifiedCount) return updateResult;
    throw (new Error('nothing to update'));
  }

  static async delete(filter) {
    const result = await usersDb.delete(filter);
    if (result.value) return result;
    throw (new Error('nothing to delete'));
  }
}

module.exports = User;
