const config = require('config').mongo;
const getCollection = require('../shared/collectionClient');

const Post = {};

(async () => {
  this.collection = await getCollection(config.get('collections.posts'));
})();

Post.get = async (params) => {
  try {
    const postsCursor = await this.collection.find(params);
    // iterate instead of transforming to array
    return await postsCursor.toArray();
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = Post;
