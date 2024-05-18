const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const geojsondata = require("./geojson");
const user = require("./user");
const db = {};

let sequelize;

sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const establishConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

establishConnection();
db.geojsondata = geojsondata;
db.geojsondata = geojsondata(sequelize, Sequelize.DataTypes);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.geojsondata.associate(db);

db.user = user;
db.user = user(sequelize, Sequelize.DataTypes);
db.user.associate(db);

module.exports = db;
