const express = require("express");
const router = express.Router();
const authController = require('../controllers/authcontroller');

router.get("/register", (req, res) => {
    res.render("register", { errors: {}, oldData: {} });
});

router.get("/login", (req, res) => {
    res.render("login", { errors: {}, oldData: {} });
}); 

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get('/profile', authController.getProfile);

module.exports = router;