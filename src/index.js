const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();


app.use(session({
    secret: 'tuyen_secret_key', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null; 
    next();
});

//Middleware kiểm tra đăng nhập
const requireAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

app.use(express.static(path.join(__dirname, "public")))
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json())
app.use(express.urlencoded({ extended: true}));


app.get("/", (req,res) => {
    res.render("home");
});

const authRouter = require("./routes/authRouter");
app.use("/", authRouter)

//Phải đi qua requireAuth mới vào được
const bookRouter = require("./routes/bookRoutes");
app.use("/books", requireAuth, bookRouter); 

// Kết nối Cơ sở dữ liệu
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/quanlytusach")
.then(() => {
    console.log("Mogodb success");
})
.catch((err) => {
    console.log(err)
})

module.exports = app;