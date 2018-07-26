let generate = require("nanoid/generate")
let R = require("@paqmind/ramda")

let makeId = () => generate("0123456789abcdef", 10)

exports.makeUser = function (userFragment) {
  return R.pipe(
    R.pick(["email", "password", "displayName"]), // keep allowed properties
    R.mergeFlipped({
      id: makeId(),
      role: "contributor",
    }), // override properties
  )(userFragment)
}

let guest = {role: "guest", displayName: "Anonymous"}

exports.guest = guest
