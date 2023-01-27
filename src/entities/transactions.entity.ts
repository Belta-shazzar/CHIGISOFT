import { ITransaction } from "./../types/types";
import { sequelize, DataTypes } from "../config/db.config";

const Transaction = sequelize.define(
  "Transaction",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    domain_account_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiver_account_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transaction_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transaction_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    // Other model options go here
    timestamps: true,
  }
);

Transaction.sync();
// `sequelize.define` also returns the model
export { Transaction }; //=== sequelize.models.Transaction); // true
