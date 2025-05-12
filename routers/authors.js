const express = require('express');
const router = express.Router();
const Author = require('../models/author');

// Route hiển thị trang quản lý tác giả
router.get('/manage-authors', async (req, res) => {
    try {
        const authors = await Author.find();  
        res.render('manage-authors', { authors });  
    } catch (error) {
        res.status(500).send("Lỗi khi lấy danh sách tác giả.");
    }
});

// Hiển thị trang thêm tác giả
router.get('/add-author', (req, res) => {
    res.render('add-author', { message: null });
});

// Thêm tác giả
router.post('/add-author', async (req, res) => {
    try {
        console.log("Dữ liệu nhận được:", req.body);

        const { name, biography } = req.body;

        if (!name || !biography) {
            return res.status(400).send("Vui lòng nhập đầy đủ thông tin.");
        }

        const newAuthor = new Author({ name, biography });
        await newAuthor.save();
        res.redirect('/add-author?message=Thêm tác giả thành công');
    } catch (error) {
        console.error("Lỗi thêm tác giả:", error);
        res.status(500).send("Lỗi thêm tác giả: " + error.message);
    }
});

// Xóa tác giả
router.get('/delete-author/:id', async (req, res) => {
    try {
        await Author.findByIdAndDelete(req.params.id);
        res.redirect('/manage-authors');
    } catch (error) {
        res.status(500).send("Lỗi xóa tác giả.");
    }
});

// Cập nhật tác giả
router.post('/edit-author/:id', async (req, res) => {
    try {
        await Author.findByIdAndUpdate(req.params.id, { name: req.body.name });
        res.redirect('/manage-authors');
    } catch (error) {
        res.status(500).send("Lỗi cập nhật tác giả.");
    }
});

module.exports = router;
