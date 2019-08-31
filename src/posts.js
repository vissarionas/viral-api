const DbAdapter = require('./shared/dbAdapter');

const PostsDb = new DbAdapter('posts');

class Posts {
  static async get(req, res) {
    const filter = { ...req.body };
    try {
      const posts = await PostsDb.getMany(filter);
      res.status(200).send(posts);
    } catch (error) {
      res.status(404).send({ message: 'posts not found' });
    }
  }
}

module.exports = Posts;
