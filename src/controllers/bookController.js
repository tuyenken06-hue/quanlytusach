const Book = require('../models/Book');
const User = require('../models/User');


exports.getBooks = async (req, res, next) => {
    try {
        const { category, status, search } = req.query;

        
        const page = parseInt(req.query.page) || 1;
        const perPage = 8;

        let filter = {};
        let activeFilter = 'All';
        let searchTerm = '';

        
        if (search && search.trim() !== '') {
            searchTerm = search.trim();
            filter.$or = [
                { title: { $regex: searchTerm, $options: 'i' } },
                { author: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        if (category && category !== 'All') {
            filter.category = category;
            activeFilter = category;
        } else if (status && status !== 'All') {
            filter.status = status;
            activeFilter = status;
        }

        const totalBooks = await Book.countDocuments(filter);

        const books = await Book.find(filter)
            .sort({ createdAt: -1 })
            .skip((perPage * page) - perPage)
            .limit(perPage);

        const user = req.session.user;

        res.render("bookcase", {
            books,
            currentFilter: activeFilter,
            user,
            isAdmin: user && user.username === 'tuyenken06@gmail.com',
            search: searchTerm,
            currentPage: page,
            totalPages: Math.ceil(totalBooks / perPage)
        });
    } catch (err) {
        console.error("Lỗi lọc sách:", err);
        next(err);                   
    }
};

exports.addBook = async (req, res, next) => {
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
        next(err);
    }
};

exports.updateBook = async (req, res, next) => {
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
        next(err);
    }
};

exports.deleteBook = async (req, res, next) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.redirect("/books");
    } catch (err) {
        console.error("Lỗi khi xóa sách:", err);
        next(err);
    }
};

exports.readBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            const error = new Error('Không tìm thấy sách');
            error.statusCode = 404;
            throw error;
        }

        res.render("read", { 
            title: `Đang đọc: ${book.title}`, 
            book 
        });
    } catch (err) {
        next(err);
    }
};

exports.buyBook = async (req, res, next) => {
    try {
        if (!req.session.user) {
            return res.redirect("/login");
        }

        const userId = req.session.user.id;
        await User.findByIdAndUpdate(userId, {
            $addToSet: { purchasedBooks: req.params.id }
        });

        res.redirect("/books/profile");
    } catch (err) {
        console.error("Lỗi khi mua sách:", err);
        next(err);
    }
};

exports.getProfile = async (req, res, next) => {
    try {
        if (!req.session.user) {
            return res.redirect("/login");
        }

        const userId = req.session.user.id;
        const userData = await User.findById(userId).populate('purchasedBooks');

        res.render("profile", {
            title: "Trang cá nhân của tôi",
            user: userData,
            books: userData.purchasedBooks,
            isAdmin: userData.username === 'tuyenken06@gmail.com'
        });
    } catch (err) {
        console.error("Lỗi lấy profile:", err);
        next(err);
    }
};

exports.getNewBooksPage = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 8;

        const totalBooks = await Book.countDocuments();
        const latestBooks = await Book.find()
            .sort({ createdAt: -1 })
            .skip((perPage * page) - perPage)
            .limit(perPage);

        res.render("new_books", {
            books: latestBooks,
            isAdmin: req.session.user && req.session.user.username === 'tuyenken06@gmail.com',
            currentPage: page,
            totalPages: Math.ceil(totalBooks / perPage)
        });
    } catch (err) {
        console.error("Lỗi lấy sách mới:", err);
        next(err);
    }
};

exports.updateStatus = async (req, res, next) => {
    try {
        await Book.findByIdAndUpdate(req.params.id, { 
            status: req.body.status 
        });
        res.redirect('/books');
    } catch (err) {
        console.error("Lỗi cập nhật trạng thái:", err);
        next(err);
    }
};