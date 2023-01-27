import { NextFunction, Request, Response } from "express";
import {
  fundOps,
  transferOps,
  withdrawOps,
} from "./../services/account.service";
import { StatusCodes } from "http-status-codes";

export const fundAccount = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId;
    const { transaction_token, amount } = req.body;

    if (!transaction_token || !amount) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "token and amount can not be empty" })
    }

    const fundOpsResponse = await fundOps(userId, transaction_token, amount);

    if (fundOpsResponse.success === false) {
      return res
        .status(fundOpsResponse.data.status)
        .json(fundOpsResponse.data.msg);
    }

    return res.status(fundOpsResponse.data.status).json({
      success: true,
      msg: fundOpsResponse.data.msg,
      account_balance: fundOpsResponse.data.balance,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json("an error occured");
  }
};

export const transferFund = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId;
    const { transaction_token, receiver_account_number, amount } = req.body;

    if (!transaction_token || !receiver_account_number || !amount) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "token, receipient account number and amount can not be empty" });
    }

    const transferOpsResponse = await transferOps(
      receiver_account_number,
      userId,
      transaction_token,
      amount
    );

    if (transferOpsResponse.success === false) {
      return res
        .status(transferOpsResponse.data.status)
        .json(transferOpsResponse.data.msg);
    }

    return res.status(transferOpsResponse.data.status).json({
      success: true,
      msg: transferOpsResponse.data.msg,
      account_balance: transferOpsResponse.data.current_balance,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json("an error occured");
  }
};

export const withdrawFund = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId;
    const { transaction_token, amount } = req.body;

    if (!transaction_token || !amount) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({
          msg: "token, receipient account number and amount can not be empty",
        });
    }

    const withdrawOpsResponse = await withdrawOps(
      userId,
      transaction_token,
      amount
    );

    if (withdrawOpsResponse.success === false) {
      return res
        .status(withdrawOpsResponse.data.status)
        .json(withdrawOpsResponse.data.msg);
    }

    return res.status(withdrawOpsResponse.data.status).json({
      success: true,
      msg: withdrawOpsResponse.data.msg,
      account_balance: withdrawOpsResponse.data.balance,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json("an error occured");
  }
};


// case1: 114527 || 2620848570
// case2: 883205 || 6577856575
