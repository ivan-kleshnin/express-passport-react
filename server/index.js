let FS = require("fs")
let Express = require("express")
let HTTP = require("http")
let Passport = require("passport")
let Path = require("path")
let CookieSession = require("cookie-session")
let BodyParser = require("body-parser")
let CookieParser = require("cookie-parser")
let {Strategy: LocalStrategy} = require("passport-local")
let {Strategy: GitHubStrategy} = require("passport-github")
let R = require("@paqmind/ramda")
let {guest, makeUser} = require("../common/models")
let db = require("../db")
let {renderLayout} = require("./templates")

function findByEmail(email, users) {
  return R.find(user => user.email == email, R.values(users))
}

function findByCredentials(email, password, users) {
  return R.find(user => user.email == email && user.password == password, R.values(users))
}

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
      console.log("-- generated user:", user)
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

let app = Express()

// Static handler
app.use("/public", Express.static(Path.resolve(__dirname, "../public")))

app.use(BodyParser.urlencoded({
  extended: true
}))

app.use(BodyParser.json({}))

app.use(CookieParser())

app.use(CookieSession({
  name: "session",
  secret: "_preambula_",
  // Cookie options
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true,
  signed: true,
}))

app.use(Passport.initialize())
app.use(Passport.session())

// Local Auth --------------------------------------------------------------------------------------
// TODO validation
app.post("/auth/local/sign-in", (req, res, next) => {
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
app.post("/auth/local/sign-up", (req, res, next) => {
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

app.post("/auth/sign-out", (req, res) => {
  console.log("@ [local] signOut")
  req.logout()
  res.status(200)
  res.send({me: guest})
})

// GitHub auth -------------------------------------------------------------------------------------
app.get("/auth/github", Passport.authenticate("github"))

app.get("/auth/github/callback", (req, res, next) => {
  Passport.authenticate("github", (err, user, info) => {
    console.log("@ [github] callback")
    console.log("req.session:", req.session)
    console.log("req.user:", req.user)
    console.log("-- user:", user)
    console.log("-- info:", info)
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

// Bootstrap client app ----------------------------------------------------------------------------
app.get("*", (req, res, next) => {
  console.log("@ app endpoint", req.url)
  res.status(200)
  res.send(renderLayout({me: req.user}))
})

// 404 handler
app.use((req, res, next) => {
  res.status(404)
  res.send({message: HTTP.STATUS_CODES[404]})
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err) // Log 5xx errors
  res.status(500)
  res.send({message: HTTP.STATUS_CODES[500]})
})

app.listen(8080)
