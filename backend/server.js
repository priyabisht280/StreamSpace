const express = require("express");
const router = require("./Router/router");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;

const bodyParser = require("body-parser");

const connectDB = require("./Database/database"); // adjust path if needed

connectDB();
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Middlewares
app.use(router);
app.set("view engine", "hbs");
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

