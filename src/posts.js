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

module.exports = {
  getAllPosts
}