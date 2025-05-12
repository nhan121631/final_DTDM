const express = require('express');
const router = express.Router();
const Book = require('../models/books');
const TypeBook = require('../models/typebooks');
const Author = require('../models/author');

// Route hiển thị trang quản lý thể loại
router.get('/manage-genres', async (req, res) => {
    try {
        const authors = await Author.find();  
        res.render('manage-authors', { authors });  
    } catch (error) {
        res.status(500).send("Lỗi khi lấy danh sách tác giả.");
    }
});

// Route hiển thị danh sách sách
router.get('/', async (req, res) => {
    try {
        const searchQuery = req.query.search || '';
        const skip = parseInt(req.query.skip) || 0; // Lấy giá trị skip từ query hoặc mặc định 0
        const limit = 8; // Hiển thị 8 sách mỗi lần

        // Tìm sách theo tiêu đề có chứa `searchQuery`, hỗ trợ phân trang
        const books = await Book.find({ title: new RegExp(searchQuery, 'i') })
            .populate('author')  // Populate tác giả
            .populate('genre')   // Populate thể loại
            .skip(skip)          // Bỏ qua số lượng sách đã hiển thị
            .limit(limit);       // Giới hạn số sách hiển thị mỗi lần

        // Đếm tổng số sách để kiểm tra còn sách để hiển thị không
        const totalBooks = await Book.countDocuments({ title: new RegExp(searchQuery, 'i') });

        res.render('index', {
            books,
            searchQuery,
            skip,
            totalBooks,
            message: req.session.message,
        });

        req.session.message = null; // Xóa thông báo sau khi load trang
    } catch (error) {
        res.status(500).send("Lỗi tải danh sách sách.");
    }
});

// Route hiển thị trang thêm sách
router.get('/add-book', async (req, res) => {
    try {
        const authors = await Author.find(); 
        const genres = await TypeBook.find(); 

        res.render('add-book', { authors, genres });
    } catch (error) {
        res.status(500).send("Lỗi tải trang thêm sách.");
    }
});

// Route thêm sách
router.post('/add-book', async (req, res) => {
    try {
        const { title, authorId, genreId, year, coverImage, description } = req.body;

        // Kiểm tra xem author và genre có tồn tại không
        const author = await Author.findById(authorId);
        const genre = await TypeBook.findById(genreId);
        
        if (!author || !genre) {
            req.session.message = "Tác giả hoặc thể loại không tồn tại!";
            return res.redirect('/add-book');
        }

        // Lưu sách với author và genre dạng ObjectId
        const newBook = new Book({ title, author: author._id, genre: genre._id, year, coverImage, description });

        await newBook.save();
        req.session.message = "Thêm sách thành công!";
        res.redirect('/');
    } catch (error) {
        req.session.message = "Lỗi thêm sách.";
        res.redirect('/');
    }
});


// Route hiển thị chi tiết sách
router.get('/book/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate('author')
            .populate('genre');

        res.render('book-detail', { book });
    } catch (error) {
        res.status(500).send("Lỗi tải chi tiết sách.");
    }
});

// Route hiển thị trang chỉnh sửa sách
router.get('/edit-book/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').populate('genre');
        const authors = await Author.find();
        const genres = await TypeBook.find();

        if (!book) {
            req.session.message = "Không tìm thấy sách!";
            return res.redirect('/');
        }

        res.render('edit-book', { book, authors, genres });
    } catch (error) {
        res.status(500).send("Lỗi khi tải trang chỉnh sửa sách.");
    }
});

// Route cập nhật sách
router.post('/edit-book/:id', async (req, res) => {
    try {
        const { title, authorId, genreId, year, coverImage, description } = req.body;

        // Kiểm tra xem tác giả và thể loại có tồn tại không
        const author = await Author.findById(authorId);
        const genre = await TypeBook.findById(genreId);

        if (!author || !genre) {
            req.session.message = "Tác giả hoặc thể loại không tồn tại!";
            return res.redirect(`/edit-book/${req.params.id}`);
        }

        // Cập nhật sách
        await Book.findByIdAndUpdate(req.params.id, {
            title,
            author: author._id,
            genre: genre._id,
            year,
            coverImage,
            description
        });

        req.session.message = "Cập nhật sách thành công!";
        res.redirect('/');
    } catch (error) {
        req.session.message = "Lỗi khi cập nhật sách!";
        res.redirect('/');
    }
});

// Route xóa sách
router.get('/delete-book/:id', async (req, res) => {
    try {
        const bookId = req.params.id;

        // Xóa sách theo id
        const deletedBook = await Book.findByIdAndDelete(bookId);

        if (!deletedBook) {
            req.session.message = "Không tìm thấy sách để xóa!";
            return res.redirect('/');
        }

        req.session.message = "Xóa sách thành công!";
        res.redirect('/');
    } catch (error) {
        req.session.message = "Lỗi khi xóa sách!";
        res.redirect('/');
    }
});


module.exports = router;
