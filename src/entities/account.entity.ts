import {
  sequelize,
  DataTypes,
  Optional,
  ModelDefined,
} from "../config/db.config";
import { IAccount } from "../types/types";

type AccountCreationAttributes = Optional<IAccount, "id" | "balance">;

const Account: ModelDefined<IAccount, AccountCreationAttributes> =
  sequelize.define(
    "Account",
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      account_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      account_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      transaction_token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      // Other model options go here
      timestamps: true,
    }
  );

Account.sync();

// `sequelize.define` also returns the model
export { Account }; //=== sequelize.models.Account); // true
