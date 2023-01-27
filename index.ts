import "dotenv/config";
import { app } from "./src/app";
import { sequelize } from "./src/config/db.config";
import { fundOps, createAccount } from "./src/services/account.service";

const PORT = process.env.APP_PORT || 5000;

const start = async () => {
  try {
    await sequelize.authenticate();
    app.listen(PORT, () => console.log(`Server started on port: ${PORT}...`));
    // createAccount(1, "Test Case1");
    // fundOps("7", 5000);
  } catch (error: any) {
    console.error(error);
  }
};

start();
