const config = require('config').mongo;
const dbName = config.get('databases.viral');
const client = require('./dbConnection');

const getAllPosts = (req, res) => {
  const db = client.db(dbName);
  const postsCursor = db.collection(config.get('collections.posts')).find();
  let posts = [];
  postsCursor.forEach(doc => {
    posts.push(doc);
  }).then(() => {
    res.send(posts);
  });
};

const createPostObject = (body, location) => {
  const postObject = {
    "_id": "something",
    "user": "some user id",
    "body": body,
    "geo": {
      "type": "Polygon",
      "coordinates": []
    }
  }
  return createPostObject;
};

const testFunction = () => {
  return 'something';
}

module.exports = {
  getAllPosts,
  createPostObject,
  testFunction
}