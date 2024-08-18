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
    userOlmos: {
        type: Number,
        default: 2
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
    },
    son: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('User', userModel)