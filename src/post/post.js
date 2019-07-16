const config = require('config').mongo;
const dbClient = require('../shared/dbClient');

const Post = {};

(async () => {
  this.collection = await dbClient(config.get('collections.posts'));
})();

/**
 * Return promise that resolves to array
 * @param {Object} params
 * @return {Promise}
 */
Post.getByUser = params => this.collection.find(params).toArray();

Post.getInterected = params => this.collection.find({
  geo: {
    $geoIntersects: {
      $geometry: {
        type: 'Point',
        coordinates: [params.longitude, params.latitude]
      }
    }
  }
}).toArray();

Post.create = params => this.collection.insertOne(params);

module.exports = Post;
