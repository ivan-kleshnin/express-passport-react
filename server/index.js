let FS = require("fs")
let Express = require("express")
let HTTP = require("http")
let Passport = require("passport")
let Path = require("path")
let CookieSession = require("cookie-session")
let BodyParser = require("body-parser")
let CookieParser = require("cookie-parser")
let {Strategy: LocalStrategy} = require("passport-local")
let R = require("@paqmind/ramda")
let {guest, makeUser} = require("../common/models")
let db = require("../db")

function findByEmail(email, users) {
  return R.find(user => user.email == email, R.values(users))
}

function findByCredentials(email, password, users) {
  return R.find(user => user.email == email && user.password == password, R.values(users))
}

Passport.use(new LocalStrategy({
    usernameField: "email",
  },
  function (email, password, next) {
    console.log("@ verifyCredentials")
    let user = findByCredentials(email, password, db.users)
    if (user) {
      next(null, user)
    } else {
      next(null, false)
    }
  }))

Passport.serializeUser((user, next) => {
  console.log("@ serializeUser")
  next(null, user.id)
})

Passport.deserializeUser((id, next) => {
  console.log("@ deserializeUser")
  if (db.users[id]) next(null, db.users[id])
  else              next(null, guest)
})

let app = Express()

app.use(BodyParser.urlencoded({
  extended: true
}))

app.use(BodyParser.json({}))

app.use(CookieParser())

app.use(CookieSession({
  name: "session",
  secret: "_preambula_",
  // Cookie Options
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days,
  secure: false,  // todo investigate later
  httpOnly: true,
  signed: true,
}))

app.use(Passport.initialize())
app.use(Passport.session())

let unless = (paths, middleware) => {
  return (req, res, next) => {
    if (paths.find(path => path.test(req.path))) {
      return next()
    } else {
      return middleware(req, res, next)
    }
  }
}

app.post("/api/sign-in", (req, res, next) => {
  console.log("@ signIn")
  Passport.authenticate("local", (err, user, info) => {
    if (err)   return next(err)
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

app.post("/api/sign-up",
  (req, res, next) => {
    console.log("@ signUp")
    let user = makeUser(req.body)
    if (db.users[user.id]) {
      res.status(409)
      return res.send({message: "Duplicate id"})
    }
    if (findByEmail(user.email, db.users)) {
      res.status(409)
      return res.send({message: "Duplicate email"})
    }
    let users = R.merge(db.users, {[user.id]: user})
    FS.writeFile("./db/users.json", JSON.stringify(users, null, 2), "utf-8", (err, data) => {
      if (err) next(err)
      return res.send(user)
    })
  })

app.get("/api/sign-out",
  (req, res) => {
    req.logout()
    res.redirect("/")
  })

app.get("*",
  unless([/^\/public/, /^\/favicon/, /^\/api/], (req, res, next) => {
    FS.readFile("./server/layout.html", "utf-8", (err, data) => {
      if (err) next(err)
      res.send(data)
    })
  }))

// Static handler
app.use("/public", Express.static(Path.resolve(__dirname, "../public")))

// 404 handler
app.use((req, res, next) => {
  res.status(404)
  res.send(HTTP.STATUS_CODES[404])
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err) // Log 5xx errors
  res.status(500)
  res.send(HTTP.STATUS_CODES[500])
})

app.listen(3000)
