const express = require("express");
const app = express();
require("dotenv").config({ path: "src/.env" });
const PORT = process.env.PORT || 4000;
const apiRoutes = require("./src/routes");
const cors = require("cors");

require("./src/DB/dataBase");

app.use(express.json());
app.use(cors());
app.use("/", apiRoutes);
app.use(express.static("build"));
app.use("/public", express.static("public"));
app.get("/", (req, res) => {
  res.send("hi there");
  res.end();
});
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
