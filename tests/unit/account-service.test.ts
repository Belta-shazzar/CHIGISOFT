import { generateNumber } from "../../src/services/account.service";
import { sequelize } from "../../src/config/db.config";

beforeEach(() => {
  sequelize
    .authenticate()
    .then((data) => console.log(`Connected`))
    .catch((error: any) => {
      console.log(error);
    });
});

describe("AuthService Test Suite", () => {
  describe("GenerateAccountNumber", () => {
    it("should generate an account number", () => {
      const data = generateNumber(9000000000);
      console.log("data");
      expect(data.toString().length).toEqual(10);
    }, 5000);
  });
});
