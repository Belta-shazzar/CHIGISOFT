import jwt, { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface IUser {
  readonly id: number;
  full_name: string;
  email?: string;
  password: string;
}

export interface IAccount {
  readonly id: number;
  readonly user_id: number;
  readonly account_number: string;
  account_name: string;
  balance: number;
  transaction_token: string;
}

export const enum TransactionType {
  Fund,
  Withdraw,
  Transfer,
}

export interface ITransaction {
  readonly id: number;
  readonly domain_account_number: string;
  readonly receiver__account_number: string;
  readonly transaction_type: TransactionType;
  readonly amount: number;
  readonly transaction_status: boolean;
}

export interface CustomRequest extends Request {
  user: string | JwtPayload;
}

// const handleMouseAction = (action: MouseAction) => {
//   switch (action) {
//     case MouseAction.MouseDown:
//       console.log("Mouse Down");
//       break;
//   }
// };
