import { Model, DataTypes } from "sequelize";
import sequelize from "../../../lib/index";

// Interface for the GuestHouse  model
interface GuestHouseAttributes {
  guesthouse_id: Number;
  property_id: Number;
  guesthouse_name: String;
  short_description: String;
  long_description: String;
  owner_id: Number;
  confirmed: Boolean;
}
// Interface for the Gest House Room model
interface GuestHouseRoomAttributes {
  guesthouse_room_id: Number;
  guesthouse_id: Number;
  guesthouse_room_description: String;
  guesthouse_room_number: String;
  guesthouse_room_booking_fee: Number;
  guesthouse_room_amount_per_night: Number;
  guesthouse_room_occupied_status: Boolean;
  guesthouse_room_booking_status: Boolean;
}

//Guest House model using the interface
const GuestHouse = sequelize.define<Model<GuestHouseAttributes>>(
  "GUestHouse",
  {
    guesthouse_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    property_id: { type: DataTypes.INTEGER },
    guesthouse_name: { type: DataTypes.STRING },
    short_description: { type: DataTypes.STRING },
    long_description: { type: DataTypes.STRING },
    owner_id: { type: DataTypes.INTEGER },
    confirmed: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: "guest_house" }
);

//GuestHouseRoom model using guesthouse interface
const GuestHouseRoom = sequelize.define<Model<GuestHouseRoomAttributes>>(
  "GuestHouseRoom",
  {
    guesthouse_room_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    guesthouse_id: { type: DataTypes.INTEGER },
    guesthouse_room_description: { type: DataTypes.STRING },
    guesthouse_room_number: { type: DataTypes.STRING },
    guesthouse_room_booking_fee: { type: DataTypes.INTEGER },
    guesthouse_room_amount_per_night: { type: DataTypes.INTEGER },
    guesthouse_room_occupied_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    guesthouse_room_booking_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "guest_house_room",
  }
);

export default { GuestHouse, GuestHouseRoom };
