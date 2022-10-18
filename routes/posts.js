const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

router.post('/', async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savePost = await newPost.save();
    return res.status(200).json(savePost);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      return res.status(200).json('post edit success');
    } else {
      return res.status(403).json('cant edit post others');
    }
  } catch (err) {
    return res.status(403).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      return res.status(200).json('post delete success');
    } else {
      return res.status(403).json('cant delete post others');
    }
  } catch (err) {
    return res.status(403).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (err) {
    return res.status(403).json(err);
  }
});

router.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      return res.status(200).json('like success');
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      return res.status(403).json('already like');
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get('/timeline/all', async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map(friendID => {
        return Post.find({ userId: friendID });
      }),
    );
    return res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
