const config = require('config').mongo;
const dbName = config.get('database');
const client = require('./dbClient');
const coordinates = require('./coordinates');

const getPost = (id) => {
  const db = client.db(dbName);
  return new Promise(function (resolve, reject) {
    db.collection('posts').findOne({ _id: id })
      .then(post => resolve(post),
        err => reject(err));
  });
};

const getIntersectedPosts = (req, res) => {
  const db = client.db(dbName);
  const { longitude } = req.body;
  const { latitude } = req.body.latitude;
  const postsCursor = db.collection(config.get('collections.posts')).find({
    geo: {
      $geoIntersects: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        }
      }
    }
  });
  const posts = [];
  postsCursor.forEach(doc => posts.push(doc))
    .then(() => res.send(posts));
};

const createPostObject = (user, content, longitude, latitude) => {
  const coordinateBox = coordinates.createCoordinatesBox(longitude, latitude, 0.02);
  const postObject = {
    user,
    content,
    point: { longitude, latitude },
    geo: {
      type: 'Polygon',
      coordinates: [
        coordinateBox
      ]
    }
  };
  return postObject;
};


const savePost = (req, res) => {
  const db = client.db(dbName);
  const user = req.user.userId;
  const body = req.body.content;
  const { longitude } = req.body.longitude;
  const { latitude } = req.body.latitude;
  const postObject = createPostObject(user, body, parseFloat(longitude), parseFloat(latitude));
  db.collection(config.get('collections.posts')).insertOne(postObject)
    .then(result => res.send(result),
      err => res.send(err));
};

const updateCoordinateBox = (id, newCoordinatesBox) => {
  const db = client.db(dbName);
  return new Promise(function (resolve, reject) {
    db.collection('posts').updateOne(
      { _id: id },
      { $set: { 'geo.coordinates': newCoordinatesBox } }
    ).then((data) => {
      if (data.modifiedCount) {
        resolve(data);
      } else {
        reject(data.modifiedCount);
      }
    }, err => reject(err));
  });
};

const likePost = (req) => {
  const newLocation = { lon: req.body.longitude, lat: req.body.latitude };
  getPost(req.body.id)
    .then((post) => {
      const previousLocation = { lon: post.point.longitude, lat: post.point.latitude };
      const sides = coordinates.getSidesToBeScaled(newLocation, previousLocation);
      const newCoordinatesBox = coordinates.scaleCoordinatesBox(post.geo.coordinates, sides);
      updateCoordinateBox(post._id, newCoordinatesBox);
    },
    err => console.log(err));
};

module.exports = {
  getIntersectedPosts,
  savePost,
  likePost
};
