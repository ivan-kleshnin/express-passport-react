let R = require("@paqmind/ramda")
let {Router} = require("express")
let FS = require("fs")
let Passport = require("passport")
let {Strategy: LocalStrategy} = require("passport-local")
let {Strategy: GitHubStrategy} = require("passport-github")
let {findByEmail, findByCredentials} = require("../common/helpers")
let {guest, makeUser} = require("../common/models")
let db = require("../db")

Passport.use(new LocalStrategy({
    usernameField: "email",
  },
  (email, password, next) => {
    console.log("@ [local] verifyCredentials")
    let user = findByCredentials(email, password, db.users)
    if (user) {
      next(null, user)
    } else {
      next(null, false)
    }
  }
))

Passport.use(new GitHubStrategy({
    clientID: "57a3e0f05b523bbd845b",                          // TODO move
    clientSecret: "3086f0136be7e1fe14405999e009161553d3fc45",  // this to env vars
    callbackURL: "http://localhost:8080/auth/github/callback", //
  },
  (accessToken, refreshToken, profile, next) => {
    console.log("@ [github] verifyCredentials")
    let email = profile.emails[0].value // TODO what if there are no emails?!
    let userOrNull = findByEmail(email, db.users)
    if (userOrNull) {
      // Kinda "do nothing"
      next(null, userOrNull)
    } else {
      // Create account
      let user = makeUser({
        displayName: profile.displayName,  // Important: pick fields
        email: email,                      // one by one here
        password: null,                    // to avoid injections
        provider: "github",
        role: "contributor",
      })
      db.users[user.id] = user
      let json = JSON.stringify(db.users, null, 2)
      FS.writeFile("./db/users.json", json, "utf-8", (err) => {
        next(err, user)
      })
    }
  }
))

Passport.serializeUser((user, next) => {
  console.log("@ [common] serializeUser")
  next(null, user.id)
})

Passport.deserializeUser((id, next) => {
  console.log("@ [common] deserializeUser")
  if (db.users[id]) next(null, db.users[id])
  else              next(null, guest)
})

// Auth ============================================================================================
let router = Router({
  // caseSensitive: true,
  // strict: true,
  // ??? TODO
})

// Local ---
// TODO validation
router.post("/auth/local/sign-in", (req, res, next) => {
  console.log("@ [local] signIn")
  Passport.authenticate("local", (err, user, info) => {
    if (err) return next(err)
    if (!user) {
      res.status(401)
      return res.send({message: "Wrong credentials"})
    }
    req.logIn(user, (err) => {
      if (err) return next(err)
      res.status(200)
      return res.send(user)
    })
  })(req, res, next)
})

// TODO validation
router.post("/auth/local/sign-up", (req, res, next) => {
  console.log("@ [local] signUp")
  let user = makeUser({
    displayName: req.body.displayName, // Important: pick fields
    email: req.body.email,             // one by one here
    password: req.body.password,       // to avoid injections
    provider: "local",
    role: "contributor",
  })
  if (db.users[user.id]) {
    res.status(409)
    return res.send({message: "Duplicate id"})
  }
  if (findByEmail(user.email, db.users)) {
    res.status(409)
    return res.send({message: "Duplicate email"})
  }
  // TODO duplicate by `displayName`?! or add unique `username` ?!
  db.users[user.id] = user
  let json = JSON.stringify(db.users, null, 2)
  FS.writeFile("./db/users.json", json, "utf-8", (err) => {
    if (err) next(err)
    res.status(200)
    res.send(user)
  })
})

router.post("/auth/sign-out", (req, res) => {
  console.log("@ [local] signOut")
  req.logout()
  res.status(200)
  res.send({me: guest})
})

// GitHub ---
router.get("/auth/github", Passport.authenticate("github"))

router.get("/auth/github/callback", (req, res, next) => {
  Passport.authenticate("github", (err, user, info) => {
    console.log("@ [github] callback")
    if (err) return next(err)
    // if (!user) { -- this case is impossible (I guess)
    //   res.status(401)
    //   return res.send({message: "Wrong credentials"})
    // }
    req.logIn(user, (err) => {
      res.redirect("/account")
    })
  })(req, res, next)
})

module.exports = router
