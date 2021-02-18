const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

// 1ère manière (en utilisant les promises => async/await )

// passport.use(
//   new BearerStrategy(async (token, done) => {
//     const tokenData = await jwt.verify(token, 'secret');
//     const user = await User.findOne({ _id: tokenData.userId });
//     if (!user) {
//       return done(null, false);
//     } else {
//       return done(null, user);
//     }
//   })
// );


// 2ème manière ( en utilisant les callback functions)
// méthode utilisé dans la documentation : https://www.npmjs.com/package/passport-http-bearer
passport.use(new BearerStrategy(async(token, done) => {
   const decodedData = await jwt.verify(token, 'secret');
   console.log(decodedData);
    User.findOne({ _id: decodedData.userId }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'all' });
    });
  }
));