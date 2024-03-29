import { Sequelize, Dialect, DataTypes, Optional, ModelDefined } from "sequelize";

const database = process.env.DB_NAME!
const username= process.env.DB_USERNAME!;
const password = process.env.DB_PASSWORD!;
const host = process.env.DB_HOST!;
const dialect = process.env.DB_VENDOR as Dialect


const sequelize = new Sequelize(database, username, password, {
  host,
  dialect: "mysql"
});

export { sequelize, DataTypes, Optional, ModelDefined };