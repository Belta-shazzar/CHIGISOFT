import { NextFunction, Request, Response } from "express";
import { User } from "../entities/user.entity";
import { StatusCodes } from "http-status-codes";
import { createJWT } from "../middleware/jwt.setup";
import { createAccount } from "../services/account.service";

import bcrypt from "bcryptjs";

export const encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_GENSALT!));
  return (password = await bcrypt.hash(password, salt));
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let user = await User.findOne({ where: { email: req.body.email } });

    if (user) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ success: false, msg: `${req.body.email} already exist` });
    }

    const password = await encryptPassword(req.body.password);

    user = await User.create({ ...req.body });

    user.set({ password: password }).save();

    const userId = user.get("id") as number;
    const userName = user.get("full_name") as string;

    const jwt = createJWT(userId, userName);

    const crResponse = await createAccount(userId, userName);
    if (crResponse.success === false) {
      return res
        .status(crResponse.data.status as number)
        .json(crResponse.data.msg);
    }

    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: {
        full_name: userName,
        transaction_Token: crResponse.data.token,
        account_number: crResponse.data.accountNumber,
        account_balance: crResponse.data.accountBalance,
      },
      jwt,
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "email and password field cannot be empty",
      });
    }

    let user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "user not signed in" });
    }

    const verifyPassword = await bcrypt.compare(
      password,
      user.get("password") as string
    );

    if (!verifyPassword) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "incorrect password" });
    }

    const userId = user.get("id") as number;
    const userName = user.get("full_name") as string;

    const jwt = createJWT(userId, userName);

    return res
      .status(StatusCodes.OK)
      .json({ success: true, data: { userName }, jwt });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};
