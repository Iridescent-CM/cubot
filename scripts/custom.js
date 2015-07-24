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

  robot.respond(/debug/i, function(res) {
    console.log(res)
  });

  robot.respond(/i fixed it/i, function(msg) {
    msg.reply("Have a :cookie:");
    setTimeout(function(){
      msg.reply("Now get back to work.");
    }, 10000);
  });

  robot.hear(/:\+1:|:thumbsup:/, function(res) {
    if (res.message.user.name === 'cat' && res.message.room === 'dev-team')
      res.send('https://raw.githubusercontent.com/Iridescent-CM/cubot/master/scripts/gifs/thumbs_up_cat.gif')
  });

  robot.hear(/:[a-zA-Z_]*tongue[a-zA-Z_]*:/, function(res) {
    if (res.message.user.name === 'savannah' && res.message.room === 'dev-team')
      res.send('https://raw.githubusercontent.com/Iridescent-CM/cubot/master/scripts/gifs/tongue1.gif')
}
