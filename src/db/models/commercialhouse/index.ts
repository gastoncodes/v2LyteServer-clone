import { Model, DataTypes } from "sequelize";
import sequelize from "../../../lib/index";

// Interface for the CommercialHouse  model
interface CommercialHouseAttributes {
  property_id: Number;
  commercialhouse_id: Number;
  commercialhouse_name: String;
  short_description: String;
  long_description: String;
  owner_id: Number;
  confirmed: Boolean;
}
// Interface for the Commercial House Room model
interface CommercialHouseRoomAttributes {
  commercialhouse_id: Number;
  commercialhouse_room_id: Number;
  commercialhouse_room_description: String;
  commercialhouse_room_number: String;
  commercialhouse_room_booking_fee: Number;
  commercialhouse_room_amount_per_month: Number;
  commercialhouse_room_occupied_status: Boolean;
  commercialhouse_room_booking_status: Boolean;
}

//Commercial House model using the interface
const CommercialHouse = sequelize.define<Model<CommercialHouseAttributes>>(
  "CommercialHouse",
  {
    commercialhouse_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    property_id: { type: DataTypes.INTEGER },
    commercialhouse_name: { type: DataTypes.STRING },
    short_description: { type: DataTypes.STRING },
    long_description: { type: DataTypes.STRING },
    owner_id: { type: DataTypes.NUMBER },
    confirmed: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: "commercial_house" }
);

//CommercialHouseRoom model using commercialhouse interface
const CommercialHouseRoom = sequelize.define<
  Model<CommercialHouseRoomAttributes>
>(
  "CommercialHouseRoom",
  {
    commercialhouse_room_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    commercialhouse_id: { type: DataTypes.INTEGER },
    commercialhouse_room_description: { type: DataTypes.STRING },
    commercialhouse_room_number: { type: DataTypes.STRING },
    commercialhouse_room_booking_fee: { type: DataTypes.INTEGER },
    commercialhouse_room_amount_per_month: { type: DataTypes.INTEGER },
    commercialhouse_room_occupied_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    commercialhouse_room_booking_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "commercial_house_room",
  }
);

export default { CommercialHouse, CommercialHouseRoom };
