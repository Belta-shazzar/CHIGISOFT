import express from "express";
import {
  fundAccount,
  transferFund,
  withdrawFund,
} from "../../controllers/account.controller";
import { JWTAuth } from "../../middleware/jwt.setup";

const route = express.Router();

route.patch("/fund-account", JWTAuth, fundAccount);
route.post("/transfer-fund", JWTAuth, transferFund);
route.get("/withdraw-fund", JWTAuth, withdrawFund);

export default route;
