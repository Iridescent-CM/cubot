// Description:
//   Get a Cat Fact™
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot cat fact me - Get a Cat Fact™

module.exports = function(robot) {
  robot.respond(/cat ?fact me/i, function(msg) {
    robot.http("http://catfacts-api.appspot.com/api/facts").get()(function(err, res, body){
      if (err) {
        console.log('catfact http error:', err);
        return msg.reply('Error :dog2:');
      }

      try {
        body = JSON.parse(body)
      } catch (ex) {
        console.log('catfact json parse error:', ex);
        return msg.reply('Error :dog2:');
      }

      if (!(body.success && body.success == "true")) {
        console.log('catfact api success error:', body.success);
        return msg.reply('Error :dog2:');
      }

      if (!(body.facts && body.facts.length >= 1)) {
        console.log('catfact api fact error:', body.facts);
        return msg.reply('Error :dog2:');
      }

      msg.reply(body.facts[0] + " :cat2:")
    });
  });
};