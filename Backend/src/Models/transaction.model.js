const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    fromAccount : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accounts",
        required: [true, "transaction must be associated with a from account"],
        index: true
    },
    toAccount : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "accounts",
        required: [true, "transaction must be associated with a to account"],
        index: true
    },
    status : {
        type : String,
        enum : {
            values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            message : "Status must be either PENDING, COMPLETED, FAILED or REVERSED"
        },
        default : "PENDING"
    },
    amount : {
        type: Number,
        required: [true, "transaction must have an amount"],
        min: [0.01,"transaction amount must be greater than zero"]
    },
    idempotencyKey: {
        type : String,
        required : [true,"idempotency key is required for creating a transaction"],
        index: true,
        unique: true
    }
},{
    timestamps: true
})

const transactionModel = mongoose.model("transactions",transactionSchema)

module.exports = transactionModel