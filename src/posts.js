const config = require('config').mongo;
const dbName = config.get('database');
const client = require('./dbConnection');
const coordinates = require('./coordinates');

const getIntersectedPosts = (req, res) => {
  const db = client.db(dbName);
  const longitude = req.body.longitude;
  const latitude = req.body.latitude;
  const postsCursor = db.collection(config.get('collections.posts')).find({
    geo: {
      $geoIntersects: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        }
      }
    }
  });
  let posts = [];
  postsCursor.forEach(doc => {
    posts.push(doc);
  }).then(() => {
    res.send(posts);
  });
};

const savePost = (req, res) => {
  const db = client.db(dbName);
  const user = req.user.userId;
  const body = req.body.content;
  const longitude = req.body.longitude;
  const latitude = req.body.latitude;
  const postObject = createPostObject(user, body, parseFloat(longitude), parseFloat(latitude));
  db.collection(config.get('collections.posts')).insertOne(postObject)
  .then((result) => {
    res.send(result.insertedCount);
  }, err => {
    res.send(err);
  })
};

const createPostObject = (user, content, longitude, latitude) => {
  const coordinateBox = coordinates.createCoordinatesBox(longitude, latitude, 0.05)
  const postObject = {
    user: user,
    content: content,
    geo: {
      type: "Polygon",
      coordinates: [
        coordinateBox
      ]
    }
  }
  return postObject;
};

module.exports = {
  getIntersectedPosts,
  savePost
}