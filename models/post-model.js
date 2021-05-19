const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
  }, 
  imageUrl: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  service: {
    type: String,
  },
  likes:  [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
  
},
{timestamps:true}
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;