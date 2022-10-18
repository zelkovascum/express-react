const User = require('../models/User');
const router = require('express').Router();

router.post('/register', async (req, res) => {
  try {
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const user = await newUser.save();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send('user not found');
    const vailedPassword = req.body.password === user.password;
    if (!vailedPassword) return res.status(400).json('pass x');
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get('/', (req, res) => {
  res.send('auth router');
});

module.exports = router;
