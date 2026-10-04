const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
    account : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "accounts",
        required : [true, "ledger must be associated with an account"],
        index : true,
        immutable : true
    },
    amount : {
        type : Number,
        required : [true, "ledger must have an amount"],
        immutable : true
    },
    transaction : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "transactions",
        required : [true, "ledger must be associated with a transaction"],
        index : true,
        immutable : true
    },
    type : {
        type : String,
        enum : {
            values : ["CREDIT", "DEBIT"],
            message : "ledger type must be either CREDIT or DEBIT"
        },
        required : [true, "ledger must have a type"],
        immutable : true
    }
})

const preventLedgerModification = () => {
    throw new Error("ledger entries are immutable and cannot be modified or deleted")
}

ledgerSchema.pre("findOneAndUpdate",preventLedgerModification);
ledgerSchema.pre("findOneAndDelete",preventLedgerModification);
ledgerSchema.pre("updateOne",preventLedgerModification);
ledgerSchema.pre("deleteOne",preventLedgerModification);
ledgerSchema.pre("updateMany",preventLedgerModification);
ledgerSchema.pre("deleteMany",preventLedgerModification);
ledgerSchema.pre("update",preventLedgerModification);
ledgerSchema.pre("delete",preventLedgerModification);
ledgerSchema.pre("remove",preventLedgerModification);
ledgerSchema.pre("findOneAndReplace",preventLedgerModification);

const ledgerModel = mongoose.model("ledgers",ledgerSchema);

module.exports = ledgerModel;