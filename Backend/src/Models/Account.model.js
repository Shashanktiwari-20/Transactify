const mongoose = require("mongoose");
const UserModel = require("./user.model");

const AccountSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "FROZEN", "CLOSED "],
            message: "status can be either ACTIVE, FROZEN, OR CLOSED"
        },
        default: "ACTIVE"
    },
    currency: {
        type: String,
        required: true,
        default: "INR"
    }
},{
    timestamps: true
})

AccountSchema.index({user: 1, status: 1})

const accountModel = mongoose.model("account",AccountSchema)

module.exports = accountModel;