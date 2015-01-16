# Description:
#   Epic hubot emoji battle supreme!
#
# Dependencies:
#   None
#
# Configuration:
#   None
#
# Commands:
#   hubot <emoji> - Give hubot an emoji and see what he responds

module.exports = (robot) ->

  robot.respond /(:[a-z0-9_+-]+:)/i, (msg) =>
    emoji = msg.match[1]
    msg.reply switch emoji
      when ":cookie:" then "OM NOM NOM!"
      when ":metal:" then ":fire: :guitar: :fire:"
      when ":fist:" then ":fist:"
      when ":thumbsup:", ":+1:" then ":ok_hand:"
      when ":point_right:" then ":point_left:"
      when ":point_left:" then ":point_right:"
      when ":point_up:", ":point_up_2:" then ":point_down:"
      when ":point_down:" then ":point_up_2:"
      when ":poop:" then ":toilet:"
      when ":sos:" then "http://www.emoji-cheat-sheet.com/"
      else ":no_entry:"
