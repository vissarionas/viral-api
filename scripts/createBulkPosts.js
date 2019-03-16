require('dotenv').config();

const { MongoClient } = require('mongodb');
const circleToPolygon = require('../src/circleToPolygon');

const connectionOptions = {
  useNewUrlParser: true,
  auth: {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  }
};

const client = new MongoClient(process.env.DB_URL, connectionOptions);

client.connect(() => {
  const db = client.db('viral');
  const collection = db.collection('posts');

  const users = ['3oazri8u8tjsknqgvn', '3oazri87fvjsr78pjo'];
  const radius = 30000;
  const numberOfEdges = 32;
  const posts = [];

  const createRandomPost = () => {
    const user = users[Math.round(Math.random())];
    const content = `Some dummy content ${Math.round(Math.random() * 1000)}`;
    const longitude = Math.random() * 180;
    const latitude = Math.round(Math.random()) ? Math.random() * 90 : (Math.random() * 90) * -1;
    const coordinates = [longitude, latitude];
    const polygon = circleToPolygon(coordinates, radius, numberOfEdges);
    return {
      user,
      content,
      longitude,
      latitude,
      geo: polygon,
      type: 'random-post'
    };
  };

  let postsCounter = 2;
  while (postsCounter) {
    posts.push(createRandomPost());
    postsCounter -= 1;
  }

  collection.insertMany(posts, (err) => {
    console.log(err || 'Script finished');
  });

  client.close();
});
