// Here is where we import modules
// We begin by loading Express
const localPort = 3000;
const express = require('express');

const app = express();

app.get('/', async (req,res) => {
  // res.send('<h1>Empty</h1>');
  res.redirect('/index');
});

app.get('/index', (req,res)=>{
  res.render('index.ejs');
});

app.get('/home', (req,res)=>{
  res.send('<h1>Home</h1>');
});

app.listen(localPort, () => {
  console.log(`Listening on port ${localPort}`);
});
