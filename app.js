const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs')

require('./reserve-table/server');

const tables = require('./tables/tables');
const admins = require('./data/admins');
const button = require('./data/button');
const askTime = require('./bot-actions/ask-time');
const saveTime = require('./bot-actions/save-time');
const sendTableChoose = require('./bot-actions/send-table-choose');
const deleteReserve = require('./bot-actions/delete-reserve');
const check = require('./bot-actions/check');
const help = require('./bot-actions/help');

var state = require('./data/state.js');

const token = '717266553:AAFyOYm2dsKrFT68pskE6ZRyCYPQUoWvwcw';

const BarbaraTableBot = new TelegramBot(token,
  {
    polling: true,
    filepath: false,
  }
);

BarbaraTableBot.on('message', (msg) =>{
  // BarbaraTableBot.deleteMessage(msg.from.id, msg.message_id);
  const chatId = msg.chat.id;
  if (msg.text == "/start") {
    console.log(msg.from);
    state[msg.from.id] = {};
    state[chatId] = {
      id: chatId,
      name: msg.chat.first_name,
      activeSession: true,
      username: msg.chat.username
    }
    BarbaraTableBot.sendMessage(chatId, "Нажмите кнопку что-бы зарезервировать столик", button.reserve);
    return
  }
  if (msg.text.match(/^.{0}\d{1,2}\:{1}\d\d.{0}$/) != null && state[msg.from.id].getTime){
    saveTime(BarbaraTableBot, msg, state);
    if (state[msg.from.id].time[0] < 16  && state[msg.from.id].time[0] != 0 ) {
      BarbaraTableBot.sendMessage(msg.from.id, "Извините, но мы работаем с 16:00 до 01:00. Напишите другое время");
      state[msg.from.id].getTime = true;
      return;
    }
    sendTableChoose(BarbaraTableBot, msg, state);
    return;
  }
  if((msg.text.match(/^.{0}(\+{0,1}38){0,1}\s{0,1}\({0,1}\d{3}\){0,1}\s{0,1}\-{0,1}\s{0,1}\d{3}\-{0,1}\s{0,1}\d{2}\s{0,1}\s{0,1}\-{0,1}\d{2}.{0}$/) != null) && state[msg.from.id].askNum){
    state[msg.from.id].tel = msg.text;
    console.log(state[msg.from.id].tel);
    state[msg.from.id].askNum = false;
    state[msg.from.id].askNumOfPeople = true;
    BarbaraTableBot.sendMessage(msg.from.id, "На сколько человек столик?");
    return;
  }
  if((msg.text.match(/^.{0}\d{1,2}.{0}$/) != null) && state[msg.from.id].askNumOfPeople){
    state[msg.from.id].numOfPeople = msg.text;
    console.log(msg.text);
    state[msg.from.id].askNumOfPeople = false;
    askTime(BarbaraTableBot, msg, state);
    return;
  }
  deleteReserve(BarbaraTableBot, msg);
  check(BarbaraTableBot, msg, admins);
  help(BarbaraTableBot, msg, admins);

})

BarbaraTableBot.on('callback_query', (cb) => {
  if(cb.data == 'reserve'){
    BarbaraTableBot.sendMessage(cb.from.id, "Введите Ваш номер телефона");
    state[cb.from.id].askNum = true;

  }
  if((cb.data == 1 || cb.data == 2 || cb.data == 3 || cb.data == 4 || cb.data == 5 || cb.data == 6 || cb.data == 7) && state[cb.from.id])  {
    var tables = JSON.parse(fs.readFileSync('./tables/tables.json'));
    state[cb.from.id].table = cb.data;
    BarbaraTableBot.sendMessage(cb.from.id, "Ожидайте подтверждения брони");
    state[cb.from.id].adminApprove = true;
    for (i in admins){
      if(admins[i].onDuty){
        var approve = {
          reply_markup: JSON.stringify({
            inline_keyboard: [
              [{ text: "Yes", callback_data: JSON.stringify({ans: "Yes", guestId: cb.from.id})}],
              [{ text: "No", callback_data: JSON.stringify({ans: "No", guestId: cb.from.id}) }],
            ],

          }),
        };
        BarbaraTableBot.sendMessage(admins[i].id, `Подтвердить бронь на ${cb.data}й стол на ${state[cb.from.id].time[0]}:${state[cb.from.id].time[1]} на ${state[cb.from.id].numOfPeople} человек?`, approve);
      }
    }
  }

  var callBack = JSON.parse(cb.data);

  if(callBack.ans == "Yes" && state[callBack.guestId].adminApprove){
    state[callBack.guestId].adminApprove = false;
    BarbaraTableBot.sendMessage(cb.from.id, `
      Бронь подтверждена:
      ${state[callBack.guestId].table}й столик
      Имя: ${state[callBack.guestId].name}
      Время: ${state[callBack.guestId].time[0]}:${state[callBack.guestId].time[1]}
      Номер телефона: ${state[callBack.guestId].tel}
      Колиичество человек: ${state[callBack.guestId].numOfPeople}
      `);
    var reserveInfo = {
      table: state[callBack.guestId].table,
      name: state[callBack.guestId].name,
      username: `@${state[callBack.guestId].username}`,
      time: `${state[callBack.guestId].time[0]}:${state[callBack.guestId].time[1]}`,
      tel: state[callBack.guestId].tel,
      numOfPeople: state[callBack.guestId].numOfPeople
    }
    var allReserves = JSON.parse(fs.readFileSync('./reserve/reserve.json'));
    allReserves.push(reserveInfo);
    fs.writeFileSync('./reserve/reserve.json', JSON.stringify(allReserves));
    var tables = JSON.parse(fs.readFileSync('./tables/tables.json'));
    // tables[Number(cb.data) - 1].endTime.push(Number(state[cb.from.id].time[0]) * 60 + state[cb.from.id].time[1] + 120);
    // tables[Number(cb.data) - 1].endTime.sort((a, b) => {
    //   return a - b;
    // });
    // unique(tables[Number(cb.data) - 1].endTime);
    var newTime = Number(state[callBack.guestId].time[0]) * 60 +  Number(state[callBack.guestId].time[1]) + 120;
    tables[Number(state[callBack.guestId].table) - 1].endTime.push(newTime);
    tables[Number(state[callBack.guestId].table) - 1].endTime.sort((a, b) => {
      return a - b;
    });
    unique(tables[Number(state[callBack.guestId].table) - 1].endTime);
    console.log(tables[Number(state[callBack.guestId].table) - 1].endTime);
    fs.writeFileSync('./tables/tables.json', JSON.stringify(tables));
    BarbaraTableBot.sendMessage(callBack.guestId, `Бронь подтверждена, ждем Вас к ${state[callBack.guestId].time[0]}:${state[callBack.guestId].time[1]}`);
    BarbaraTableBot.sendMessage(callBack.guestId, 'Напишите /start что-бы забронировать');
  }
  if(callBack.ans == "No" && state[callBack.guestId].adminApprove){

    state[callBack.guestId].adminApprove = false;
    var telAsk = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: "Yes", callback_data: JSON.stringify({ans: "telYes", guestId: callBack.guestId})}],
          [{ text: "No", callback_data: JSON.stringify({ans: "telNo", guestId:  callBack.guestId}) }],
        ],

      }),
    };
    console.log(cb.guestId, cb.from.id);
    BarbaraTableBot.sendMessage(callBack.guestId, `Связаться с Вами по номеру ${state[callBack.guestId].tel}?`, telAsk);
  }

  if(callBack.ans == "telYes"){
    state[callBack.guestId].activeSession = false;
    BarbaraTableBot.sendMessage(callBack.guestId, `Ок, с вами свяжутся в ближайшее время!⌚️`);
    BarbaraTableBot.sendMessage(callBack.guestId, 'Напишите /start что-бы забронировать');
    admins.forEach((elem) => {
      if (elem.onDuty) {
        BarbaraTableBot.sendMessage(elem.id, `Свяжитесь с гостем по номеру: ${state[callBack.guestId].tel}`);
      }

    });
  }

  if(callBack.ans == "telNo" && state[callBack.guestId].activeSession){
    state[callBack.guestId].activeSession = false;
    BarbaraTableBot.sendMessage(callBack.guestId, `Ок, ждем вас в следующий раз!`);
    BarbaraTableBot.sendMessage(callBack.guestId, 'Напишите /start что-бы забронировать');
  }

  BarbaraTableBot.answerCallbackQuery(cb.id);
});


function unique(arr) {
  var obj = {};

  for (var i = 0; i < arr.length; i++) {
    var str = arr[i];
    obj[str] = true; // запомнить строку в виде свойства объекта
  }

  return Object.keys(obj); // или собрать ключи перебором для IE8-
}
// setInterval(
//   () => {
//     BarbaraTableBot.sendMessage('409188474', "Владос, привет")
//   }, 2000
// );
