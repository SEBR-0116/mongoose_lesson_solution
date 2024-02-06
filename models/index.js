const mongoose = require('mongoose')
const BookSchema = require('./book')
const PublisherSchema = require('./publisher')

const Book = mongoose.model('Book', BookSchema)
const Publisher = mongoose.model('Publisher', PublisherSchema)

module.exports = {
    Book,
    Publisher
}