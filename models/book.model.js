const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: false
    },
    pages: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Book', bookSchema)