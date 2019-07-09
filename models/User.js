const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    //using gravator for this.
    type: String
  },
  date: {
    type: Date,
    default: Date.now //makes it happen autmatically.
  }
});

module.exports = User = mongoose.model('user', UserSchema);
