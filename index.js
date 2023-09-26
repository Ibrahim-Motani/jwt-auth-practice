const express = require("express");
const connectDB = require("./db-config");
require("dotenv").config();

connectDB();

const app = express();
app.use(express.json())
app.use("/api/users", require("./user-routes"));
app.listen(8100, () => {
  console.log(`Server running on port 8100`);
});
app.get("/", (req, res) => {
  res.send("Home route");
});
