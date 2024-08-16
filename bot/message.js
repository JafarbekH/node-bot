const { bot } = require("./bot");
const { startKeyboard } = require("./keyboard/keyboard");
const { checkSubscriptions } = require("./testcheckUser");
const Channels = require('../model/channelModel')
const User = require('../model/userModel');





bot.onText(/\/start(.*)/, async (msg, match) => {
    const userId = msg.from.id

    const startParam = match[1].trim();
    try {
        const newUser = await User({
            userId: msg.from.id,
            firstName: msg.from.first_name,
            userName: msg.from.username,
            userFrom: startParam.length == 0 ? msg.from.id : startParam 
        })
        await newUser.save()
    } catch (error) {} 

    const subscriptionResults = await checkSubscriptions(msg)
    const notSubscribedChannels = subscriptionResults.filter(result => !result.subscribed)

    let user = await User.findOne({userId: userId})

    if(notSubscribedChannels.length === 0) {
        if(user.isActiveUser === true) {
            
            let user = await User.findOne({userId}).lean()
            user.isActiveUser = false
            await User.findByIdAndUpdate(user._id, user, {new: true})

            let addUserPrice = await User.findOne({userId: user.userFrom}).lean()
            addUserPrice.userPrice += 1
            await User.findByIdAndUpdate(addUserPrice._id, addUserPrice, {new: true})

            bot.sendMessage(userId, `Assalomu alaykum <b><a href="tg://user?id=${msg.from.id}">${msg.from.first_name}</a></b>\n\nPul ishlash uchun pastdagi tugma orqali havolangizni oling va do'stlaringizni taklif qiling! Har bir do'stingiz uchun 500 so'm miqdoridagi pul balansingizga qo'shiladi.\n\n<b>📝Shartlar</b> tugmachasini tanlash orqali to'liq tanishib chiqishingiz mumkin!`, {parse_mode: 'HTML', reply_markup: startKeyboard})
            
            bot.sendMessage(user.userFrom, `Sizda yangi do'st bor <b>+500 so'm\n\nJami balansingiz: ${addUserPrice.userPrice * 500} so'm💰</b>`, {parse_mode: 'HTML'})
        } else {
            bot.sendMessage(userId, `Assalomu alaykum <b><a href="tg://user?id=${msg.from.id}">${msg.from.first_name}</a></b>\n\nPul ishlash uchun pastdagi tugma orqali havolangizni oling va do'stlaringizni taklif qiling! Har bir do'stingiz uchun 500 so'm miqdoridagi pul balansingizga qo'shiladi.\n\n<b>📝Shartlar</b> tugmachasini tanlash orqali to'liq tanishib chiqishingiz mumkin!`, {parse_mode: 'HTML', reply_markup: startKeyboard})
        }
        
    } else {
        let channelsUrl = []
        let channelIds = []
        const channels = await Channels.find()

        

        channels.map((channel) => {
            channelIds.push(channel.channelId)
            channelsUrl.push(channel.channelUrl)
        })
        let message = 'Botdan foydalanish uchun quyidagi kanallarga obuna bo\'lib <b>/start</b> bosing!\n';
        let inlinKeyboard = []
        notSubscribedChannels.forEach(result => {
            inlinKeyboard.push([
                {
                    text: "Obuna bo'lish",
                    url: `${channelsUrl[channelIds.indexOf(result.channelId)]}`
                }
            ])
        });
        const options = {parse_mode: 'HTML' ,reply_markup: {inline_keyboard: inlinKeyboard}};
        bot.sendMessage(userId, message, options);
    }
    
});





bot.on('message', async (msg) => {

    const userId = msg.from.id

    const subscriptionResults = await checkSubscriptions(msg)
    const notSubscribedChannels = subscriptionResults.filter(result => !result.subscribed)

    if(notSubscribedChannels.length === 0) {


        if(msg.text === '🖇Mening havolam') {
            bot.sendMessage(userId, `Ushbu havola orqali do'stlaringizni taklif qilib pul ishlang!\n\n${process.env.bot_name}?start=${userId}\n\nHar bir taklif qilgan do'stingiz uchun 500 so'm💷 miqdoridagi pulni qo'lga kiriting!`, {disable_web_page_preview: true, reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: 'Do\'stlarni taklif qilish',
                      switch_inline_query: userId
                    }
                  ]
                ]
              }
        })}



        if(msg.text === '💸Balans') {

            let user = await User.findOne({userId})

            bot.sendMessage(userId,`👤Ism: <b>${user.firstName}</b>\n\n🎁Balansingiz: <b>${user.userPrice * 500} so'm</b>`, {parse_mode: 'HTML', reply_markup: {
                inline_keyboard: [
                  [
                    {
                        text: 'Isbot Kanal✅',
                        url: 'https://t.me/Pultopproisbot' // URL manzili
                    }
                  ]
                ]
        }})}
        

        if(msg.text === '💴Pulni Yechish') {

            let user = await User.findOne({userId})

            bot.sendMessage(userId, `🤝Xurmatli <b><a href="tg://user?id=${msg.from.id}">${msg.from.first_name}</a></b>\n\n📌Pullaringizni yechib olish uchun xisobingizda <b>kamida 5600 so'm</b> miqdoridagi pul mavjud bo'lishi kerak, aks holda adminga murojaat qilsangiz pullaringizni olomaysiz!\n\nPullaringiz Mobil Raqamingizga Paynet yoki Uzkard raqamingizga tushirib olishingiz mumkun✔️\n\n\n✅Sizda mavjud:  <b>${user.userPrice * 500} so'm</b>`, {parse_mode: 'HTML', reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: 'Adminga yozish✍️',
                      url: 'https://t.me/Pultoppro' // URL manzili
                    }
                  ],
                  [
                    {
                        text: 'Isbot Kanal✅',
                        url: 'https://t.me/Pultopproisbot' // URL manzili
                    }
                  ]
                ]
              }})
        }


        
        if(msg.text == '📝Shartlar') {
            bot.sendMessage(userId, `<b>👉Halollik foydadan ustun</b>\nSizga berilayotgan pullar homiy kanallarimiz tomonidan moliyalashtiriladi!\n\n📝Shartlar juda oddiy, bizning homiy kanallarga a'zo bo'lgan bo'lsangiz <b>🖇Mening havolam</b> tugmasi orqali o'z havolangizni olib do'slaringizni taklif qilish orqali har bir taklif qilgan do'stingiz uchun sizga 500 so'm miqdoridagi pul qo'shiladi.Balansingiz 5600 so'm yoki undan ko'proq bo'lsihi bilan adminga murojaat qilib pulingizni yechib olishingiz mumkin!\n\n<b>❗️Eslatma</b>: Hisobingiz 5600 so'mga yetmay turib adminga yozib vaqtni olsangiz yoki aldashga urinsangiz qora ro'yhatga tushasiz va tanlovdan chetlashtirilasiz!\n\n<b>💴Pulni Yechish</b> tugmasini tanlash orqali pulingizni yechib olishingiz mumkin.`, {parse_mode: 'HTML', reply_markup: {
                inline_keyboard: [
                  [
                    {
                        text: 'Isbot Kanal✅',
                        url: 'https://t.me/Pultopproisbot' // URL manzili
                    }
                  ]
                ]
              }})
        }

        // else {
        //     console.log(msg.text);
        // }

    } else {
        if(msg.text !== '/start') {
            try {
                const newUser = await User({
                    userId: userId,
                    firstName: msg.from.first_name,
                    userName: msg.from.username,
                })
                await newUser.save()
            } catch (error) {
                
            }
    
            let channelsUrl = []
            let channelIds = []
            const channels = await Channels.find()
    
            
    
            channels.map((channel) => {
                channelIds.push(channel.channelId)
                channelsUrl.push(channel.channelUrl)
            })
            let message = 'Botdan foydalanish uchun quyidagi kanallarga obuna bo\'lib <b>/start</b> bosing!\n';
            let inlinKeyboard = []
            notSubscribedChannels.forEach(result => {
                inlinKeyboard.push([
                    {
                        text: "Obuna bo'lish",
                        url: `${channelsUrl[channelIds.indexOf(result.channelId)]}`
                    }
                ])
            });
            const options = {parse_mode: 'HTML' ,reply_markup: {inline_keyboard: inlinKeyboard}};
            bot.sendMessage(userId, message, options);
        }
    }
})







// inline savolga javob
bot.on('inline_query', (inlineQuery) => {
    const query = inlineQuery.query; // Foydalanuvchining so'rovi
  
    // Inline natijalar yaratish
    const results = [
      {
        type: 'article',
        id: '1', // Unikal identifikator
        title: 'Do\'stlarga ulashish uchun bosing:✅',
        input_message_content: {
          message_text: `👋Pul ishlashni hoxlaysizmi?!\n\n🤖Sizni pul to'laydigan botga taklif qilaman!\n\n${process.env.bot_name}?start=${inlineQuery.from.id}` // Foydalanuvchi yuborgan matn
        }
      }
    ];
  
    // Inline natijalarni foydalanuvchiga yuborish
    bot.answerInlineQuery(inlineQuery.id, results);
});


//to'langan summa haqida ma'lumot
bot.onText(/\/pay (.+)/, async (msg, match) => {
    const userId = msg.from.id
    const resp = match[1];
    let user = await User.findOne({ userId: resp })

    
    if(userId === 1477817763) {
        bot.sendMessage(-1002186291781, `👤User: <b>${user.firstName}</b>\n💰Summa: <b>${user.userPrice * 500} so'm\n\n✅To'lab berildi</b>`, {parse_mode: 'HTML'})
        .then(() => {})
        .catch();
    }

    user.userPrice = 0 
    await User.findByIdAndUpdate(user._id, user, {new: true})

    bot.sendMessage(1477817763, "Muvaffaqiyatli o'zgartirildi")
})



// Kanal qo'shish
bot.onText(/\/add_channel (.+)/, async (msg, match) => {
    const userId = msg.from.id
    const resp = match[1];

    const newChannel = new Channels({
        channelName: resp.split(' ')[0],
        channelId: resp.split(' ')[1],
        channelUrl: resp.split(' ')[2]
    });

    if(userId == 1477817763) {  
        try {
            await newChannel.save();
            await bot.sendMessage(userId, "Muvaffqiyatli saqlandi");

        } catch (err) {
            console.error('Kanalni saqlashda xatolik:', err);
        }
    } else {
        bot.sendMessage(userId, 'Sen admin emassan sur bottan')
    }
});

// kanalni o'chirish
bot.onText(/\/del_channel (.+)/, async (msg, match) => {
    const userId = msg.from.id
    const resp = match[1];

    if(userId == 1477817763) {
        const deleteChannel = await Channels.findOneAndDelete({channelId: resp})
        if(deleteChannel) {
            bot.sendMessage(userId, "Muvaffaqiyatli o'chirilid")
        } else {
            bot.sendMessage(userId, "Xatolik yuz berdi qaytadan urinib ko'ring")
        }
    } else {
        bot.sendMessage(userId, 'Sen admin emassan sur bottan')
    }
    
    // console.log(resp);
})


//kanalga reklama yuborish 
bot.onText(/\/send_reklama (.+)/, async (msg, match) => {
    const userId = msg.from.id
    const message = match[1];
    let countSend = 0

    if(userId === 1477817763) {
        async function sendMessageWithDelay(userId, message, delay) {
            return new Promise(resolve => {
              setTimeout(async () => {
                try {
                  await bot.sendMessage(userId, message);
                  countSend += 1
                } catch (err) {
                  console.error(`Xatolik: ${err.message}`);
                }
                resolve();
              }, delay);
            });
          }
          
          // Barcha foydalanuvchilarga xabar yuborish
          async function sendMessageToAllUsers(message) {
            const users = await User.find();
            for (const user of users) {
              await sendMessageWithDelay(user.userId, message, 350); // 1000ms (1 soniya) kechiktirish
            }

            bot.sendMessage(1477817763, `Reklama yuborildi: ${countSend}`)
        }
        sendMessageToAllUsers(message);
    }
})