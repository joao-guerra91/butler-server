const express = require('express');
const Post = require('../models/post-model');
const router = express.Router();
const fileUpload = require("../configs/cloudinary");


//search
router.get('/post/search', async (req, res) => {
  res.render('search');
});


// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const allPosts = await Post.find().populate("user");
    res.status(200).json(allPosts);
  } catch(e) {
    res.status(500).json(`error occured ${e}`)
  }
})

//Create Post
router.post("/posts", async (req, res) => {
  const { title, imageUrl, description, likes, price, service, user} = req.body;
  if ( !title ) {
    res.status(400).json("missing things");
    return;
  }
  try{
    const response = await Post.create({
    title,
    imageUrl,
    description,
    price,
    likes,
    service,
    user: req.user._id,
  });
  res.status(200).json(response);
  } catch(e) {
    res.status(500).json(`error occured ${e}`)
  }
})

//delete post
router.delete('/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json(`post with id ${req.params.id} deleted`)
  } catch(e){
    res.status(500).json(`error occured ${e}`)
  }
})

// Get by id
router.get("/posts/:id", async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);
    res.status(200).json(posts);
  } catch (e) {
    res.status(500).json(`error occured ${e}`)
  }
})
// Update
router.put("/posts/:id", async (req, res) => {
  try {
    const {title ,description, likes, price, imageUrl, service, user} = req.body;
    await Post.findByIdAndUpdate(req.params.id, {
    title,
    description,
    likes,
    price,
    imageUrl,
    service,
    user,
    });
    res.status(200).json(`post with id ${req.params.id} deleted`)
  } catch {
    res.status(500).json(`error occured ${e}`)
  }
})

// Upload image to cloudinary
router.post('/upload', fileUpload.single('file'), (req, res) => {
  try{
      res.status(200).json({ fileUrl: req.file.path });
  } catch(e) {
    res.status(500).json(`error occurred ${e}`)
  }
});

// Like and dislike a Post
router.put("/post/:id/like", async (req, res) => {
  try{
    const post = await Post.findById(req.params.id) 
    const currentUser = req.user;

    const alreadyLiked = post.likes.some((user) => {
      return user._id.toString() === currentUser._id.toString();
    })
    
      if(!alreadyLiked) {
        //update myself
        await Post.updateOne({ _id: post._id }, { $push: { likes: currentUser}});
      
        res.status(200).json("post has been liked")
      } else {
        await Post.updateOne({ _id: post._id }, { $pull: { likes: currentUser._id}});

        res.status(403).json("post has been unliked")
    }
  
    } catch (e){
      res.status(500).json(`error occured ${e}`)
    }
})



module.exports = router;


