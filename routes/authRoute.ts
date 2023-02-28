import express from "express";
import passport from 'passport';
import { forwardAuthenticated } from "../middleware/checkAuth";

//this fulfills the functionality of 'app', which we can't use again.
//that's why instead of const router = express(), we use const router = express.Router()
const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {
  let messages:string[] | null = null;
  if((req.session as any).messages) {
    messages = (req.session as any).messages;
    (req.session as any).messages = null;
  }
  console.log(messages);
  res.render("login", {failureMsg: messages});
})

//authenticate is fundamentally going to serve as a 'local middleware' function
//its a function that lives inside a route and runs in the middle (e.g before you send in a response)
//in this case, before the entire router.post runs, passport.authenticate runs first, to wait for the function to confirm if someone exists/has valid credentials in the e-mail + password room.
//after it finishes authenticating, it'll perform a next() and then move you to the next stage
//this middleware can also handled the req,res callback after it completes its authentication.
//as well, "local" tells authenticate which specific process to use. To give it some perspective, if "local" became "twitter", passport would be communicating with Twitter's database instead.
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true,
    //can get that message from req.session.messages
    //typescript doesn't recognize .messages though, so you need to do something like...
    //(req.session as any).messages

  })
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

router.get('/github',
  passport.authenticate('github', { scope: [ 'user:email' ] })
);

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    console.log("congratulations!")
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
});

export default router;
