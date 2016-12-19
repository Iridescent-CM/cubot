// Description:
//   Get photos from Mars
//
// Dependencies:
//   None
//
// Commands:
//   hubot how's Mars today?

var DATE_BRAINKEY = 'howsmars_last_date';
var IDX_BRAINKEY = 'howsmars_last_idx';

var CAM_ORDER = {
  "FHAZ": 1,
  "NAVCAM": 1,
  "MAST": 1,
  "MAHLI": 1,
  "MARDI": 1,
  "RHAZ": 1,
  "CHEMCAM": 2,
}

module.exports = function(robot) {
  robot.respond(/.*(how['’]s|how is) mars.*/i, function(msg) {
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
      photos.sort(function(a, b) {
        return CAM_ORDER[a.camera.name] - CAM_ORDER[b.camera.name];
      });

      var last_idx = -1;
      var last_date = robot.brain.get(DATE_BRAINKEY);
      if (last_date && last_date === date) {
        last_idx = robot.brain.get(IDX_BRAINKEY);
      }

      var idx = (last_idx + 1) % photos.length;
      robot.brain.set(IDX_BRAINKEY, idx);
      robot.brain.set(DATE_BRAINKEY, date);

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
      msg.reply(response + " " + photos[idx].img_src);
    });
  });
};