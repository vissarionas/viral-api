const config = require('config').mongo;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(config.get('uri'), {
  useNewUrlParser: true,
  auth: {
    user: config.get('credentials.user'),
    password: config.get('credentials.password')
  }
});

client.connect()
.then(() => {
  console.log('MongoDb connection opened');
}, err => {
  console.log(err);
});

module.exports = client;