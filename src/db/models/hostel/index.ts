import { Model, DataTypes } from "sequelize";
import sequelize from "../../../lib/index";

// Interface for the Hostel  model
export interface HostelAttributes extends Model {
  hostel_id: number;
  property_id: number;
  hostel_name: string;
  short_description: string;
  long_description: string;
  owner_id: number;
  confirmed: boolean;
}
// Interface for the Hostel Room model
export interface HostelRoomAttributes extends Model {
  hostel_id: number;
  hostel_room_id: number;
  hostel_room_description: string;
  hostel_room_number: string;
  hostel_room_booking_fee: number;
  hostel_room_amount_semister: number;
  hostel_room_occupied_status: boolean;
  hostel_room_booking_status: boolean;
}

//Hostel model using the interface
export const Hostel = sequelize.define<HostelAttributes>(
  "Hostel",
  {
    hostel_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    property_id: { type: DataTypes.INTEGER },
    hostel_name: { type: DataTypes.STRING },
    short_description: { type: DataTypes.STRING },
    long_description: { type: DataTypes.STRING },
    owner_id: { type: DataTypes.NUMBER },
    confirmed: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: "hostel" }
);

//Hostel Room model using hostel room interface
export const HostelRoom = sequelize.define<HostelRoomAttributes>(
  "HostelRoom",
  {
    hostel_room_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    hostel_id: { type: DataTypes.INTEGER },
    hostel_room_description: { type: DataTypes.STRING },
    hostel_room_number: { type: DataTypes.STRING },
    hostel_room_booking_fee: { type: DataTypes.INTEGER },
    hostel_room_amount_semister: { type: DataTypes.INTEGER },
    hostel_room_occupied_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hostel_room_booking_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "hostel_room",
  }
);
