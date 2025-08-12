const express = require("express")
const session = require("express-session")
const pgSession = require("connect-pg-simple")(session)
const pool = require("./database")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const flash = require("connect-flash")
const messages = require("express-messages")

const app = express()

// ✅ Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// ✅ Session Middleware
app.use(session({
  store: new pgSession({
    pool,
    tableName: "session",
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: "sessionId",
  cookie: {
    maxAge: 1000 * 60 * 60 * 2, // 2 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  }
}))

// ✅ JWT Login State Middleware (fixed)
app.use((req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      res.locals.loggedIn = true
      res.locals.accountData = decoded
      res.locals.accountFirstName = decoded.account_firstname
      res.locals.accountType = decoded.account_type
      res.locals.accountId = decoded.account_id
    } catch (err) {
      console.error("JWT verification failed:", err)
      res.clearCookie("jwt")
      res.locals.loggedIn = false
      res.locals.accountFirstName = null
      res.locals.accountData = null
    }
  } else {
    res.locals.loggedIn = false
    res.locals.accountFirstName = null
    res.locals.accountData = null
  }
  next()
})

// ✅ Flash Messages
app.use(flash())
app.use((req, res, next) => {
  res.locals.messages = messages(req, res)
  next()
})

// ✅ Utilities Middleware
const utilities = require("./utilities/")
app.use(utilities.checkJWTToken) // Optional: if you use additional JWT checks

// ✅ View Engine
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

// ✅ Routes
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const feedbackRoute = require("./routes/feedbackRoute") // ✅ Added

app.use(static)

app.get("/", utilities.handleErrors(async (req, res) => {
  const nav = await utilities.getNav(res)
  res.render("index", { title: "Home", nav })
}))

app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)
app.use("/account", feedbackRoute) // ✅ Mount feedback routes under /account

app.get("/error", utilities.handleErrors(async (req, res) => {
  throw new Error("This is an intentional error for testing purposes")
}))

// ✅ 404 Handler
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

// ✅ Global Error Handler
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav(res)
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  const message = err.status === 404
    ? err.message
    : "Oh no! There was a crash. Maybe try a different route?"

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
    error: err,
  })
})

// ✅ Server Info
const port = process.env.PORT
const host = process.env.HOST

app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`)
})