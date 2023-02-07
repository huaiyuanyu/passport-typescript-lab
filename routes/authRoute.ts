import express from "express";
import passport from 'passport';
import { forwardAuthenticated } from "../middleware/checkAuth";

//this fulfills the functionality of 'app', which we can't use again.
//that's why instead of const router = express(), we use const router = express.Router()
const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login");
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
    /* FIX ME: 😭 failureMsg needed when login fails */
  })
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

export default router;
