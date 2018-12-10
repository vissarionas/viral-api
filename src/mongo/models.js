const mongoose = require('mongoose');
 
const user = new mongoose.Schema({
  _id: {
    type: 'String',
    required: true
  },
  username: {
    type: 'String',
    required: true
  },
  email: {
    type: 'String',
    required: true
  },
  password: {
    type: 'String',
    required: false
  },
  provider: {
    type: 'String',
    required: false
  }
});

module.exports = {
  userModel :mongoose.model('User', user),
}