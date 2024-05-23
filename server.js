const express = require('express');
const { Liquid } = require('liquidjs');
const path = require('path');

const app = express();
const port = 3000;

// Initialize Liquid engine
const engine = new Liquid({
  root: path.resolve(__dirname, 'views'), // specify the views directory
  extname: '.liquid' // specify the file extension
});

// Set Liquid as the view engine
app.engine('liquid', engine.express());
app.set('view engine', 'liquid');
app.set('views', path.resolve(__dirname, 'views'));

// Serve static files
app.use(express.static('assets'));

// Index page
app.get('/', function(req, res) {
  res.render('pages/index', { pageName: 'index' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});