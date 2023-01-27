import express from "express";
import authRoute from "./routes/auth.route"
import accountRoute from "./routes/account.route"

const route = express.Router();

route.use("/auth", authRoute)
route.use("/account", accountRoute);

export default route;

