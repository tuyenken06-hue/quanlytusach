const express = require("express");
const router = express.Router();
const bookController = require('../controllers/bookController');


router.get("/", bookController.getBooks);


router.post("/add", bookController.addBook);


router.post("/edit/:id", bookController.updateBook);


router.post("/delete/:id", bookController.deleteBook);

router.get("/read/:id", bookController.readBook);

router.post("/buy/:id", bookController.buyBook);

router.get('/new', bookController.getNewBooksPage);
router.post('/update-status/:id', bookController.updateStatus);
module.exports = router;