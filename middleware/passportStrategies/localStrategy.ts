import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmailIdAndPassword, getUserById} from "../../controllers/userController";
import { PassportStrategy } from '../../interfaces/index';

//whenever you want to log in someone with a different strategy, you need to specify that strategy and then download it
//in this case, you needed to npm install "passport-local"
//in other cases, you may be getting "passport-twitter" instead

//LocalStrategy is a class
const localStrategy = new LocalStrategy(
  {
    //here, you are renaming usernameField as email and passwordField as password
    //that's why down below, you are able to then use email and password as variables
    usernameField: "email",
    passwordField: "password",
  },
  //this overwrites the normal functioning of LocalStrategy
  //here, req.body.email is passed into email. The same is done for password.
  //by default though, local uses usernames. Thus, you need to feed a specific function into user in order to correctly format it for usage. That's what the getUserByEmailAndPassword() is for.
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
//you export passportLocalStrategy so that you can import it into passportMiddleware.ts
//from inside there, you need to add passportLocalStrategy into passportConfig.addStrategies()
//also to note: github and basically every other login system will give you the user id, so deserializedUser basically always works
export default passportLocalStrategy;
