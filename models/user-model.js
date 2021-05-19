const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  profilePicture: {
    type: String,
    default: "/images/blank-profile-picture.png",
  },
  coverPicture: {
    type: String,
    default: "/images/default-background.jpg",
  },
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  followings: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  description: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
},
{timestamps:true}
);

const User = mongoose.model('User', userSchema);
module.exports = User;
