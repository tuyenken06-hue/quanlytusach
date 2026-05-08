const express = require("express");
const router = express.Router();
const bookController = require('../controllers/bookController');

// Lấy danh sách sách
router.get("/", bookController.getBooks);

// Xử lý thêm sách mới
router.post("/add", bookController.addBook);

// Xử lý cập nhật thông tin sách
router.post("/edit/:id", bookController.updateBook);

// Xử lý xóa sách khỏi kệ
router.post("/delete/:id", bookController.deleteBook);

router.get("/read/:id", bookController.readBook);

router.get("/profile", bookController.getProfile);
router.post("/buy/:id", bookController.buyBook);

router.get('/new', bookController.getNewBooksPage);
router.post('/update-status/:id', bookController.updateStatus);
module.exports = router;