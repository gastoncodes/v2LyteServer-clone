import { Model, DataTypes } from "sequelize";
import sequelize from "../../../lib/index";

// Interface for the property model
export interface PropertyAttributes extends Model {
  property_id: number;
  district: string;
  location_1: string;
  location_2: string;
  google_map_coordinates: string;
  image_paths: string;
  video_paths: string;
  data_sheet: string;
  view_count: string;
}

// Define the property model using the interface
export const Property = sequelize.define<PropertyAttributes>(
  "Property",
  {
    property_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    district: { type: DataTypes.STRING },
    location_1: { type: DataTypes.STRING },
    location_2: { type: DataTypes.STRING },
    google_map_coordinates: { type: DataTypes.STRING },
    image_paths: { type: DataTypes.STRING },
    video_paths: { type: DataTypes.STRING },
    data_sheet: { type: DataTypes.STRING },
    view_count: { type: DataTypes.STRING },
  },
  { tableName: "property" }
);
