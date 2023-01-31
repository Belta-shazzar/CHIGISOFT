import express from "express";
import { validateUser } from "../../middleware/user.input.validation"
import { signUp, login } from "../../controllers/auth.controller";

const route = express.Router();

route.post("/sign-up", validateUser, signUp)
route.post("/sign-in", login)

export default route;

