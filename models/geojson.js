'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Geojson extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Geojson.init({
    useremail: DataTypes.STRING,
    data: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Geojson',
  });
  return Geojson;
};