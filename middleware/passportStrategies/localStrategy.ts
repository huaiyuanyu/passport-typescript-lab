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
    return user
    //? and : are basically a shorter version of if-else, while the 'return user' is the boolean statement that controls the ? and :
    //the done as well is basically a callback that works similarly to (err,data)
      ? done(null, user)
      : done(null, false, {
          message: "Your login details are not valid. Please try again",
        });
  }
);

/*
FIX ME (types) 😭
*/
//this function is what is used to create a new session for the user
//you want to store one thing inside the session. In this case, it's the user.id from the fake-db which you got through the whole getUserByEmailAndPassword() that you used before.
//also, what it does is take your req.user and make it equal to user.
//now, you can call up req.user whenever you want and query all the information from req.user
passport.serializeUser(function (user: any, done: any) {
  done(null, user.id);
});

/*
FIX ME (types) 😭
*/
//receives the user id that you placed inside the session object
//when you take the user and place it in the done(), it updates req.user to have the correct user.
//this runs before any of your other request run AFTER a user gets into a session, and it guarantees that we always have the most up-to-date user info for the user
//fundamentally counteracts the "stale session" problem where req.user is out of date with consideration to what info is inside the server's database
passport.deserializeUser(function (id: any, done: any) {
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
