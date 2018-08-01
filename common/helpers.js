let R = require("@paqmind/ramda")

class ErrorX extends Error {
  constructor(data) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(data.message)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorX)
    }

    // Custom debugging information
    for (let k in data) {
      if (k != "message" && k != "name" && k != "constructor") {
        this[k] = data[k]
      }
    }

    this.name = this.constructor.name
  }
}

function fetchJSON(url, options) {
  options = R.mergeDeep(options, {
    credentials: "same-origin",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options.body),
  })
  return fetch(url, options)
    .then(resp => {
      return resp.json()
        .then(body => {
          if (resp.ok) {
            return body
          } else {
            return new ErrorX({status: resp.status, ...body})
          }
        })
        .catch(_ => {
          return new ErrorX({status: resp.status, message: "Invalid JSON"})
        })
    })
}

function findByEmail(email, users) {
  return R.find(user => user.email == email, R.values(users))
}

function findByCredentials(email, password, users) {
  return R.find(user => user.email == email && user.password == password, R.values(users))
}

exports.ErrorX = ErrorX
exports.fetchJSON = fetchJSON
exports.findByEmail = findByEmail
exports.findByCredentials = findByCredentials
