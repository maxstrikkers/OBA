const express = require("express");
const { Liquid } = require("liquidjs");
const path = require("path");

const {
  searchTypesense,
  addCoverImageToDocuments,
} = require("./server-functies");

const app = express();
const port = 3000;

// Initialize Liquid engine
const engine = new Liquid({
  root: path.resolve(__dirname, "views"), // specify the views directory
  extname: ".liquid", // specify the file extension
});

// Set Liquid as the view engine
app.engine("liquid", engine.express());
app.set("view engine", "liquid");
app.set("views", path.resolve(__dirname, "views"));

// Serve static files
app.use(express.static("assets"));

// Middleware om URL-encoded data te verwerken
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Index page
app.get('/', function (req, res) {
  res.render('pages/index', { pageName: 'index' });
});

// Search route
app.post('/search', async function (req, res) {
  let conversation = req.body.bubbles;
  const message = {
    content: req.body.query,
    class: "right",
  };
  conversation.push(message);
  const chatResult = await searchTypesense(message.content, req.body.conversationId);

  const id = chatResult.conversation.conversation_history.id;

  const finalBookInfo = await addCoverImageToDocuments(chatResult.results[0].hits);

  const answerMessage = {
    content: chatResult.conversation.answer,
    class: "left",
  };
  conversation.push(answerMessage);

  res.json({ messages: conversation, results: finalBookInfo, conversationId: id });
});



// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
