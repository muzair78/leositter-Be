const mongoose = require("mongoose");
//dfdfdf

mongoose
  .connect("mongodb://localhost:27017/LeoSitters")
  .then(() => {
    console.log("Database working successfully");
  })
  .catch((Error) => {
    console.log(Error);
  });
