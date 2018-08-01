let R = require("@paqmind/ramda")
let Express = require("express")
let HTTP = require("http")
let Passport = require("passport")
let Path = require("path")
let CookieSession = require("cookie-session")
let BodyParser = require("body-parser")
let CookieParser = require("cookie-parser")
let db = require("../db")
let {renderLayout} = require("./templates")
let authRouter = require("./auth")

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

app.use(authRouter)

// Bootstrap client app ----------------------------------------------------------------------------
app.get("*", (req, res, next) => {
  console.log("@ app endpoint", req.url)
  res.status(200)
  res.send(renderLayout({me: req.user}))
})

// 404 handler
app.use((req, res, next) => {
  res.status(404)
  res.json({message: HTTP.STATUS_CODES[404]})
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err) // Log 5xx errors
  res.status(500)
  res.json({message: HTTP.STATUS_CODES[500]})
})

app.listen(8080)
