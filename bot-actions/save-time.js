
function saveTime(BarbaraTableBot, msg, state) {
  var time = msg.text.split(':');
  state[msg.from.id].getTime = false;
  state[msg.from.id].time = time;

}

module.exports = saveTime;
