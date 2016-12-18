// Description:
//   Get photos from Mars
//
// Dependencies:
//   None
//
// Commands:
//   hubot how's Mars today?

var BRAINKEY = 'howsmars_last';

module.exports = function(robot) {
  robot.respond(/.*how's mars.*/i, function(msg) {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var date = yesterday.getFullYear() + "-" + (yesterday.getMonth() + 1) + "-" + yesterday.getDate();
    var key = process.env.NASA_API_KEY || "DEMO_KEY";

    robot.http(
      "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?" +
      "earth_date=" + date +
      "&api_key=" + key
    ).get()(function(err, res, body){
      if (err) {
        console.log("how's mars error:", err);
        return msg.reply("Dunno, NASA won't talk to me :sob:");
      }

      try {
        body = JSON.parse(body);
      } catch (ex) {
        console.log("how's mars error:", ex);
        return msg.reply("I'm not sure, NASA's speaking gibberish :alien:");
      }

      if (body.errors) {
        if (body.errors == "No Photos Found") {
          return msg.reply("Hmm, no photos from yesterday yet.");
        }
        else {
          return msg.reply("Hmm, what does '" + body.errors + "' mean? :boom:");
        }
      }

      var photos = body.photos;
      var last = robot.brain.get(BRAINKEY) || 0;
      last = last++ % photos.length;
      robot.brain.set(BRAINKEY, last);

      var responses = [
        "Lookin' Mars-y!",
        "Martian.",
        "Looks dry.",
        "Kinda lonely.",
        "WAS THAT A MARTIAN??",
        "Where are the people?",
        "It's red."
      ];
      var response = responses[Math.floor(Math.random() * responses.length)];
      msg.reply(response + " " + photos[last].img_src);
    });
  });
};