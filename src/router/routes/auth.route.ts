import express from "express";
import { signUp, login } from "../../controllers/auth.controller";

const route = express.Router();

route.post("/sign-up", signUp)
route.post("/sign-in", login)

export default route;

