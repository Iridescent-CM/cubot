// Description:
//   Call dibs!
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot dibs on <thing> - Register your dibs
//   hubot undibs on <thing> - Release your dibs

module.exports = function(robot) {
  robot.hear(/\bdibs on (.+)/i, function(msg) {
    var thing = msg.match[1].trim()
    var user = msg.envelope.user.name;
    result = user.match(/\(([^)]+)\)/);
    if (result) user = result[1];
    var key = 'dibs_' + thing;

    var dibsHolder = robot.brain.get(key);
    if (dibsHolder && user !== dibsHolder) {
      msg.reply(':collision: @' + dibsHolder + ' has dibs on ' + thing);
    }
    else {
      robot.brain.set(key, user);
      msg.reply(':thumbsup: dibs granted for ' + thing);
    }
  });

  robot.hear(/undibs on (.+)/i, function(msg) {
    var thing = msg.match[1].trim()
    var user = msg.envelope.user.name;
    result = user.match(/\(([^)]+)\)/);
    if (result) user = result[1];
    var key = 'dibs_' + thing;

    var dibsHolder = robot.brain.get(key);
    if (!dibsHolder || user === dibsHolder) {
      robot.brain.set(key, undefined);
      msg.reply(':thumbsup: dibs released');
    }
    else {
      msg.reply(':collision: @' + dibsHolder + ' has dibs on ' + thing);
    }
  });
};
