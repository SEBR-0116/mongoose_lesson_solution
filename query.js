// Write your queries here


const db = require('./db')
const { Book, Publisher } = require('./models')


const findBook = async () => {
    const books = await Book.find()
    console.log(books)
}


const createBook = async () => {
    const publisher = await Publisher.findOne()

    let book = await Book.create({
        title: 'Brothers Karamazov',
        author: 'Fyodor Dostoyevsky',
        published_date: '1879-08-02',
        publisher_id: publisher._id
    })
    console.log(book)
}


const updateBook = async () => {
    const updated = await Book.updateOne(
        { title: 'The Lord of the Rings' },
        { title: 'The Lord of the Rings Book I - The Fellowship of the Ring' }
    )
    console.log(updated)
  }
  
  const deleteBook = async () => {
    let deleted = await Book.deleteOne({ title: 'Brothers Karamazov' })
    console.log(deleted)
  }



async function main() {
    try {
    //await findBook()
    //await createBook()
    //await updateBook()
    await deleteBook()
    } catch (error) {
      console.log(error)
    } finally {
      await db.close()
    }
  }

  main()