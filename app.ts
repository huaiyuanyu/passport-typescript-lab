import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import path from "path";
import passportMiddleware from './middleware/passportMiddleware';

const port = process.env.port || 8000;

const app = express();

//usually would be using middleware functions that others would make for you
//middleware functions just take req, res, and next
app.set("view engine", "ejs");
//as an example of a middleware function...
//if you use app.use, this function will run no matter what. Every single incoming request runs through app.use functions.
//this is also why we store sessions inside app.use.
//thus, app.use is known as 'global middleware'
app.use(function(req, res, next){
  console.log("Received request from browser: " + req.url);
  //next is what you use to tell the function to just move on. If you don't explicitly call the next command, express will not move on from this function. You have to do this because sometimes, you might NOT want to automatically move on.
  next();
})

app.use(express.static(path.join(__dirname, "public")));
//passportMiddleware(app) needs to have the server be configured with session before the middleware can be used
//that's why you need app.use(session({})) to be written before the passportMiddleware(app is there)
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

import authRoute from "./routes/authRoute";
import indexRoute from "./routes/indexRoute";

// Middleware for express
app.use(express.json());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
passportMiddleware(app);

//this is basically just used for some console.logging
app.use((req, res, next) => {
  console.log(`User details are: `);
  console.log(req.user);

  console.log("Entire session object:");
  console.log(req.session);

  console.log(`Session details are: `);
  console.log((req.session as any).passport);
  next();
});

//second use case of app.use is when you want to set up a router.
//this means you can fundamentally dodge having to do a ton of app.gets and app.posts
app.use("/", indexRoute);

/*
The smart thing to do is to give them all a common 'starting' route.

app.get("/auth/login")
app.get("/auth/logout")
app.get("/auth/forgotPassword")
app.get("/auth/register")

app.post("/auth/login")
app.post("/auth/logout")
app.post("/auth/forgotPassword")
app.post("/auth/register")

*/

//this app.use basically says that if any route starts with /auth, send it to this separate file called authRoute. This is where the logic is actually handled.
//however, only the part that is non-generic (e.g /login, /logout) is sent to authRoute.ts
app.use("/auth", authRoute);

app.listen(port, () => {
  console.log(`🚀 Server has started on port ${port}`);
});
