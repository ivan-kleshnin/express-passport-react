let generate = require("nanoid/generate")
let R = require("@paqmind/ramda")

let makeId = () => generate("0123456789abcdef", 10)

exports.makeUser = function (userFragment) {
  // TODO validate
  return R.pipe(
    R.merge({
      id: makeId(),
      role: "contributor",
    }),
    R.toPairs,        // Sort object keys
    R.sortBy(R.head), // to simplify JSON analysis
    R.fromPairs,      // (project specifics)
  )(userFragment)
}

let guest = {
  role: "guest",
  displayName: "Anonymous",
}

exports.guest = guest
