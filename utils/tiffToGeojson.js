const fs = require("fs");

function tiffToGeoJSON(tiffFilePath, callback) {
  fs.readFile(tiffFilePath, (err, data) => {
    if (err) {
      callback(err);
      return;
    }

    // Assuming the TIFF is a grayscale image
    const width = 512; // Width of the image
    const height = 512; // Height of the image
    const pixelValues = Array.from(data); // Convert buffer to array

    const geojson = {
      type: "FeatureCollection",
      features: [],
    };

    // Calculate the pixel width and height
    const pixelWidth = 360 / width;
    const pixelHeight = 180 / height;

    // Loop through each pixel and create a polygon feature
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const value = pixelValues[y * width + x]; // Assuming single-band TIFF

        const lon1 = -180 + x * pixelWidth;
        const lon2 = lon1 + pixelWidth;
        const lat1 = 90 - y * pixelHeight;
        const lat2 = lat1 - pixelHeight;

        // Construct the GeoJSON polygon feature
        const feature = {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [lon1, lat1],
                [lon2, lat1],
                [lon2, lat2],
                [lon1, lat2],
                [lon1, lat1],
              ],
            ],
          },
          properties: {
            value: value,
          },
        };

        // Add the feature to the GeoJSON object
        geojson.features.push(feature);
      }
    }

    callback(null, geojson);
  });
}

module.exports = tiffToGeoJSON;
