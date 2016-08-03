var unirest = require('unirest');
var BASE_URL = 'https://api.telegram.org/bot215283677:AAHCsBfr9quGh9W16gDAmlXJzCykvhmMJGA'
var POLLING_URL = BASE_URL + "getUpdates?offset=:offset:&timeout=60";
var SEND_MESSAGE_URL = BASE_URL + "sendMessage";</pre>

function poll(offset) {
  var URL = pollingURL.replace(":offset:", offset);

  unirest.get(URL)
    .end(function(response){
      var body = response.raw_body;
      if (response.status == 200){
        var jsonData = JSON.parse(body);
        var result = jsonData.result;

        if(result.length > 0) {
          for (i in result) {
            if (runCommand(result[i].message)) continue;
          }
          max_offset = parseInt(result[result.length - 1].update_id) + 1
        }
        poll(max_offset);
      }
    });
};

var dosth = function(message) {
  var caps = message.text.toUpperCase();
  var answer = {
    chat_id : message.chat.id,
    text : "You told me to do smth, so i made everything caps. " + caps
  };

  unirest.post(SEND_MESSAGE_URL)
    .send(answer)
    .end(function (response)) {
      if (response.status == 200) console.log("succesfully sent message to " + message.chat.id)
    }
}

var COMMANDS = {
  "dosth" : dosth
};

function runCommand(message) {
  var msgtext = message.text;
  if (msgtext.indexOf("/") != 0) return false;
  var command = msgtext.substring(1, msgtext.indexOf(" "));
  if (COMMANDS[command] == null) {
    var answer = {
      chat_id : message.chat.id,
      text : "not a command "
    };
    .send(answer)
    return false
  };

  COMMANDS[command](message);
  return true;
}
