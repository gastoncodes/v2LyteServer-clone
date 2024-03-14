import { Model, DataTypes } from "sequelize";
import sequelize from "../../../lib/index";

// Interface for the Appartment  model
interface AppartmentAttributes {
  appartment_id: Number;
  property_id: Number;
  appartment_name: String;
  short_description: String;
  long_description: String;
  owner_id: Number;
  confirmed: Boolean;
}
// Interface for the Appartment Room model
interface AppartmentRoomAttributes {
  appartment_room_id: Number;
  appartment_id: Number;
  appartment_room_description: String;
  appartment_room_number: String;
  appartment_room_booking_fee: Number;
  appartment_room_amount_monthly: Number;
  appartment_room_occupied_status: Boolean;
  appartment_room_booking_status: Boolean;
}

//Appartment model using the interface
const Appartment = sequelize.define<Model<AppartmentAttributes>>(
  "Appartment",
  {
    appartment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    property_id: { type: DataTypes.INTEGER },
    appartment_name: { type: DataTypes.STRING },
    short_description: { type: DataTypes.STRING },
    long_description: { type: DataTypes.STRING },
    owner_id: { type: DataTypes.NUMBER },
    confirmed: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: "appartment" }
);

//Appartment Room model using appartment room interface
const AppartmentRoom = sequelize.define<Model<AppartmentRoomAttributes>>(
  "AppartmentRoom",
  {
    appartment_room_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    appartment_id: { type: DataTypes.INTEGER },
    appartment_room_description: { type: DataTypes.STRING },
    appartment_room_number: { type: DataTypes.STRING },
    appartment_room_booking_fee: { type: DataTypes.INTEGER },
    appartment_room_amount_monthly: { type: DataTypes.INTEGER },
    appartment_room_occupied_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    appartment_room_booking_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "appartment_room",
  }
);

export default { Appartment, AppartmentRoom };
