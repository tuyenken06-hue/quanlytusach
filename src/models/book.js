const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Tên sách không được để trống'] 
    },
    author: { 
        type: String, 
        required: [true, 'Tác giả không được để trống'] 
    },
    publishYear: { 
        type: Number 
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        enum: ['Công nghệ', 'Kinh tế', 'Văn học', 'Chưa phân loại'],
        default: 'Chưa phân loại'
    },
    status: { 
        type: String, 
        enum: ['Đang đọc', 'Đã xong', 'Muốn mua'], 
        default: 'Muốn mua' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Book', bookSchema);