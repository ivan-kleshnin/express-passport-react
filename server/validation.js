let {validateLocalSignUpForm, validateLocalSignInForm} = require("../common/validators")

function validateWith(validateFn) {
  return (req, res, next) => {
    validateFn(req.body).cata({
      Success: (data) => next(),
      Failure: (errors) => {
        res.status(400)
        res.json({message: "Validation error", errors})
      },
    })
  }
}

exports.validateWith = validateWith
