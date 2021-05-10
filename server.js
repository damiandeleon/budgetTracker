const express = require("express");
const mongoose = require("mongoose");
const compression = require("compression");
const morgan = require('morgan'); 



const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// routes
equire("./routes/api.js")(app);

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget", 
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})



app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});