const express = require("express");
const DB = require("./models/index");
var cors = require("cors");
const multer = require("multer");
var app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Invalid Route");
});

//a route to register a user and save the user to the database
app.post("/register", async (req, res) => {
  const { useremail, password } = req.body;
  //if the useremail or password is empty, send a 400 status code
  if (!useremail || !password) {
    res.status(400).send("Please provide a useremail and password.");
    return;
  }
  try {
    //if the useremail already exists, send a 400 status code and a message else create the user
    const user = await DB.user.findOne({ where: { useremail } });
    if (user) {
      res.status(400).send("User already exists.");
    } else {
      const newUser = await DB.user.create({ useremail, password });

      res.status(200).send(newUser);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to register user.");
  }
});

//a route to login a user
app.post("/login", (req, res) => {
  const { useremail, password } = req.body;

  DB.user
    .findOne({ where: { useremail, password } })
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(400).send("Invalid useremail or password.");
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Failed to login user.");
    });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), (req, res) => {
  //now data will come in req in this format {useremail: "useremail", file: file}
  const { useremail } = req.body;
  const file = req.file;
  console.log(req.body);

  //if the useremail or file is empty, send a 400 status code
  if (!useremail || !file) {
    res.status(400).send("Please provide a useremail and file.");
    return;
  }
  try {
    if (!req.file) {
      res.status(400).send("Please upload a file.");
      return;
    } else {
      //check the file is geojson or tiff or kml
      const file = req.file;
      console.log(file);
      const fileType = file.originalname.split(".").pop();

      if (fileType === "geojson" || fileType === "kml" || fileType === "tiff") {
        //convert the file to geojson and save it to the database

        if (fileType === "geojson") {
          const file = req.file;
          const fs = require("fs");
          const geojson = JSON.parse(fs.readFileSync(file.path, "utf8"));

          DB.geojsondata
            .create({ useremail, data: geojson })
            .then((geojsondata) => {
              res.status(200).send(geojsondata);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Failed to save geojson data.");
            });
        } else if (fileType === "kml") {
          const kmlToGeoJSON = require("./utils/kmltoGeojson");

          kmlToGeoJSON(file.path, (err, geojson) => {
            if (err) {
              console.error(err);
              return;
            }

            DB.geojsondata

              .create({ useremail, data: geojson })
              .then((geojsondata) => {
                res.status(200).send(geojsondata);
              })
              .catch((error) => {
                console.error(error);
                res.status(500).send("Failed to save geojson data.");
              });
          });
        }

        if (fileType === "tiff") {
          const tiffToGeoJSON = require("./utils/tiffToGeojson");

          tiffToGeoJSON(file.path, (err, geojson) => {
            if (err) {
              console.error(err);
              return;
            }

            DB.geojsondata
              .create({ useremail, data: geojson })
              .then((geojsondata) => {
                res.status(200).send(geojsondata);
              })
              .catch((error) => {
                console.error(error);
                res.status(500).send("Failed to save geojson data.");
              });
          });
        }
      } else {
        res.status(400).send("Please upload a geojson, kml or tiff file.");
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Failed to upload file.");
  }
});

//add a route to get all the geojson data

app.get("/data", (req, res) => {
  const { useremail } = req.query;

  DB.geojsondata
    .findAll({ where: { useremail } })
    .then((geojsondata) => {
      res.status(200).send(geojsondata);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Failed to get geojson data.");
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
