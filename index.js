const express = require("express");
const DB = require("./modals/index");
var cors = require("cors");
var app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("Invalid Route");
  });

  const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
