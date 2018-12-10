const mongoose = require('mongoose');
const config = require('config');
const models = require('./models');

mongoose.connect(config.get('mongo.databases.viral'));

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("we're connected!");
});

const getUsers = () => {
  models.userModel.find({}, (err, users) => {
    users.forEach(user => {
      console.log(user._doc);
    })
  });
};

const saveEmailUser = (req, res) => {
  models.userModel.find({email: 'katerina2@gmail.com'}, (err, docs) => {
    if (!docs.length) {
      let user = models.userModel({
        _id: '123456',
        username: 'katerina2',
        email: 'katerina2@gmail.com',
        password: 'password',
        provider: ''
      });
      user.save((err, result) => {
        res.send(result);
        console.log(err ? err : result);
      });
    } else {
      res.send('user exists');
    }
  });
};

module.exports = {
  getUsers,
  saveEmailUser
};
