const express = require('express');

const app = express();
const port = 3000;

// set the view engine to ejs
app.use(express.static('public'));
app.set('view engine', 'ejs');

// index page
app.get('/', function(req, res) {
  res.render('pages/index', {pageName: 'index'});
});

// Port
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
}); 