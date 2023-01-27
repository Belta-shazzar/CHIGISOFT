import {
  sequelize,
  DataTypes,
  Optional,
  ModelDefined,
} from "../config/db.config";
import { IUser } from "../types/types";

type UserCreationAttributes = Optional<IUser, "id" >;

const User: ModelDefined<IUser, UserCreationAttributes> = sequelize.define(
  "User",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        // same as above, but constructing the RegExp from a string
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }
);

User.sync();
// `sequelize.define` also returns the model
export { User }; //=== sequelize.models.User); // true
