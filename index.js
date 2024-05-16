const express = require("express");
const DB = require("./models/index");
var cors = require("cors");
const multer = require("multer");
var app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Invalid Route");
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
            .create({ data: geojson })
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

              .create({ data: geojson })
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
              .create({ data: geojson })
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

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
