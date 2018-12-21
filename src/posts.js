const config = require('config').mongo;
const dbName = config.get('databases.viral');
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
          coordinates: [Number(longitude), Number(latitude)]
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

const createPostObject = (body, location) => {
  const coordinateBox = coordinates.createCoordinatesBox(location, 0.05)
  const postObject = {
    "_id": "something",
    "user": "some user id",
    "body": body,
    "geo": {
      "type": "Polygon",
      "coordinates": [
        coordinateBox
      ]
    }
  }
  return postObject;
};

const testFunction = () => {
  return 'something';
}

module.exports = {
  getIntersectedPosts,
  createPostObject,
  testFunction
}