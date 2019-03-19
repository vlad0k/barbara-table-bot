const fs = require('fs');
var state = require('../data/state.js');

function sendTableChoose(BarbaraTableBot, msg, state) {
  const pic = fs.readFileSync('./images/tables.png');
  BarbaraTableBot.sendPhoto(msg.from.id, pic);

  var avaliableTables = {
    reply_markup: JSON.stringify({
      inline_keyboard: getFreeTables(msg, state),
    }),
  };

  BarbaraTableBot.sendMessage(msg.from.id, 'Выберите один из доступных столиков', avaliableTables);
}



function getFreeTables(msg, state) {
  var tables = JSON.parse(fs.readFileSync('./tables/tables.json'));

  console.log(tables);

  var buttons = [];
  tables.forEach((elem, i) => {
    stateTime = Number(state[msg.from.id].time[0]) * 60 + Number(state[msg.from.id].time[1]);
    var checkTime = false;

    for ( index in elem.endTime){
        let i = Number(index);
        if (elem.endTime.length == 0) {
          continue;
        }
        if (elem.endTime[i-1] == undefined && elem.endTime[i] - stateTime >= 240) {
          checkTime = true;
        } else if(elem.endTime[i+1] == undefined){
          if (stateTime >= elem.endTime[i]) {
            checkTime = true;
          }
        } else {
          if(stateTime >= elem.endTime[i] && elem.endTime[i+1] - stateTime >= 240){
            checkTime = true;
          }
        }


    }

    if ((elem.endTime.length == 0 || checkTime) && state[msg.from.id].numOfPeople >= elem.min && state[msg.from.id].numOfPeople <= elem.max){
        buttons.push([{ text: i+1, callback_data: `${i+1}` }]);
    }
  });
  return buttons;
}


module.exports = sendTableChoose;
