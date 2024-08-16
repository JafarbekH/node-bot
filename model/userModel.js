const mongoose = require("mongoose")

const userModel = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    firstName: String,
    userName: {
        type: String,
        default: null
    },
    userPrice: {
        type: Number,
        default: 0
    },
    userFrom: {
        type: String,
        default: null
    },
    isActiveUser: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('User', userModel)