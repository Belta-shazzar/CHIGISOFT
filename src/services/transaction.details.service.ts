import { TransactionType } from "../types/types";
import { Transaction } from "../entities/transactions.entity";


export const transactionRecord = async (
  domainAccountNumber: string,
  receiverAccountNumber: any,
  transactionType: TransactionType,
  amount: number,
  transactionStatus: boolean
) => {
  try {
    await Transaction.create({
      domain_account_number: domainAccountNumber,
      receiver_account_number: receiverAccountNumber,
      transaction_type: transactionType,
      amount: amount,
      transaction_status: transactionStatus,
    });
  } catch (error) {
    console.error(error);
  }
};
