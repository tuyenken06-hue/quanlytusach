const Book = require('../models/Book');
const User = require('../models/User'); 


exports.getBooks = async (req, res) => {
    try {
        const { category, status } = req.query; 
        
        let filter = {};
        let activeFilter = 'All';

        if (category && category !== 'All') {
            filter.category = category; 
            activeFilter = category;
        } 
        else if (status && status !== 'All') {
            filter.status = status;
            activeFilter = status;
        }

        const books = await Book.find(filter);
        const user = req.session.user;

        res.render("bookcase", {
            books: books,
            currentFilter: activeFilter,
            user: user,
            isAdmin: user && user.username === 'tuyenken06@gmail.com'
        });
    } catch (err) {
        console.error("Lỗi lọc sách:", err);
        res.status(500).send("Lỗi hệ thống");
    }
};

// Xử lý thêm sách mới (Admin - Đã thêm Category)
exports.addBook = async (req, res) => {
    try {
        const { title, author, publishYear, status, price, category } = req.body;

        const newBook = new Book({
            title,
            author,
            publishYear,
            price, 
            status,
            category 
        });

        await newBook.save();
        console.log("Thành công: Một cuốn sách mới đã được thêm vào kệ!");
        res.redirect("/books");
    } catch (err) {
        console.error("Lỗi khi thêm sách:", err);
        res.status(500).send("Chúng tôi không thể lưu cuốn sách này lúc này.");
    }
};

// Xử lý cập nhật thông tin sách (Admin - Đã thêm Category)
exports.updateBook = async (req, res) => {
    try {
        const { title, author, publishYear, status, price, category } = req.body;
        
        await Book.findByIdAndUpdate(req.params.id, {
            title,
            author,
            publishYear,
            price, 
            status,
            category 
        });

        console.log("Thành công: Đã cập nhật thông tin sách!");
        res.redirect("/books");
    } catch (err) {
        console.error("Lỗi khi cập nhật sách:", err);
        res.status(500).send("Lỗi khi cập nhật thông tin sách.");
    }
};


exports.deleteBook = async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.redirect("/books");
    } catch (err) {
        res.status(500).send("Lỗi khi xóa sách.");
    }
};

exports.readBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).send("Không tìm thấy sách.");
        res.render("read", { title: `Đang đọc: ${book.title}`, book: book });
    } catch (err) {
        res.status(500).send("Lỗi hệ thống.");
    }
};

exports.buyBook = async (req, res) => {
    try {
        if (!req.session.user) return res.redirect("/login");
        const userId = req.session.user.id;
        await User.findByIdAndUpdate(userId, { $addToSet: { purchasedBooks: req.params.id } });
        res.redirect("/books/profile");
    } catch (err) {
        res.status(500).send("Lỗi khi thực hiện giao dịch.");
    }
};

exports.getProfile = async (req, res) => {
    try {
        if (!req.session.user) return res.redirect("/login");
        const userId = req.session.user.id;
        const userData = await User.findById(userId).populate('purchasedBooks');
        res.render("profile", {
            title: "Trang cá nhân của tôi",
            user: userData,
            books: userData.purchasedBooks,
            isAdmin: userData.username === 'tuyenken06@gmail.com'
        });
    } catch (err) {
        res.status(500).send("Lỗi hệ thống.");
    }
};

exports.getNewBooksPage = async (req, res) => {
    try {
        const latestBooks = await Book.find()
            .sort({ createdAt: -1 }) 
            .limit(10);

        res.render("new_books", { 
            books: latestBooks, 
            isAdmin: req.session.user && req.session.user.username === 'tuyenken06@gmail.com'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
};

exports.updateStatus = async (req, res) => {
    try {
        await Book.findByIdAndUpdate(req.params.id, { 
            status: req.body.status 
        });
        res.redirect('/books');    
    } catch (err) {
        console.error(err);
        res.status(500).send("Không thể cập nhật trạng thái sách.");
    }
};