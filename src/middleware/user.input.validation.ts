const { check, validationResult } = require("express-validator");
import { NextFunction, Request, Response } from "express";
const { StatusCodes } = require("http-status-codes");

export const validateUser = [
  check("full_name")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("User name can not be empty!")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!")
    .bail(),
  check("email")
    .isEmail()
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Invalid email address!")
    .bail(),
  check("password")
    .isLength(8)
    .withMessage("Password must be at least 8 characters long!"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("What i ordered")
      console.log(errors)
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ msg: errors.array() });
    }
    next();
  },
];
