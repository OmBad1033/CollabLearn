import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { User } from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

passport.serializeUser((user, done) => {
    console.log("serializing user using id:", user.id)
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
        console.log("deserializing user using id:",id)

		const findUser = await User.findById(id);
		return findUser ? done(null, findUser) : done(null, null);
	} catch (err) {
		done(err, null);
	}
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile)
        let user = await User.findOneAndUpdate({ googleId: profile.id });
        if(!user)
        {
            user = await User.create({
                googleId: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0].value,

            })
        }
        console.log("USer:",user)
        return done(null,user)
      } catch (error) {
        console.log(error);
        done(error,null)
      }
    }
  )
);
