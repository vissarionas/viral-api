/* eslint-disable consistent-return */
const coordinates = require('../coordinates');

// GRAPHQL REFACTOR
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

// GRAPHQL REFACTOR
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

// GRAPHQL REFACTOR
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

// GRAPHQL REFACTOR
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
  savePost,
  likePost
};
