require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bookRoutes = require('./routers/bookRoutes');
const authorRoutes = require('./routers/authors');
const genreRoutes = require('./routers/genres');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

// Cấu hình view engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));

app.use(express.urlencoded({ extended: true }));  // Xử lý form-data
app.use(express.json());  // Xử lý JSON

// Sử dụng routes từ file riêng
app.use(authorRoutes);
app.use(genreRoutes);
app.use('/', bookRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server chạy trên cổng ${PORT}`);
    });
});
