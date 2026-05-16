const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');


dotenv.config({ quiet: true });

const app = express();

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'tuyen_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});


app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get("/", (req, res) => {
    res.render("home");
});

const authRouter = require("./routes/authRouter");
app.use("/", authRouter);

const requireAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

const bookRouter = require("./routes/bookRoutes");
app.use("/books", requireAuth, bookRouter);


const errorHandler = require('./middleware/errorHandler');
app.use((req, res, next) => {
    const error = new Error('Trang không tồn tại');
    error.statusCode = 404;
    next(error);
});
app.use(errorHandler);

module.exports = app;