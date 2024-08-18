const startKeyboard = {
    keyboard: [
        [{ text: '🎲Bir Son O\'yladim' }],
        [{ text: '🖇Mening havolam' }, {text: '💎Olmos'}],
        [{ text: '💸Balans' }, { text: '💴Pulni Yechish' }],
        [{ text: '📝Shartlar' }],
        
    ],
    resize_keyboard: true, // Tugmalarni moslashtirish
}

const oylanganSon = {
    inline_keyboard: [
        [
            // [
                { text: '1', callback_data: '1' },{ text: '2', callback_data: '2' },
                { text: '3', callback_data: '3' },{ text: '4', callback_data: '4' },
                { text: '5', callback_data: '5' }

            
        ],
        [
            { text: '6', callback_data: '6' },{ text: '7', callback_data: '7' },
            { text: '8', callback_data: '8' },{ text: '9', callback_data: '9' },
            { text: '10', callback_data: '10' }
        ],
]}

module.exports = {
    startKeyboard,
    oylanganSon
}