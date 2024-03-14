import { Model, DataTypes } from "sequelize";
import sequelize from "../../../lib/index";

// Interface for the Manager model
export interface ManagerAttributes extends Model {
  owner_id: number;
  first_name: string;
  surname: string;
  email: string;
  phone: string;
  auth: string;
  refreshtoken: string;
  manager_type: "Landlord" | "Manager";
  confirmed: boolean;
}

// Define the Manager model using the interface
const Manager = sequelize.define<ManagerAttributes>(
  "Manager",
  {
    owner_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    first_name: { type: DataTypes.STRING },
    surname: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    auth: { type: DataTypes.STRING },
    manager_type: {
      type: DataTypes.ENUM("Landlord", "Manager"),
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    refreshtoken: { type: DataTypes.STRING, defaultValue: "NONE" },
  },
  { tableName: "manager" }
);

export default Manager;
