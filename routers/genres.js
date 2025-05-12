const express = require('express');
const router = express.Router();
const TypeBook = require('../models/typebooks');

// Route hiển thị trang quản lý thể loại
router.get('/manage-genres', async (req, res) => {
    try {
        const genres = await TypeBook.find();  
        res.render('manage-genres', { genres });  
    } catch (error) {
        res.status(500).send("Lỗi khi lấy danh sách thể loại.");
    }
});

router.get('/add-genre', (req, res) => {
    res.render('add-genre', { message: null });
});

// Thêm thể loại
router.post('/add-genre', async (req, res) => {
    try {
        const newGenre = new TypeBook({ name: req.body.name });
        await newGenre.save();
        res.redirect('/manage-genres');
    } catch (error) {
        res.status(500).send("Lỗi thêm thể loại.");
    }
});

// Xóa thể loại
router.get('/delete-genre/:id', async (req, res) => {
    try {
        await TypeBook.findByIdAndDelete(req.params.id);
        res.redirect('/manage-genres');
    } catch (error) {
        res.status(500).send("Lỗi xóa thể loại.");
    }
});

// Cập nhật thể loại
router.post('/edit-genre/:id', async (req, res) => {
    try {
        await TypeBook.findByIdAndUpdate(req.params.id, { name: req.body.name });
        res.redirect('/manage-genres');
    } catch (error) {
        res.status(500).send("Lỗi cập nhật thể loại.");
    }
});

module.exports = router;
