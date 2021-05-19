const express = require('express');
const User = require('../models/user-model');
const router = express.Router();


// Get all Users
router.get("/users", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (e) {
    res.status(500).json(`error occurred ${e}`);
  }
});


//Create User
router.post("/users", async (req, res) => {
  const { username, email, password, profilePicture, coverPicture, followers, followings, description, city} = req.body;
  if ( !username ) {
    res.status(400).json("missing things");
    return;
  }
  try{
    const response = await User.create({
    username,
    email,
    password,
    profilePicture,
    coverPicture,
    followers,
    followings,
    description,
    city,
  });
  res.status(200).json(response);
  } catch(e) {
    res.status(500).json(`error occured ${e}`)
  }
})


//delete User
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json(`post with id ${req.params.id} deleted`)
  } catch(e){
    res.status(500).json(`error occured ${e}`)
  }
})
// Get User by id
router.get("/users/:id", async (req, res) => {
  try {
    const users = await User.findById(req.params.id);
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json(`error occured ${e}`)
  }
})

// fetch User page by id
router.get("/users", async (req, res) => {
  const userId = req.query.user._id;
  const username = reqQuery.user.username;
  try {
    const users = userId ? await User.findById(userId) : await User.findOne({username: username});
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json(`error occured ${e}`)
  }
})


// Update User
router.put("/users/:id", async (req, res) => {
  try {
    const { username, email, password, profilePicture, coverPicture, followers, followings, description, city} = req.body;
    await User.findByIdAndUpdate(req.params.id, {
      username,
      email,
      password,
      profilePicture,
      coverPicture,
      followers,
      followings,
      description,
      city,
      });
    res.status(200).json(`post with id ${req.params.id} deleted`)
  } catch {
    res.status(500).json(`error occured ${e}`)
  }
})

// Follow User
router.put("/user/:id/follow", async (req, res) => {
  try{
 
    const userToFollow = await User.findById(req.params.id);
    const currentUser = req.user;
    const alreadyFollowing = currentUser.followings.some((user) => {
      return user._id.toString() === userToFollow._id.toString();
    })
  
    if(!alreadyFollowing) {
      //update myself
      await User.updateOne({ _id: currentUser._id }, { $push: {followings: userToFollow}});
      //update user i just followed
      await User.updateOne({ _id: userToFollow._id }, { $push: {followers: currentUser}});

      res.status(200).json("user has been followed")
    } else {
      res.status(403).json("you allready follow this user")
  }

  } catch (e){
    res.status(500).json(`error occured ${e}`)
  }
})


// Unfollow User
router.put("/user/:id/unfollow", async (req, res) => {
  try{
 
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = req.user;


      //update myself
      await User.updateOne({ _id: currentUser._id }, { $pull: {followings: userToUnfollow._id}});
      //update user i just unfollowed
      await User.updateOne({ _id: userToUnfollow._id }, { $pull: {followers: currentUser._id}});

      res.status(200).json("user has been unfollowed")


  } catch (e){
    res.status(500).json(`error occured ${e}`)
  }
})



module.exports = router;
