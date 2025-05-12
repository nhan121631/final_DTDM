const mongoose = require('mongoose');
const Author = require('./author');
const TypeBook = require('./typebooks');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    genre: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeBook', required: true },
    year: { type: Number, required: true },
    coverImage: { type: String, required: true },
    description: { type: String, required: true }
});

module.exports = mongoose.model('Book', bookSchema);
