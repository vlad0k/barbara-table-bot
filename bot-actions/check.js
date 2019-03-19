const fs = require('fs');

function check(BarbaraTableBot, msg, admins) {
  isAdmin = false;
  for (var i in admins) {
    if (msg.from.id == admins[i].id) {
      isAdmin = true;
    }
  }
  if (msg.text == '/check' && isAdmin) {
    var allReserves = JSON.parse(fs.readFileSync('./reserve/reserve.json'));
    var message = '';
    console.log('+');
    for (i in allReserves) {
      message += 'Столик: ' + allReserves[i].table + ',\n';
      message += 'Имя: ' + allReserves[i].name + ',\n';
      message += 'Telegram Username: ' + allReserves[i].username + ',\n';
      message += 'Время: ' + allReserves[i].time + ',\n';
      message += 'Телефон: ' + allReserves[i].tel + ',\n';
      message += 'Колличество человек: ' + allReserves[i].numOfPeople + '\n\n';


      BarbaraTableBot.sendMessage(msg.from.id, message);

      message = '';
    }
  }
  if (msg.text == '/help' && !isAdmin){
    BarbaraTableBot.sendMessage(msg.from.id, 'Напишите /start для того чтобы забронировать');
  }
}

module.exports = check;
