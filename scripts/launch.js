// Description:
//   List next rocket launch, according to https://launchlibrary.net/
//
// Dependencies:
//   None
//
// Commands:
//   hubot :rocket:?

var Promise = require('promise');

module.exports = function(robot) {

  function get_next_launch() {
    return new Promise(function(resolve, reject) {
      var url = "https://launchlibrary.net/1.1/launch?next=1&mode=verbose";
      robot.http(url).get()(function(err, res, body) {
        if (err) {
          console.log("launch.js:", err);
          return reject("Launch Library won't talk to me :sob:");
        }

        if (res.statusCode !== 200) {
          console.log("launch.js:", res.statusCode, "on", url);
          return reject("Launch Library won't talk to me :sob:");
        }

        try {
          body = JSON.parse(body);
        } catch (ex) {
          console.log("launch.js:", ex);
          return reject("I'm not sure, Launch Library's speaking gibberish :alien:");
        }

        if (body.status && (body.status === 'error' || body.status === 'fail')) {
          console.log("launch.js:", body.status, body.msg);
          return reject("Launch Library says '" + body.msg + "' :boom:");
        }

        if (!body.launches || body.launches.length < 1) {
          console.log("launch.js: no launches came back?", body);
          return reject("Launch Library didn't give me any launches :confounded:");
        }

        return resolve(body.launches[0]);
      });
    });
  }

  function respond(msg) {
    return function(launch) {

      if (launch.location.pads.length > 1) {
        console.log("launch.js: more than 1 pad! Ur assumption was WRONG.");
      }

      var pad = launch.location.pads[0];
      var padmsg = pad.name;
      if (pad.mapURL) {
        padmsg += " (" + pad.mapURL + ")";
      }

      var rocketmsg = launch.rocket.name;
      if (launch.rocket.wikiURL) {
        rocketmsg += " (" + launch.rocket.wikiURL + ")";
      }

      var reply = "";

      reply += ":rocket: *Next launch*\n";
      reply += "*When*: " + launch.net + "\n";
      reply += "*Where*: " + padmsg + "\n";
      reply += "*Rocket*: " + rocketmsg + "\n";
      reply += "*Missions*:\n";
      for (var idx=0; idx < launch.missions.length; idx++) {
        var mission = launch.missions[idx];
        reply += "  _" + mission.name + "_: " + mission.description + "\n";
      }

      /* TODO: verify launch status? */
      msg.reply(reply);
    };
  }

  robot.respond(/:rocket: *?/i, function(msg) {
    get_next_launch()
      .then(respond(msg))
      .catch(function(err) {
        msg.reply(err);
      });
  });
};