const localPort = 3000;

// Here is where we import modules
// We begin by loading Express
const express = require('express');
const dotenv = require('dotenv');
const Fruit = require('./models/fruit.js');
const methodOverride = require("method-override"); // new
const morgan = require("morgan"); //new

dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new

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
  // console.log(allFruits);

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
  // console.log('New Fruit:', req.body);

  if (req.body.name) await Fruit.create(req.body);
  res.redirect('/fruits');
});

app.get('/fruits/:id', async (req,res) => {
  const fruit = await Fruit.findById(req.params.id);
  // console.log(fruit).name;
  res.render("fruits/show.ejs", { fruit: fruit });
  // res.send(fruit);
});

app.delete('/fruits/:id', async (req, res) => {
  // res.send(req.params.id);
  await Fruit.findByIdAndDelete(req.params.id);
  res.redirect('/fruits');
});

app.get('/fruits/:id/edit', async (req,res) => {
  const fruit = await Fruit.findById(req.params.id);
  console.log(fruit);
  // res.send(`This is the edit route for ${fruit.name}`);
  res.render('fruits/edit.ejs', {fruit: fruit});
});

app.put('/fruits/:id', async (req,res) => {
  req.body.isReadyToEat = (req.body.isReadyToEat === 'on');
  await Fruit.findByIdAndUpdate(req.params.id, req.body);
  res.redirect(`/fruits/${req.params.id}`);
});

app.listen(localPort, () => {
  console.log(`Listening on port ${localPort}`);
});
