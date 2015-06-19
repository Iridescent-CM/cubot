// Description:
//   Custom command scripts because I don't know
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot log <thing> - Log <thing> to console whereever hubot lives

module.exports = function(robot) {
  robot.respond(/log (.*)/i, function(msg) {
    var thing = msg.match[1]    
    console.log(thing)
    msg.reply("Logged " + thing)
  });

  robot.respond(/i fixed it/i, function(msg) {
    msg.reply("Have a :cookie:");
    setTimeout(function(){
      msg.reply("Now get back to work.");
    }, 10000);
  });
}
