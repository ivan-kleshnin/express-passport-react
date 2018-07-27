let generate = require("nanoid/generate")
let R = require("@paqmind/ramda")

function makeId() {
  return generate("0123456789abcdef", 10)
}

function makeUser(userFragment) {
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

let guest = makeUser({
  role: "guest",
  displayName: "Anonymous",
})

exports.makeId = makeId
exports.makeUser = makeUser
exports.guest = guest
