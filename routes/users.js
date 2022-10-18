const router = require('express').Router();
const User = require('../models/User');

router.put('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json('user info update');
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json('yourself only update');
  }
});

router.delete('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json('user info delete');
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json('yourself only delete');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.put('/:id/follow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        return res.status(200).json('follow success');
      } else {
        return res.status(403).json('already followed');
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json('cant yourself');
  }
});

router.put('/:id/unfollow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        return res.status(200).json('unfollow success');
      } else {
        return res.status(403).json('cant unfollow');
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json('cant unfollow yourself');
  }
});

// router.get('/', (req, res) => {
//   res.send('user router');
// });

module.exports = router;
