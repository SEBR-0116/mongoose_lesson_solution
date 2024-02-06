const mongoose = require('mongoose')

mongoose
    .connect('mongodb://127.0.0.1:27017/booksDatabase')
    .then(()=> {
        console.log('connected!')
    })
    .catch((e)=> {
        console.error('error!', e.message)
    })

mongoose.set('debug', true)    

const db = mongoose.connection

module.exports = db