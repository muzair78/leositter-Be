const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const apiRoutes = require("./src/routes/route");
const cors = require("cors");

require("../server/src/DB/dataBase");
require("dotenv").config({ path: "src/.env" });

app.use(express.json());
app.use(cors());
app.use(apiRoutes);
app.use(express.static("build"));
app.use("/public", express.static("public"));

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
