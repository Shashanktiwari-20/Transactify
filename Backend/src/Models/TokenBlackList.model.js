const mongoose = require("mongoose");

const TokenBlackListSchema = new mongoose.Schema({
    token : {
        type : String,
        required : [true, "token required for blacklisting"],
        unique : [true, "token is already blacklisted"]
    }
},{
    timestamps: true
})

// Entries are removed automatically after 7 days (the refresh token lifetime)
TokenBlackListSchema.index({createdAt: 1},{
    expireAfterSeconds : 7*24*60*60
})

const tokenBlackListModel = mongoose.model("tokenBlackList",TokenBlackListSchema);

module.exports = tokenBlackListModel;