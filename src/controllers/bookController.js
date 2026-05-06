const Book = require('../models/Book');

// 1. Lấy danh sách sách và hiển thị giao diện
exports.getBooks = async (req, res) => {
    try {
        const { status } = req.query; 
        let filter = {};
        
        if (status) {
            filter.status = status;
        }

        const books = await Book.find(filter);

        res.render("bookcase", {
            books: books, 
            currentFilter: status || "All" 
        });
    } catch (err) {
        console.error("Lỗi khi tải tủ sách:", err); 
        res.status(500).send("Lỗi khi tải tủ sách");
    }
};

// 2. Xử lý thêm sách mới
exports.addBook = async (req, res) => {
    try {
        const { title, author, publishYear, status } = req.body;

        const newBook = new Book({
            title,
            author,
            publishYear,
            status
        });

        await newBook.save();
        console.log("Thành công: Một cuốn sách mới đã được thêm vào kệ!");
        res.redirect("/books");
    } catch (err) {
        console.error("Lỗi khi thêm sách:", err);
        res.status(500).send("Chúng tôi không thể lưu cuốn sách này lúc này.");
    }
};

// 3. Xử lý cập nhật thông tin sách
exports.updateBook = async (req, res) => {
    try {
        const { title, author, publishYear, status } = req.body;
        
        await Book.findByIdAndUpdate(req.params.id, {
            title,
            author,
            publishYear,
            status
        });

        console.log("Thành công: Đã cập nhật thông tin sách!");
        res.redirect("/books");
    } catch (err) {
        console.error("Lỗi khi cập nhật sách:", err);
        res.status(500).send("Lỗi khi cập nhật thông tin sách.");
    }
};

// 4. Xử lý xóa sách khỏi kệ
exports.deleteBook = async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        console.log("Thành công: Đã xóa sách khỏi kệ!");
        res.redirect("/books");
    } catch (err) {
        console.error("Lỗi khi xóa sách:", err);
        res.status(500).send("Lỗi khi xóa sách.");
    }
};