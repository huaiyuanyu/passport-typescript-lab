import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmailIdAndPassword, getUserById} from "../../controllers/userController";
import { PassportStrategy } from '../../interfaces/index';

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const user = getUserByEmailIdAndPassword(email, password);

    if(user === "email") {
      done(null, false, {
        message: `No user found with email: ${email}`,
      })
    } else if(user) {
      done(null, user)
    } else {
      done(null, false, {
        message: "Your password is invalid."
      })
    }
  }
);


passport.serializeUser(function (user: Express.User, done: (err: any, id?: number) => void) {
  done(null, (user as any).id);
});
//easiest way to figure out how to type the function is via ctrl + click

passport.deserializeUser(function (id: string, done: (err: any, user?: Express.User | false | null) => void) {
  let user = getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

const passportLocalStrategy: PassportStrategy = {
  name: 'local',
  strategy: localStrategy,
};

export default passportLocalStrategy;
