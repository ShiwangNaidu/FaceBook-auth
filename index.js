const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const facebookStrategy = require("passport-facebook").Strategy;
const dotenv = require("dotenv");
dotenv.config();
app.set("view engine", "ejs");
app.use(
  session({
    secret: "thisissecret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new facebookStrategy(
    {
      clientID: "477113983794452",
      clientSecret: "79046ff5067c05105c6c2d4611339387",
      callbackURL: "http://localhost:8080/facebook/callback",
      profileFields: ["id", "name"],
    },
    function (token, refreshToken, profile, done) {
      console.log(profile);
      return done(null, profile);
    }
  )
);
function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}
app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
);

app.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/failed",
  })
);

app.get("/profile", isLoggedIn, (req, res) => {
  res.send("Valid User");
});

app.get("/failed", (req, res) => {
  res.send("InValid User");
});

app.get("/", (req, res) => {
  res.render("index.ejs");
});

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
