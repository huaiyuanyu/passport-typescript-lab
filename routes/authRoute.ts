import express from "express";
import passport from 'passport';
import { forwardAuthenticated } from "../middleware/checkAuth";

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

export default router;
