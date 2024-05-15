const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Set the view engine to ejs
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());

// Index page
app.get('/', function(req, res) {
  res.render('pages/index');
});

// Port
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});