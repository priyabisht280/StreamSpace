const express = require("express");
const router = require("./Router/router");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;

const bodyParser = require("body-parser");
const connectDB = require("./Database/database");

connectDB();

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ ADD ROUTES BEFORE LISTEN
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use(router);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// ✅ START SERVER LAST
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
