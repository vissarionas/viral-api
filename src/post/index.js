/* eslint-disable no-undef */
/* eslint-disable consistent-return */
const Post = require('./post');
const coordinates = require('../coordinates');

// GRAPHQL REFACTOR
const constructPostObject = (user, content, longitude, latitude) => {
  const coordinateBox = coordinates.createCoordinatesBox(longitude, latitude, 0.02);
  return {
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
};

// GRAPHQL REFACTOR
const savePost = async (user, body, longitude, latitude) => {
  const postObject = constructPostObject(user, body, parseFloat(longitude), parseFloat(latitude));
  await Post.create(postObject);
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
