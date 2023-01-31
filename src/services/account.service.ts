import { Account } from "../entities/account.entity";
import { TransactionType } from "../types/types";
import { transactionRecord } from "./transaction.details.service";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";

export const generateAccountNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000);
};

export const encryptToken = async (transactionToken: string) => {
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_GENSALT!));
  return (transactionToken = await bcrypt.hash(transactionToken, salt));
};

export const createAccount = async (userId: number, userName: string) => {
  try {
    let accountNumber = (await generateAccountNumber()).toString();
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const encryptedToken = await encryptToken(token);
    let account = await Account.findOne({
      where: { account_number: accountNumber },
    });

    if (account) {
      accountNumber = generateAccountNumber().toString();
    }

    account = await Account.create({
      user_id: userId,
      account_number: accountNumber,
      account_name: userName,
      transaction_token: encryptedToken,
    });

    const accountBalance = account.get("balance") as number;

    return {
      success: true,
      data: { token, accountNumber, accountBalance },
    };
  } catch (error) {
    return {
      success: false,
      data: {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        msg: "an error occured",
      },
    };
    //   Add @transaction
  }
};

//  checkIfAccountExists

export const fundOps = async (
  userId: number,
  transactionToken: string,
  amount: number
) => {
  try {
    let account = await Account.findOne({
      where: { user_id: userId },
    });

    if (!account) {
      return {
        success: false,
        data: { status: StatusCodes.NOT_FOUND, msg: "resource not found" },
      };
    }

    const verifyToken = await bcrypt.compare(
      transactionToken,
      account.get("transaction_token") as string
    );

    if (!verifyToken) {
      return {
        success: false,
        data: {
          status: StatusCodes.BAD_REQUEST,
          msg: "Invalid transaction token",
        },
      };
    }

    let balance = (account.get("balance") as number) + amount;

    account.set({ balance: balance }).save();

    // Transaction deets
    await transactionRecord(
      account.get("account_number") as string,
      null,
      TransactionType.Fund,
      amount,
      true
    );
    return {
      success: true,
      data: {
        status: StatusCodes.ACCEPTED,
        msg: "transaction successful",
        balance: balance,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        msg: "an error occured",
      },
    };
  }
};

export const transferOps = async (
  receiverAccountNumber: string,
  userId: number,
  transactionToken: string,
  amount: number
) => {
  try {
    let senderAccount = await Account.findOne({
      where: { user_id: userId },
    });

    let receiverAccount = await Account.findOne({
      where: { account_number: receiverAccountNumber },
    });

    if (!receiverAccount || !senderAccount) {
      return {
        success: false,
        data: { status: StatusCodes.NOT_FOUND, msg: "resource not found" },
      };
    }

    const verifyToken = await bcrypt.compare(
      transactionToken,
      senderAccount.get("transaction_token") as string
    );

    if (!verifyToken) {
      return {
        success: false,
        data: {
          status: StatusCodes.BAD_REQUEST,
          msg: "Invalid transaction token",
        },
      };
    }

    let senderBalance = senderAccount.get("balance") as number;
    let receiverBalance = receiverAccount.get("balance") as number;

    if (senderBalance < amount) {
      return {
        success: false,
        data: { status: StatusCodes.OK, msg: "insufficient funds" },
      };
    } else {
      senderAccount.set({ balance: senderBalance - amount }).save();
      receiverAccount.set({ balance: receiverBalance + amount }).save();
    }

    // Transaction deets
    await transactionRecord(
      senderAccount.get("account_number") as string,
      receiverAccount.get("account_number") as string,
      TransactionType.Transfer,
      amount,
      true
    );

    return {
      success: true,
      data: {
        status: StatusCodes.OK,
        msg: "transaction successful",
        current_balance: senderAccount.get("balance"),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        msg: "an error occured",
      },
    };
  }
};

export const withdrawOps = async (
  userId: number,
  transactionToken: string,
  amount: number
) => {
  let account = await Account.findOne({
    where: { user_id: userId },
  });

  if (!account) {
    return {
      success: false,
      data: { status: StatusCodes.NOT_FOUND, msg: "resource not found" },
    };
  }

  const verifyToken = await bcrypt.compare(
    transactionToken,
    account.get("transaction_token") as string
  );

  if (!verifyToken) {
    return {
      success: false,
      data: {
        status: StatusCodes.BAD_REQUEST,
        msg: "Invalid transaction token",
      },
    };
  }

  let balance = account.get("balance") as number;

  if (balance < amount) {
    return {
      success: false,
      data: { status: StatusCodes.OK, msg: "insufficient funds" },
    };
  }

  account.set({ balance: balance - amount }).save();

  // Transaction deets
  await transactionRecord(
    account.get("account_number") as string,
    null,
    TransactionType.Withdraw,
    amount,
    true
  );
  return {
    success: true,
    data: {
      status: StatusCodes.OK,
      msg: `withdrawal of ${amount}, successful`,
      balance: account.get("balance"),
    },
  };
};
// 418945;
