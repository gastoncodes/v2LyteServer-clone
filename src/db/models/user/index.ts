import { Model, DataTypes } from "sequelize";
import sequelize from "../../../lib/index";

// Extend v2User interface to include Sequelize's Model interface
export interface v2User extends Model {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  auth: string;
  refreshtoken: string;
}

// Define the user model
const User = sequelize.define<v2User>(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    auth: { type: DataTypes.STRING },
    refreshtoken: { type: DataTypes.STRING, defaultValue: "N/A" },
  },
  {
    tableName: "user",
  }
);

export default User;
