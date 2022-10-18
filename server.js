const express = require('express');
const app = express();
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/posts');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log('db connection');
  })
  .catch(err => {
    console.log(err);
  });

app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

app.get('/', (req, res) => {
  res.send('hello');
});

app.listen(3000, () => console.log('server up'));
