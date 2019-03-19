const fs = require('fs');



const reserveButton = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: "Зарезервировать столик", callback_data: 'reserve' }],
    ],
  })
};

module.exports.reserve = reserveButton;
