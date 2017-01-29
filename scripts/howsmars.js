// Description:
//   Get photos from Mars
//
// Dependencies:
//   None
//
// Commands:
//   hubot how's Mars today?

var Promise = require('promise');

var BRAIN_KEY = 'hows_mars_cache';

var CAM_ORDER = {
  "FHAZ": 1,
  "NAVCAM": 1,
  "MAST": 1,
  "MAHLI": 1,
  "MARDI": 1,
  "RHAZ": 1,
  "CHEMCAM": 2,
}

function get_manifest(robot, key) {
  return new Promise(function(resolve, reject) {
    robot.http(
      "https://api.nasa.gov/mars-photos/api/v1/manifests/Curiosity" +
      "?api_key=" + key
    ).get()(function(err, res, body) {
      if (err) {
        console.log("how's mars error:", err);
        return reject("Dunno, NASA won't talk to me :sob:");
      }

      try {
        body = JSON.parse(body);
      } catch (ex) {
        console.log("how's mars error:", ex);
        return reject("I'm not sure, NASA's speaking gibberish :alien:");
      }

      if (body.errors) {
        console.log("how's mars error:", body.errors);
        return reject("Hmm, what does '" + body.errors + "' mean? :boom:");
      }

      return resolve(body.photo_manifest.max_date);
    });
  });
}

function fetch_photos(robot, key, date) {
  return new Promise(function(resolve, reject) {
    robot.http(
      "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?" +
      "earth_date=" + date +
      "&api_key=" + key
    ).get()(function(err, res, body){
      if (err) {
        console.log("how's mars error:", err);
        return reject("Dunno, NASA won't talk to me :sob:");
      }

      try {
        body = JSON.parse(body);
      } catch (ex) {
        console.log("how's mars error:", ex);
        return reject("I'm not sure, NASA's speaking gibberish :alien:");
      }

      if (body.errors) {
        console.log("how's mars error:", body.errors);
        return reject("Hmm, what does '" + body.errors + "' mean? :boom:");
      }

      var photos = body.photos;
      photos.sort(function(a, b) {
        return CAM_ORDER[a.camera.name] - CAM_ORDER[b.camera.name];
      });

      return resolve({
        photos: photos,
        date: date,
        idx: 0
      });
    });
  });
}

function get_photos(robot, key) {
  return function(max_date) {
    var cached = robot.brain.get(BRAIN_KEY);
    if (cached && cached.date == max_date) {
      console.log("how's mars using cache from", cached.date);
      return cached;
    }
    else {
      return fetch_photos(robot, key, max_date);
    }
  };
}

function respond(msg) {
  return function(obj) {
    var photos = obj.photos;
    var idx = obj.idx;
    var date = obj.date;

    console.log("Showing photo", idx, "of", photos.length, "from", date);

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
    return obj;
  }
}

function update_cache(robot) {
  return function (obj) {
    obj.idx = (obj.idx + 1) % obj.photos.length;
    robot.brain.set(BRAIN_KEY, obj);
  }
}

module.exports = function(robot) {
  robot.respond(/.*(how['’]s|how is) mars.*/i, function(msg) {
    var key = process.env.NASA_API_KEY || "DEMO_KEY";

    get_manifest(robot, key)
      .then(get_photos(robot, key))
      .then(respond(msg))
      .then(update_cache(robot))
      .catch(function(err) {
        msg.reply(err);
      });
  });
};