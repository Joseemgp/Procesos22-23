const passport=require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
  //console.log(user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  //User.findById(id, function(err, user) {
    done(null, user);
  //});
});

passport.use(new GoogleStrategy({
    clientID:"753383608337-v990qfs4f4oj3ktllrgqn8an0o4qb1bb.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:5000/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    //User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return done(null, profile);
    //});
  }
));
