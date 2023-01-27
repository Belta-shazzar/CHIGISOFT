import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import express, { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomRequest } from "../types/types";

const secretKey: Secret = process.env.JWT_SECRET!;

// export interface CustomRequest extends Request {
//   user: string | JwtPayload;
// }

export const createJWT = (userId: number, userFullName: string) => {
  return jwt.sign(
    { userId: userId.toString(), name: userFullName },
    secretKey,
    {
      expiresIn: process.env.JWT_LIFETIME!,
    }
  );
};

export const JWTAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new Error("Authenticaion Invalid");
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, secretKey);
    (req as CustomRequest).user = payload;
    next();
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: "Authenticaion Invalid" });
  }
};
