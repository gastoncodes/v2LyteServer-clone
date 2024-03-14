import { Model, DataTypes } from "sequelize";
import sequelize from "../../../lib/index";

// Interface for the Rental  model
interface RentalAttributes {
  rental_id: Number;
  owner_id: Number;
  property_id: Number;
  short_description: String;
  long_description: String;
  number_of_bedrooms: Number;
  booking_fee: Number;
  room_amount_per_month: Number;
  room_type: "single" | "double" | "studio_room" | String;
  rental_identifier: String /*  like a name  */;
  confirmed: Boolean;
  booking_status: Boolean;
  occupied_status: Boolean;
}

//Rental model using the interface
const Rental = sequelize.define<Model<RentalAttributes>>(
  "Rental",
  {
    rental_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    property_id: { type: DataTypes.INTEGER },
    owner_id: { type: DataTypes.INTEGER },
    short_description: { type: DataTypes.STRING },
    long_description: { type: DataTypes.STRING },
    number_of_bedrooms: { type: DataTypes.NUMBER },
    booking_fee: { type: DataTypes.NUMBER },
    room_amount_per_month: { type: DataTypes.NUMBER },
    room_type: { type: DataTypes.STRING },
    rental_identifier: { type: DataTypes.STRING },
    confirmed: { type: DataTypes.BOOLEAN, defaultValue: false },
    booking_status: { type: DataTypes.BOOLEAN, defaultValue: false },
    occupied_status: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "rental",
  }
);

export default Rental;
