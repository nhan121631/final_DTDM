const mongoose = require('mongoose');

const typebookSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

module.exports = mongoose.model('TypeBook', typebookSchema);
