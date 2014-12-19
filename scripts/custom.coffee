# Description:
#   Custom command scripts because I don't know
#
# Dependencies:
#   None
#
# Configuration:
#   None
#
# Commands:
#   hubot log N - Log N to console whereever hubot lives
#   hubot :cookie: - Give hubot a :cookie:

module.exports = (robot) ->

  robot.respond /log (.*)/i, (msg) ->
    thing = msg.match[1]    
    console.log thing
    msg.reply "Logged #{thing}"

  robot.respond /:cookie:/i, (msg) ->
    msg.reply "OM NOM NOM"
