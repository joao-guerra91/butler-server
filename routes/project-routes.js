const express = require('express');
const Post = require('../models/post-model');
const router = express.Router();
const fileUpload = require("../configs/cloudinary");

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const allPosts = await Post.find();
    res.status(200).json(allPosts);
  } catch(e) {
    res.status(500).json(`error occured ${e}`)
  }
})

//Create Post
router.post("/posts", async (req, res) => {
  const { title, imageUrl } = req.body;
  if (!title || !imageUrl ) {
    res.status(400).json("missing things");
    return;
  }
  try{
    const response = await Post.create({
    title,
    imageUrl,
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
    const {title , description} = req.body;
    await Post.findByIdAndUpdate(req.params.id, {
    title,
    description,
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

module.exports = router;


