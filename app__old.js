const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs')

const tables = require('./tables/tables');
const token = '717266553:AAFyOYm2dsKrFT68pskE6ZRyCYPQUoWvwcw';
const BarbaraTableBot = new TelegramBot(token,
  {polling: true,
   filepath: false,
  });

var admins = [
  {
  id: 517573307, //Lilya
  onDuty: false,
  },
  {
  id: 278311577, //Vlad
  onDuty: true,
  },
  {
  id: 510241969, //Maz
  onDuty: false,
  },

];

var reserveButton = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: "Зарезервировать столик", callback_data: 'reserve' }],
    ],
  })
};

var state = {};

BarbaraTableBot.on('message', (msg) => {
  state = {};
  const chatId = msg.chat.id;
  if (msg.text == "/start") {
    BarbaraTableBot.sendMessage(chatId, "Нажмите кнопку что-бы зарезервировать столик", reserveButton);
    console.log(msg.chat);
    state.id = chatId
    return
  }


  if (msg.text.match(/.{0}\d{0,2}\:\d\d.{0}/) != null && state.getTime ) {
    var time = msg.text.split(':');
    if (time[0] == 0) {
      time[0] = 24;
    }
    state.getTime = false;
    state.nowTime = time;
    tables.sendTableChoose(BarbaraTableBot, chatId, tables.tableButtons);
    return
  }

  BarbaraTableBot.sendMessage(chatId, 'Такой запрос не поддерживается');
});

BarbaraTableBot.on('callback_query', (cb) =>
  {
    var chatId = cb.message.chat.id;

    if (cb.data == "reserve") {
      state.getTime = true
      BarbaraTableBot.sendMessage(chatId, "На какое время? (ЧЧ:ММ)");
    }
    if((cb.data == 1 || cb.data == 2 || cb.data == 3 || cb.data == 4 || cb.data == 5 || cb.data == 6 || cb.data == 7) && state.id) {
      BarbaraTableBot.sendMessage(chatId, `Вы выбрали ${cb.data}й столик \nПодождите, пожалуйста подтверждения брони`);

      state.nowTable = cb.data;
      state.chatId = cb.message.chat.id;
      state.name = cb.from.first_name;

      var message = `Подтвердить бронь на ${cb.data}й стол?`;
      var approveButtons = {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{ text: "Yes", callback_data: 'Yes'}],
            [{ text: "No", callback_data: 'No' }],
          ],

        }),
      };

      for (i in admins){
        if(admins[i].onDuty){
          BarbaraTableBot.sendMessage(admins[i].id, message, approveButtons);
        }

      }

    }
    if(cb.data == 'Yes'){
      if(state.id){
        BarbaraTableBot.sendMessage(chatId, "Cтолик зарезервирован");
        BarbaraTableBot.sendMessage(state.chatId, `Cтолик зарезервирован`);
        state = {};
      }
      var tables = JSON.parse(fs.readFileSync('./tables/tables.json'));
      tables[nowTable].isBusy = true;
      tables[nowTable].endTime = [state.time[0] + 2, tate.time[1]];
      console.log(tables);
    }
    if(cb.data == 'No' && state.id){
      BarbaraTableBot.sendMessage(chatId, "Cтолик не зарезервирован");
      BarbaraTableBot.sendMessage(state.chatId, "Cтолик не зарезервирован");

      state = {};

    }
    BarbaraTableBot.answerCallbackQuery(cb.id);
});
