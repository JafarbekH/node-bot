const mongoose = require('mongoose')

const channelModel = new mongoose.Schema({
    channelName: String,
    channelId: String,
    channelUrl: String
})

module.exports = mongoose.model('Channels', channelModel)