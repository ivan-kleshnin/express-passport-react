let R = require("@paqmind/ramda")
let {taggedSum} = require("daggy")

let mergeDeepConcat = R.mergeDeepWith(R.concat)

let Validation = taggedSum("Validation", {
  Success: ["value"],
  Failure: ["value"],
})

let {Success, Failure} = Validation
let Success1 = (field, value) => Success({[field]: value})
let Failure1 = (field, value) => Failure({[field]: [value]})

Validation.prototype.concat = function (that) {
  return this.cata({
    Success: (thisValue) => {
      return Success.is(that)
        ? Success(R.merge(thisValue, that.value))
        : that
    },
    Failure: (thisValue) => {
      return Failure.is(that)
        ? Failure(mergeDeepConcat(thisValue, that.value))
        : this
    },
  })
}

// Validation.prototype.map = function (fn) {
//   return this.cata({
//     Success: (value) => Success(fn(value)),
//     Failure: (value) => this,
//   })
// }

Validation.prototype.failMap = function (fn) {
  return this.cata({
    Success: (value) => this,
    Failure: (value) => Failure(fn(value)),
  })
}

// Validation.prototype.bimap = function (leftFn, rightFn) {
//   return this.cata({
//     Success: (value) => Success(rightFn(value)),
//     Failure: (value) => Failure(leftFn(value)),
//   })
// }

// Validation.prototype.apply = function (that) {
//   return this.cata({
//     Success: (value) => Success.is(that) ? that.map(this.value) : that,
//     Failure: (value) => Success.is(that) ? this : Failure(this.value.concat(that.value)),
//   })
// }

// Validation.prototype.chain = function (fn) {
//   return this.cata({
//     Success: (value) => fn(value),
//     Failure: (value) => this,
//   })
// }

let collect = R.reduce(R.concat, Success({}))

// let fromValue = R.curry((error, value) => {
//   return value == null ? Failure(error) : Success(value)
// })

// function optional(field, fn) {
//   return (x) => R.pipe(
//     fromValue({}),
//     (v) => v.cata({
//       Success: (value) => fn(value),
//       Failure: (value) => Success({[field]: x}),
//     })
//   )(x)
// }

exports.Validation = Validation
exports.Success = Success
exports.Failure = Failure

// exports.fromValue = fromValue
// exports.optional = optional
exports.collect = collect

exports.Success1 = Success1
exports.Failure1 = Failure1
