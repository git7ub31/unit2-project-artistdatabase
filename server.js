const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");

const port = process.env.PORT ? process.env.PORT : "3000";
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

const authController = require("./controllers/auth.js");
const portfoliosController = require("./controllers/portfolios");

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan('dev'));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passUserToView);

app.use(express.static('public')); 

app.get("/", async (req,res)=> {
    res.render("index.ejs", {
        user: req.session.user,
    });
});

app.use("/auth", authController);
app.use('/portfolios', isSignedIn, portfoliosController);

app.get("/artist-profile", (req,res) => {
    if(req.session.user){
        res.send(`Welcome to your profile, ${req.session.user.username}.`);
    }else {
        res.send("In order to build your profile, you must first create an account or sign in.")
    }
});

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
