function help(BarbaraTableBot, msg, admins) {
  isAdmin = false;
  for (var i in admins) {
    if (msg.from.id == admins[i].id) {
      isAdmin = true;
    }
  }
  console.log(isAdmin);
  if (msg.text == '/help' && isAdmin){
    var message = `
Список доступных комманд:
/start - Начать резервирование,
/check - Покахать список всех броней,
/del all - удалить все брони,
/del <номер столика> all - удалить все брони со столика с указанным номером,
/del <номер столика> ЧЧ:ММ - удалить бронь со столика с указанным номером на указанное время
    `
    BarbaraTableBot.sendMessage(msg.from.id, message);
  }
}

module.exports = help;
