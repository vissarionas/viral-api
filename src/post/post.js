const config = require('config').mongo;
const getCollection = require('../shared/collectionClient');

const Post = {};

(async () => {
  this.collection = await getCollection(config.get('collections.posts'));
})();

/**
 * Return post docs
 * @param {Object} params
 * @return {Array} post docs
 */
Post.get = params => this.collection.find(params).toArray();

module.exports = Post;
