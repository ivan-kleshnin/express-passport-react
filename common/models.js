let generate = require("nanoid/generate")
let R = require("@paqmind/ramda")

// TODO TypeScript
/*
interface User {
  id: string,
  role: string,
  email: string,
  password: string,
  displayName: string,
  provider: string,
}
*/

function makeId() {
  return generate("0123456789abcdef", 10)
}

function makeUser(userFragment) {
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
