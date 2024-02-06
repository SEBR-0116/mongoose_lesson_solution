const db = require('../db')
const { Publisher, Book } = require('../models')

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const main = async () => {
    //we are finding the Parent data
    //to get their _id 
    //to reference for our children
    const penguinBooks =  await Publisher.find({ name : 'Penguin Books'})
    const harperCollins = await Publisher.find({ name : 'HarperCollins' })

    //once we have found our Parents, we can insert our Children
    //because they'll have a Foreign Key to reference
    const books = [
        {
          title: 'First Person Singular',
          author: 'Haruki Murakami',
          published_date: '2023',
          publisher_id: penguinBooks[0]._id
        },
       {
          title: 'The Count of Monte Cristo',
          author: 'Alexandre Dumas',
          published_date: '1994',
          publisher_id: penguinBooks[0]._id
        },
        {
          title: 'The Lord of the Rings',
          author: 'J.R.R. Tolkien',
          published_date: '1951',
          publisher_id: penguinBooks[0]._id
        },
        {
          title: 'Zen and the Art of Motorcycle Maintenance',
          author: 'Robert M. Pirsig',
          published_date: '1999',
          publisher_id: harperCollins[0]._id
        },
        {
          title: 'The Alchemist',
          author: 'Paulo Coelho',
          published_date: '1988',
          publisher_id: harperCollins[0]._id
        }
      ]
    

      await Book.insertMany(books)
      console.log('created books with publishers')

}

const run = async () => {
    await main()
    db.close()
}

run()