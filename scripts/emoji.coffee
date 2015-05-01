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

# handled in other scripts
SKIP = [
  ":8ball:",
  ":crystal_ball:"
]

module.exports = (robot) ->

  robot.respond /[^:]*(:[a-z0-9_+-:\s]+:)[^:]*/i, (msg) =>
    emoji = msg.match[1]
    if emoji in SKIP
      return
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
      when ":cloud:" then ":zap:"
      when ":zap:" then ":skull:"
      when ":zzz:"
        opts = [":rooster:", ":alarm_clock:", ":coffee:", ":tea:"]
        opts[Math.floor(Math.random() * opts.length)]
      when ":meat_on_bone:" then ":fork_and_knife:"
      when ":sunglasses: :point_right: :point_right:" then ":point_left: :point_left: :sunglasses:"
      else
        console.log(emoji, "does not compute")
        ":no_entry:"
