const mongoose = require("mongoose");
//dfdfdf

mongoose
  .connect(
    "mongodb+srv://ranauzair:alialiali@cluster0.llkh8q7.mongodb.net/LeoSitter"
  )
  .then(() => {
    console.log("Database working successfully");
  })
  .catch((Error) => {
    console.log(Error);
  });
