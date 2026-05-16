const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { registerSchema, loginSchema } = require("../helpers/joiHelper");

exports.register = async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body, { abortEarly: false });

        if (error) {
            let errors = {};
            error.details.forEach((detail) => {
                errors[detail.path[0]] = detail.message;
            });
            return res.render("register", { errors, oldData: req.body });
        }

        const { email, password } = req.body;

        const existingUser = await User.findOne({ username: email });

        if (existingUser) {
            return res.render("register", {
                errors: { email: "Email đã tồn tại" },
                oldData: req.body
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = new User({
            username: email,
            password: hash
        });

        await user.save();

        return res.redirect("/login");

    } catch (err) {
        return res.render("register", {
            errors: { general: "Lỗi server" }
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body, { abortEarly: false });

        if (error) {
            let errors = {};
            error.details.forEach((detail) => {
                errors[detail.path[0]] = detail.message;
            });
            return res.render("login", { errors, oldData: req.body });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ username: email });

        if (!user) {
            return res.render("login", {
                errors: { email: "Tài khoản không tồn tại" },
                oldData: req.body
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render("login", {
                errors: { password: "Sai mật khẩu" },
                oldData: req.body
            });
        }
        req.session.user = {
            id: user._id,
            username: user.username 
        };
        return res.redirect("/books");

    } catch (err) {
        return res.render("login", {
            errors: { general: "Lỗi server" }
        });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.redirect('/');
        }
        res.clearCookie('connect.sid'); 
        res.redirect('/'); 
    });
};

exports.getProfile = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect("/login");
        }

        const userId = req.session.user.id;
        const userData = await User.findById(userId).populate('purchasedBooks');

        res.render("profile", {
            title: "Hồ sơ của tôi",
            user: userData,
            books: userData.purchasedBooks || [],
            isAdmin: userData.username === 'tuyenken06@gmail.com'
        });
    } catch (err) {
        console.error("Lỗi khi lấy hồ sơ:", err);
        res.status(500).send("Lỗi hệ thống.");
    }
};