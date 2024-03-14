import { Model, DataTypes } from "sequelize";
import sequelize from "../../../lib/index";

// Interface for the Hotel  model
interface HotelAttributes {
  hotel_id: Number;
  property_id: Number;
  hotel_name: String;
  short_description: String;
  long_description: String;
  owner_id: Number;
  confirmed: Boolean;
}
// Interface for the Hotel Room model
interface HotelRoomAttributes {
  hotel_room_id: Number;
  hotel_id: Number;
  hotel_room_description: String;
  hotel_room_number: Number;
  hotel_room_booking_fee: Number;
  hotel_room_amount_per_night: Number;
  hotel_room_occupied_status: Boolean;
  hotel_room_booking_status: Boolean;
}

//Hotel model using the interface
const Hotel = sequelize.define<Model<HotelAttributes>>(
  "Hotel",
  {
    hotel_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    property_id: { type: DataTypes.INTEGER },
    hotel_name: { type: DataTypes.STRING },
    short_description: { type: DataTypes.STRING },
    long_description: { type: DataTypes.STRING },
    owner_id: { type: DataTypes.NUMBER },
    confirmed: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: "hotel" }
);

//HotelRoom model using appartment hotel interface
const HotelRoom = sequelize.define<Model<HotelRoomAttributes>>(
  "HotelRoom",
  {
    hotel_room_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    hotel_id: { type: DataTypes.NUMBER },
    hotel_room_description: { type: DataTypes.STRING },
    hotel_room_number: { type: DataTypes.NUMBER },
    hotel_room_booking_fee: { type: DataTypes.NUMBER },
    hotel_room_amount_per_night: { type: DataTypes.NUMBER },
    hotel_room_occupied_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hotel_room_booking_status: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "hotel_room",
  }
);

export default { Hotel, HotelRoom };
