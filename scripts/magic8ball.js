// Description:
//   Magic 8 ball
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot :8ball:|:crystal_ball: <question> - Consult the magic 8 ball

var WISDOM = [
  "It is certain",
  "It is decidedly so",
  "Without a doubt",
  "Yes definitely",
  "You may rely on it",
  "As I see it, yes",
  "Most likely",
  "Outlook good",
  "Yes",
  "Signs point to yes",
  "Reply hazy try again",
  "Ask again later",
  "Better not tell you now",
  "Cannot predict now",
  "Concentrate and ask again",
  "Don't count on it",
  "My reply is no",
  "My sources say no",
  "Outlook not so good",
  "Very doubtful"
];

module.exports = function(robot) {
  robot.respond(/(:8ball:|:crystal_ball:)(.*)/i, function(msg) {
    var q = msg.match[2]
    if (q) {
      msg.reply(WISDOM[Math.floor(Math.random() * WISDOM.length)]);
    }
    else {
      msg.reply("What is the question?");
    }
  });
}