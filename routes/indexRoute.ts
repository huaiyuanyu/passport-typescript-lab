import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";

router.get("/", (req, res) => {
  res.send("welcome");
});

//req.user only exists because serializedUser from localStrategy created this.
//NOW, you pass req.user into the res.render as a variable user, which is what is being used in the dashboard.ejs page
//furthermore, before anything else runs to render it...there's the middleware of ensureAuthenticated
//this middleware verifies if they have a session running by running the req.isAuthenticated thing and seeing if it's true or not
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

router.get("/admin", ensureAuthenticated, (req, res) => {
  if((req.user as any).role === "admin") {
    res.render("admin", {
      user: req.user,
    })
  } else {
    res.redirect("/dashboard");
  }
} )

export default router;
