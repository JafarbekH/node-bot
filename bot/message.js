const { bot } = require("./bot");
const { startKeyboard, oylanganSon } = require("./keyboard/keyboard");
const { checkSubscriptions } = require("./testcheckUser");
const Channels = require('../model/channelModel')
const User = require('../model/userModel');



bot.setMyCommands([
    { command: '/start', description: 'Botni ishga tushirish🚀' }
])



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

            let addUserOlmos = await User.findOne({userId: user.userFrom}).lean()
            addUserOlmos.userOlmos += 1
            await User.findByIdAndUpdate(addUserOlmos._id, addUserOlmos, {new: true})

            bot.sendMessage(userId, `Assalomu alaykum <b><a href="tg://user?id=${msg.from.id}">${msg.from.first_name}</a></b>\n\nBot o'ylagan sonni topgan har bir to'g'ri javobingiz uchun 500 so'm miqdoridagi pul balansingizga qo'shiladi.\n\n<b>📝Shartlar</b> tugmachasini tanlash orqali to'liq tanishib chiqishingiz mumkin!`, {parse_mode: 'HTML', reply_markup: startKeyboard})
            
            bot.sendMessage(user.userFrom, `Sizda yangi do'st bor <b>➕1💎Olmos</b>\n\nJami olmoslaringiz: <b>💎${addUserOlmos.userOlmos} ta</b>`, {parse_mode: 'HTML'})
        } else {
            bot.sendMessage(userId, `Assalomu alaykum <b><a href="tg://user?id=${msg.from.id}">${msg.from.first_name}</a></b>\n\nBot o'ylagan sonni topgan har bir to'g'ri javobingiz uchun 500 so'm miqdoridagi pul balansingizga qo'shiladi.\n\n<b>📝Shartlar</b> tugmachasini tanlash orqali to'liq tanishib chiqishingiz mumkin!`, {parse_mode: 'HTML', reply_markup: startKeyboard})
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
            bot.sendMessage(userId, `Ushbu havola orqali do'stlaringizni taklif qilib, har bir do'stingiz uchun <b>1💎</b> qo'lga kiritishing!\n\n${process.env.bot_name}?start=${userId}`, {disable_web_page_preview: true,parse_mode: 'HTML', reply_markup: {
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
                        url: 'https://t.me/+HmCIlKq_aNZmM2Uy' // URL manzili
                    },
                    {
                        text: 'Son Topganlar✅',
                        url: 'https://t.me/+u9N7uvFBZu04Zjky' // URL manzili
                    }
                  ],
                ]
        }})}


        if(msg.text === '💎Olmos') {

            let user = await User.findOne({userId})

            bot.sendMessage(userId,`👤Ism: <b>${user.firstName}</b>\n\n💎Olmoslar: <b>${user.userOlmos} ta</b>\n\nDo'stlaringizni taklif qilish orqali 💎Olmoslarni ko'paytirig!`, {parse_mode: 'HTML', reply_markup: {
                inline_keyboard: [
                  [
                    {
                        text: 'Isbot Kanal✅',
                        url: 'https://t.me/+HmCIlKq_aNZmM2Uy' // URL manzili
                    },
                    {
                        text: 'Son Topganlar✅',
                        url: 'https://t.me/+u9N7uvFBZu04Zjky' // URL manzili
                    }
                  ],
                  [
                    {
                      text: 'Do\'stlarni taklif qilish',
                      switch_inline_query: userId
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
                      url: 'https://t.me/BirSonOyladim_ADMIN' // URL manzili
                    },
                  ], 
                  [
                    {
                        text: 'Son Topganlar✅',
                        url: 'https://t.me/+u9N7uvFBZu04Zjky' // URL manzili
                    },
                    {
                        text: 'Isbot Kanal✅',
                        url: 'https://t.me/+HmCIlKq_aNZmM2Uy' // URL manzili
                    }
                  ]
                ]
              }})
        }


        
        if(msg.text == '📝Shartlar') {
            bot.sendMessage(userId, `<b>👉Halollik foydadan ustun</b>\n\nSizga berilayotgan pullar homiy kanallarimiz tomonidan moliyalashtiriladi!\n\n<b>📝Shartlar juda oddiy:</b>\n\n<b>🎲Bir Son O'yladim</b>  tugmasini bosing, bot 1 dan 10 gacha (1 va 10 ham kiradi) taqribiy bir sonni o'ylaydi, siz shu sonni topish uchun o'z o'ylagan soningizni yuborasiz.Siz topgan har bir to'g'ri javob uchun <b>xisobingizga 500 so'm</b> qo'shiladi.\n\n<b>💎Olmos</b> lar orqali siz o'yin o'ynab pul ishlaysiz.Bir urinish bu  bir olmos ➖💎 minus degani. 💎 olmos yig'ish uchun do'stlaringizni taklif qiling! Har bir do'stingiz uchun 💎 bir olmosni qo'lga kiritasiz bu degani yana bir pul ishlash uchun imkoniyat.\n\n<b>❗️Eslatma:</b> Hisobingiz 5600 so'mga yetmay turib adminga yozib vaqtni olsangiz yoki aldashga urinsangiz qora ro'yhatga tushasiz va tanlovdan chetlashtirilasiz!\n\n<b>💴Pulni Yechish</b> tugmasini tanlash orqali pulingizni yechib olishingiz mumkin.`, {parse_mode: 'HTML', reply_markup: {
                inline_keyboard: [
                  [
                    {
                        text: 'Isbot Kanal✅',
                        url: 'https://t.me/+HmCIlKq_aNZmM2Uy' // URL manzili
                    },
                    {
                        text: 'Son Topganlar✅',
                        url: 'https://t.me/+u9N7uvFBZu04Zjky' // URL manzili
                    }
                  ],
                    
                ]
              }})
        }



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



///**************  Asosiy bir son o'yladim qismi  ************************/
bot.on('message', async (msg) => {

    const userId = msg.from.id
    let user = await User.findOne({userId}).lean()


    if(user) {
        const subscriptionResults = await checkSubscriptions(msg)
    const notSubscribedChannels = subscriptionResults.filter(result => !result.subscribed)

    if(msg.text == "🎲Bir Son O'yladim" && notSubscribedChannels.length === 0 && user.userOlmos > 0) {
        
        const emojies = ["😁","🙂","😕","🫢","🫤","🤫",
                        "🫠","🙄","😜", "🧐","🥱","🤧",
                        "🤤","😬","🙄","👀","🙈","🙊",
                        "🙉","🫵","🫣","🥺","😎","😊"]

        let son = Math.floor(Math.random() * 10) + 1

        let userUpdateSon = await User.findOne({userId})
        userUpdateSon.userOlmos -= 1
        userUpdateSon.son = son
        await User.findByIdAndUpdate(userUpdateSon._id, userUpdateSon, {new: true})
                        
        bot.sendMessage(userId, `<b>10 dan 1 gacha bo'lgan son o'yladim, topingchi? </b>${emojies[Math.floor(Math.random() * emojies.length)]}` , {parse_mode: 'HTML', reply_markup: oylanganSon})

    } 
    else if (msg.text == "🎲Bir Son O'yladim" && user.userOlmos == 0) {
        bot.sendMessage(userId, `Sizda 💎olmoslar mavjud emas, olmos yig'ish uchun do'stlaringizni taklif qiling`, {reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Do\'stlarni taklif qilish',
                  switch_inline_query: userId
                }
              ]
            ]
          }})
    } 
    
    else if(msg.text == "🎲Bir Son O'yladim" && notSubscribedChannels.length !== 0) {
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



bot.on('callback_query', async (callbackQuery) => {
    let userId = callbackQuery.from.id

    let user = await User.findOne({userId})

    // const message = callbackQuery.message;
    const data = callbackQuery.data;
    const messageId = callbackQuery.message.message_id

    if(user.son == +data) {
        let userPriceUpdate = await User.findOne({userId})
        userPriceUpdate.userPrice += 1  
        await User.findByIdAndUpdate(userPriceUpdate._id, userPriceUpdate, {new: true})
    }
    // console.log(typeof data);
    // Tanlangan tugmaga qarab javob berish
    // bot.sendMessage(message.chat.id, `Siz ${data}-opsiyani tanladingiz.`);
    bot.deleteMessage(userId, messageId)
        .then(() => {
            // Xabar o'chirilgandan keyin foydalanuvchiga javob berish
            if(user.son == +data) {
                bot.sendMessage(userId, `✅Siz o'ylangan sonni topdingiz <b>+500 so'm</b>\n\n💰Jami balans: <b>${(user.userPrice + 1) * 500} so'm</b>`, {parse_mode: 'HTML', reply_markup: {
                    inline_keyboard: [
                      [
                        {
                            text: 'Son Topganlar✅',
                            url: 'https://t.me/+u9N7uvFBZu04Zjky' // URL manzili
                        }
                      ]
                    ]
                  }})

                bot.sendMessage(-1002166678305, `<b>✅O'ylagan sonni topdi!\n\n</b>👤User: <b>${user.firstName} </b>\n\n💰Qo'shildi: <b>+500 so'm</b>`, {parse_mode: 'HTML', reply_markup: {
                    inline_keyboard: [
                      [
                        {
                            text: 'O\'ynash uchun✅',
                            url: 'https://t.me/birson_bot' // URL manzili
                        }
                      ]
                    ]
                  }})
            
                .then(() => {})
                .catch();
            } else {
                bot.sendMessage(userId, `❌Afsuski men o'ylagan sonni topolmadingiz!`)
            }
            // bot.sendMessage(userId, `Xabar o'chirildi. Siz ${callbackQuery.data}-opsiyani tanladingiz.`);
        })
        .catch((error) => {
            console.error('Xabarni o‘chirishda xatolik yuz berdi:', error);
        });

    
    let userSonUpdate = await User.findOne({userId})
    userSonUpdate.son = 0 
    await User.findByIdAndUpdate(userSonUpdate._id, userSonUpdate, {new: true})
})




////////////////////////////////////////////////////////////////////////////




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
          message_text: `👋Pul ishlashni hoxlaysizmi?!\n\n🤖Sizni o'yin o'ynab pul ishlaydigan botga taklif qilaman!\n\n${process.env.bot_name}?start=${inlineQuery.from.id}` // Foydalanuvchi yuborgan matn
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

    
    if(userId === 1477817763 || userId === 6836007869) {
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

    if(userId === 1477817763 || userId === 6836007869) {  
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

    if(userId === 1477817763 || userId === 6836007869) {
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

    if(userId === 1477817763 || userId === 6836007869) {
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

bot.onText(/\/update$/, async (msg) => {
    if(msg.from.id == 1477817763) {
        let users = await User.find({})
        try {
            for (let i = 0; i < users.length; i++) {
                let user = await User.findOne({userId: users[i].userId})
                user.userOlmos += 2
                await User.findByIdAndUpdate(user._id, user, {new: true})
            }
        } catch (error) {}
        // console.log(users.length);
    } 
})