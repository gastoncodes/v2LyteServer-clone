import { Model, DataTypes } from "sequelize";
import sequelize from "../../../lib/index";

export interface v2Admin extends Model {
  admin_id: number;
  name: string;
  email: string;
  phone: string;
  auth: string;
  refreshtoken: string;
}

// admin schema

const Admin = sequelize.define<v2Admin>(
  "Admin",
  {
    admin_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    auth: { type: DataTypes.STRING },
    refreshtoken: { type: DataTypes.STRING },
  },
  {
    tableName: "admin",
  }
);

export default Admin;
