import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "mysql",
  dialectModule: require("mysql2"),
  host: "localhost",
  database: "v2lyte",
  username: "root",
  password: "",
});

export interface ResultObj {
  result?: any;
  status: boolean;
  reason: string;
}

export default sequelize;
