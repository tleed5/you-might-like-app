const mongoose = require('mongoose');

const DB_URI = process.env.DB_URI || '';
mongoose.connection.on("open", function(ref) {
  console.log("Connected to mongo server.");
});
mongoose.connection.on("error", function(err) {
  console.log("Could not connect to mongo server!");
});
mongoose.connect(DB_URI, {useNewUrlParser: true});


