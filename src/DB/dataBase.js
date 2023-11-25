const mongoose = require("mongoose");

mongoose
  // .connect("mongodb://localhost:27017/"), {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // })
  .connect("mongodb://localhost:27017/LeoSitters")
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
  });
