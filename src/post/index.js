/* eslint-disable consistent-return */
const Post = require('../post/post');

const POST_SEARCH_FIELDS = ['user', 'content'];

const getPosts = async (req, res) => {
  const query = {};
  POST_SEARCH_FIELDS.forEach((field) => {
    const value = req.headers[field];
    if (value !== undefined) query[field] = value;
  });
  try {
    const post = await Post.get(query);
    res.status(200).send(post);
  } catch (err) {
    res.status(err.status).send(err.message);
    return Promise.reject(err);
  }
};

module.exports = {
  getPosts,
};
