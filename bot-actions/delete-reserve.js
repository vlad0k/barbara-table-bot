const fs = require('fs');

function deleteReserve(BarbaraTableBot, msg) {
  var tables = JSON.parse(fs.readFileSync('./tables/tables.json'));
  var allReserves = JSON.parse(fs.readFileSync('./reserve/reserve.json'));
  var tempReserves = [];
  var empty = true
  for (i in tables) {
    if(tables[i].endTime.length != 0){
      empty = false;
      break;
    }
  }
  if(empty){
    return;
  }
  message = msg.text.split(' ');

  if (message[0] == "/deleteReserve" || message[0] == "/deletereserve" || message[0] == "/del") {

    if (message[1] == 'all') {
      for (i in tables) {
        tables[i].endTime = [];
        fs.writeFileSync('./reserve/reserve.json', '[]');
      }
    }
    console.log(message[1]);
    if (message[1].match(/\d/) != null) {
      console.log('-');
      if (message[2] == 'all') {
        console.log('+');
        tables[Number(message[1]) - 1].endTime = [];
        console.log(allReserves);
        for (let i in allReserves) {
          if (allReserves[i].table != message[1]) {
            tempReserves.push(allReserves[i]);
            console.log('+++');
          }
        }
        console.log(tempReserves);
        console.log('++++');
        fs.writeFileSync('./reserve/reserve.json', JSON.stringify(tempReserves));
        BarbaraTableBot.sendMessage(msg.from.id, `Все брони с ${message[1]}го столика удалены`);
      }
      if(message[2].match(/^.{0}\d{1,2}\:\d{2}.{0}$/) != null) {
        console.log('time');
        // if (tables[Number(message[1]) - 1].endTime.length == 0){
        //   return;
        // }
        var timeArr = message[2].split(':');
        var time = Number(timeArr[0]) * 60 + Number(timeArr[1]) + 120;
        console.log(allReserves , message[2]);
        for (let i in allReserves) {
          if (allReserves[i].time == message[2]) {

            allReserves.splice(i,1);
            console.log('+++');
          }
        }
        console.log(allReserves);
        console.log('++++');
        fs.writeFileSync('./reserve/reserve.json', JSON.stringify(allReserves));
        var position = tables[Number(message[1]) - 1].endTime.indexOf(time);
        if ( ~position ) tables[Number(message[1]) - 1].endTime.splice(position, 1);
        BarbaraTableBot.sendMessage(msg.from.id, `Бронь с ${message[1]}го столика на ${message[2]} удалена`);
      }
    }

    fs.writeFileSync('./tables/tables.json', JSON.stringify(tables));
  }

}

module.exports = deleteReserve;
