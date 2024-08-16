const { bot } = require("./bot");
const Channels = require('../model/channelModel')


const checkSubscriptions = async (msg) => {
    const results = [];
    let channelIds = []
    // let channelsUrl = []

    const channels = await Channels.find()

    // console.log(channels);    

    channels.map((channel) => {
        // console.log(channel);
        channelIds.push(channel.channelId)
        // channelsUrl.push(channel.channelUrl)
    })

    for (const channelId of channelIds) {
        try {
            const chatMember = await bot.getChatMember(channelId, msg.from.id);
            const status = chatMember.status;
            if (status === 'member' || status === 'administrator' || status === 'creator') {
                results.push({ channelId, subscribed: true });
            } else {
                results.push({ channelId, subscribed: false });
            }
        } catch (error) {
            console.error(`Error while checking subscription for ${channelId}:`, error);
            results.push({ channelId, subscribed: false });
        }
    }

    return results;
}

module.exports = {
    checkSubscriptions
}


