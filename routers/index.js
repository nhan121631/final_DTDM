// Route quản lý tác giả
router.get('/manage-authors', async (req, res) => {
    try {
        const authors = await Author.find(); // Lấy danh sách tác giả
        res.render('manage-authors', { authors });
    } catch (error) {
        res.status(500).send("Lỗi tải danh sách tác giả.");
    }
});

// Route quản lý thể loại
router.get('/manage-genres', async (req, res) => {
    try {
        const genres = await TypeBook.find(); // Lấy danh sách thể loại
        res.render('manage-genres', { genres });
    } catch (error) {
        res.status(500).send("Lỗi tải danh sách thể loại.");
    }
});
