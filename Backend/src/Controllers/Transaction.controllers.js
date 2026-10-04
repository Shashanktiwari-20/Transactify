const mongoose = require("mongoose");
const TransactionModel = require("../Models/transaction.model");
const LedgerModel = require("../Models/ledger.model");
const AccountModel = require("../Models/Account.model");
const { transactionEmail } = require("../Services/email.services");

const createTransaction = async (req, res) => {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "fromAccount, toAccount, amount, and idempotencyKey are required"
    });
  }

  const fromAccountId = fromAccount._id || fromAccount;
  const toAccountId = toAccount._id || toAccount;

  if (fromAccountId.toString() === toAccountId.toString()) {
    return res.status(400).json({
      message: "Sender and recipient accounts cannot be the same"
    });
  }

  const fromUserAccount = await AccountModel.findById(fromAccountId);
  const toUserAccount = await AccountModel.findById(toAccountId);

  if (!fromUserAccount || !toUserAccount) {
    return res.status(404).json({
      message: "fromAccount or toAccount not found"
    });
  }

  const existingTransaction = await TransactionModel.findOne({ idempotencyKey });
  if (existingTransaction) {
    return res.status(200).json({
      message: `Transaction is already ${existingTransaction.status.toLowerCase()}`,
      transaction: existingTransaction
    });
  }

  if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
    return res.status(400).json({
      message: "Both accounts must be ACTIVE to perform a transaction"
    });
  }

  const currentBalance = await fromUserAccount.getBalance();
  const transferAmount = Number(amount);

  if (currentBalance < transferAmount) {
    return res.status(400).json({
      message: `Insufficient balance in fromAccount. Current balance is ${currentBalance}. Requested amount is ${transferAmount}`
    });
  }

  const session = await mongoose.startSession();
  let transaction;

  try {
    session.startTransaction();

    const [createdTx] = await TransactionModel.create(
      [
        {
          fromAccount: fromUserAccount._id,
          toAccount: toUserAccount._id,
          amount: transferAmount,
          idempotencyKey,
          status: "PENDING"
        }
      ],
      { session, ordered: true }
    );
    transaction = createdTx;

    await LedgerModel.create(
      [
        {
          account: fromUserAccount._id,
          amount: transferAmount,
          transaction: transaction._id,
          type: "DEBIT"
        },
        {
          account: toUserAccount._id,
          amount: transferAmount,
          transaction: transaction._id,
          type: "CREDIT"
        }
      ],
      { session, ordered: true }
    );

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();
    
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({
      message: error.message
    });
  } finally {
    session.endSession();
  }

  if (req.user?.email) {
    await transactionEmail(req.user.email,req.user.name,transferAmount,fromUserAccount._id,toUserAccount._id).catch(console.error);
  }

  return res.status(201).json({
    message: "Transaction completed successfully",
    transaction
  });
};

const createInitialFundsTransaction = async (req, res) => {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "toAccount, amount, and idempotencyKey are required"
    });
  }

  const toAccountId = toAccount._id || toAccount;

  const toUserAccount = await AccountModel.findById(toAccountId);
  if (!toUserAccount) {
    return res.status(404).json({
      message: "toAccount not found"
    });
  }

  const fromUserAccount = await AccountModel.findOne({ user: req.user._id });
  if (!fromUserAccount) {
    return res.status(404).json({
      message: "System user account not found"
    });
  }

  const existingTransaction = await TransactionModel.findOne({ idempotencyKey });
  if (existingTransaction) {
    return res.status(200).json({
      message: `Transaction is already ${existingTransaction.status.toLowerCase()}`,
      transaction: existingTransaction
    });
  }

  const session = await mongoose.startSession();
  let transaction;

  try {
    session.startTransaction();

    const transferAmount = Number(amount);

    const [createdTx] = await TransactionModel.create(
      [
        {
          fromAccount: fromUserAccount._id,
          toAccount: toUserAccount._id,
          amount: transferAmount,
          idempotencyKey,
          status: "PENDING"
        }
      ],
      { session, ordered: true }
    );
    transaction = createdTx;

    await LedgerModel.create(
      [
        {
          account: fromUserAccount._id,
          amount: transferAmount,
          transaction: transaction._id,
          type: "DEBIT"
        },
        {
          account: toUserAccount._id,
          amount: transferAmount,
          transaction: transaction._id,
          type: "CREDIT"
        }
      ],
      { session, ordered: true }
    );

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();

    return res.status(201).json({
      message: "Initial funds transaction completed successfully",
      transaction
    });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({
      message: error.message
    });
  } finally {
    session.endSession();
  }
};

module.exports = {createTransaction,createInitialFundsTransaction};