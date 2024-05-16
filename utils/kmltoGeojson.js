//convert the kml file to geojson

// Path: utils/kmltoGeojson.js

const fs = require("fs");
const togeojson = require("togeojson");
const DOMParser = require("xmldom").DOMParser;

function kmlToGeoJSON(kmlFilePath, callback) {
    fs.readFile(kmlFilePath, "utf-8", (err, data) => {
        if (err) {
        callback(err);
        return;
        }
    
        const kml = new DOMParser().parseFromString(data);
        const converted = togeojson.kml(kml);
    
        callback(null, converted);
    });
    }

module.exports = kmlToGeoJSON;
//convert the tiff file to geojson


