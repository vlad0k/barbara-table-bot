
var askTime = (BarbaraTableBot, msg, state) => {
  state[msg.from.id].getTime = true;
  BarbaraTableBot.sendMessage(msg.from.id, "На какое время? (ЧЧ:ММ)");
}

module.exports = askTime;
