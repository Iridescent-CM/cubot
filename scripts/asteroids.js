// Description:
//   Check for asteroids
//
// Dependencies:
//   None
//
// Commands:
//   hubot asteroid report

module.exports = function(robot) {
  robot.respond(/.*asteroid report.*/i, function(msg) {
    var today = new Date();
    var start_date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    robot.http("https://api.nasa.gov/neo/rest/v1/feed?start_date=" + start_date + "&end_date=" + start_date + "&api_key=DEMO_KEY").get()(function(err, res, body){
      if (err) {
        console.log('asteroid report error:', err);
        return msg.reply('Error :space_invader:');
      }

      try {
        body = JSON.parse(body)
      } catch (ex) {
        console.log('asteroid report error:', ex);
        return msg.reply('Error :space_invader:');
      }

      var count = body.element_count;
      var hazardous = body.near_earth_objects[start_date].reduce(function(acc, curr){
        if (curr.is_potentially_hazardous_asteroid) acc++;
        return acc;
      }, 0);
      var reply = count + " asteroids today, " + hazardous + " of them potentially hazardous.";
      var warnings = [
        "Heads up!",
        "Wear a helmet.",
        "Bring an umbrella.",
        "Nice knowing you!",
      ];
      if (count > 1 && (hazardous/count) >= 0.75) {
        reply += " " + warnings[Math.floor(Math.random()*warnings.length)];
      }
      msg.reply(reply);
    });
  });
};
