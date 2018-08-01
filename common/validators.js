let R = require("@paqmind/ramda")
let EmailValidator = require("email-validator")
let {Success1, Failure1, collect} = require("../vendors/validation")

// Lib-level validators ----------------------------------------------------------------------------
let notEmpty = R.curry((field, value) => {
  return value.trim()
    ? Success1(field, value)
    : Failure1(field, `can't be empty`)
})

let minLength = R.curry((field, min, value) => {
  return value.length >= min
    ? Success1(field, value)
    : Failure1(field, `must have at least ${min} characters`)
})

let maxLength = R.curry((field, max, value) => {
  return value.length <= max
    ? Success1(field, value)
    : Failure1(field, `must have at most ${max} characters`)
})

let matches = R.curry((field, regexp, value) => {
  return regexp.test(value)
    ? Success1(field, value)
    : Failure1(field, `must match ${regexp}`)
})

exports.notEmpty = notEmpty
exports.minLength = minLength
exports.maxLength = maxLength
exports.matches = matches

// App-level validators ----------------------------------------------------------------------------
let validateEmail = R.curry((field, value) => {
  return EmailValidator.validate(value)
    ? Success1(field, value)
    : Failure1(field, `is invalid`)
})

let validatePassword = R.curry((field, value) => {
  return collect([
    minLength(field, 6, value),
    maxLength(field, 20, value),
    matches(field, /[A-Z]/, value).failMap(_ => ({[field]: [`must contain a capital letter`]})),
  ])
})

let validateDisplayName = R.curry((field, value) => {
  return collect([
    minLength(field, 2, value),
    maxLength(field, 20, value),
  ])
})

let validateLocalSignUpForm = (form) => {
  return collect([
    validateEmail("email", form.email),
    validatePassword("password", form.password),
    validateDisplayName("displayName", form.displayName)
  ])
}

let validateLocalSignInForm = (form) => {
  return collect([
    validateEmail("email", form.email),
    validatePassword("password", form.password),
  ])
}

exports.validateLocalSignUpForm = validateLocalSignUpForm
exports.validateLocalSignInForm = validateLocalSignInForm
