const fs = require('fs');




var tableButtons = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 1, callback_data: 1 }],
      [{ text: 2, callback_data: 2 }],
      [{ text: 3, callback_data: 3 }],
      [{ text: 4, callback_data: 4 }],
      [{ text: 5, callback_data: 5 }],
      [{ text: 6, callback_data: 6 }],
      [{ text: 7, callback_data: 7 }]
    ],

  })
};

function sendTableChoose(BarbaraTableBot, chatId, tableButtons) {
  const stream = fs.createReadStream('./images/tables.png');
  BarbaraTableBot.sendPhoto(chatId, stream);

  var avaliableTables = {
    reply_markup: JSON.stringify({
      inline_keyboard: getFreeTables(),
    }),
  };
  BarbaraTableBot.sendMessage(chatId, 'Выберите один из доступных столиков', avaliableTables);
}

function getFreeTables() {
  var tables = JSON.parse(fs.readFileSync('./tables/tables.json'));
  var buttons = [];
  tables.forEach((elem, i) => {
    if (!elem.isBusy){
      buttons.push([{ text: i+1, callback_data: `${i+1}` }])
    }
  });
  return buttons;
}

function approveTable(BarbaraTableBot, admins, data) {
  console.log(admins);
  var message = `Подтвердить бронь на ${data}й стол?`;
  var approveButtons = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: "Yes", callback_data: 'Yes'}],
        [{ text: "No", callback_data: 'No' }],
      ],

    }),
  };

  for (i in admins){
    BarbaraTableBot.sendMessage(admins[i].id, message, approveButtons);
  }

}

module.exports.tableButtons = tableButtons;
module.exports.sendTableChoose = sendTableChoose;
module.exports.approveTable = approveTable;
