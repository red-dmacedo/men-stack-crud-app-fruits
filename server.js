const localPort = 3000;

// Here is where we import modules
// We begin by loading Express
const express = require('express');
const dotenv = require('dotenv');
const Fruit = require('./models/fruit.js');

const app = express();
app.use(express.urlencoded({ extended: false }));
dotenv.config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});

app.get('/', async (req, res) => {
  // res.send('<h1>Empty</h1>');
  res.redirect('/index');
});

app.get('/index', (req, res) => {
  res.render('index.ejs');
});

app.get('/home', (req, res) => {
  res.send('<h1>Home</h1>');
});

app.get('/fruits/new', (req, res) => {
  res.render('fruits/new.ejs');
});

app.get('/fruits', async (req,res) => {
  const allFruits = await Fruit.find({});
  console.log(allFruits);

  // let sendHtml = '<h1>All Fruits</h1><ul>';
  // sendHtml += allFruits.reduce((accu, fruit) => {
  //   accu += `<li>${fruit.name}<ul><li>Ready to Eat: ${fruit.isReadyToEat}</li></ul></li>`;
  //   return accu;
  // }, '');
  // sendHtml += '</ul>';
  // res.send(sendHtml);

  res.render('fruits/index.ejs', {fruits: allFruits });

  // res.send('Welcome to the fruits index page!');
});

app.post('/fruits', async (req, res) => {
  req.body.isReadyToEat = (req.body.isReadyToEat === 'on');
  req.body.name = req.body.name.trim();
  console.log('New Fruit:', req.body);

  if (req.body.name) await Fruit.create(req.body);
  res.redirect('/fruits');
});

app.delete('/fruits', async (req, res) => {
  req.body.isReadyToEat = (req.body.isReadyToEat === 'on');
  req.body.name = req.body.name.trim();

  // await Fruit.deleteOne(req.body);
  res.redirect('/fruit/new');
});

app.listen(localPort, () => {
  console.log(`Listening on port ${localPort}`);
});
