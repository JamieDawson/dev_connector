const moongoose = require('mongoose');
const Scheme = moongoose.Schema;

const PostSchema = new Scheme({
  user: {
    type: Scheme.Types.ObjectId,
    ref: 'users'
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        type: Scheme.Types.ObjectId,
        ref: 'users'
        //which likes came from which user.
      }
    }
  ],
  comments: [
    {
      user: {
        type: Scheme.Types.ObjectId,
        ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = moongoose.model('post', PostSchema);
