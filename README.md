### SEBR 0116

# Mongoose Data Modeling

![](https://res.cloudinary.com/practicaldev/image/fetch/s--9uBLdn55--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/i/x534inlbfuxxhial9jnw.png)

## Overview

We'll be learning about modeling data with MongoDB and getting practice with creating Schemas and Models utilizing Mongoose ODM to interact with our MongoDB database.

## Getting started

- fork and clone
- `cd` into this folder

## The MVC Paradigm

Model–view–controller (MVC) is a software design pattern commonly used for developing user interfaces that divides the related program logic into three interconnected elements. This is done to separate internal representations of information from the ways information is presented to and accepted from the user

### Model
The central component of the pattern. It is the application's dynamic data structure, independent of the user interface. It directly manages the data, logic and rules of the application. Models are defined by Schemas, which are like Blueprints or Templates for all of our data to build in

### View
Any representation of information such as a chart, diagram or table. Multiple views of the same information are possible, such as a bar chart for management and a tabular view for accountants. For this unit, we will be using a standard JSON view, but view engines such as EJS, Handlebars, and many others are also available and widely used.

### Controller
Accepts input and converts it to commands for the model or view. The functionality of the project, and how we can CRUD our data objects


## Common Data Model Design Practices

When it comes to building a database, one of the most important aspects is **how to model our data**. With `mongoDB` there are two ways we can accomplish this:

- Normalized
- Denormalized

Because `mongoDB` uses a structure similar to `JSON`, we can dictate the shape that our data takes.

## Denormalized Data Model

The term `denormalized` is used in mongoDB/mongoose to define or describe a model/document with nested data. What do you mean _nested_? Let's take a look at the following example:

```js
{
  _id: ObjectId("3e399709171f6188450e43d2"),
  name: "Joe Schmoe",
  email: "j.schmoe@gmail.com",
  address: {
    street: "123 Fake Street",
    city: "Faketon",
    state: "MA",
    zip: "12345"
  }
}
```

This looks like an object literal in JavaScript right? Well it is. In MongoDB it is common to **embed** related data inside a document. This structure (or schema) of embedding related data is a feature in MongoDB. In database design we call this type of schema "denormalized".

A HUGE (performance) benefit of having related data **embedded** in a document is that we can have all our data in one collection - that means we can create, read, update, and delete data all in one request!

> MongoDB Docs
>
> The embedded data model combines all related data in a single document instead of normalizing across multiple documents and collections. This data model facilitates atomic operations.

## Normalized Data Model

Normalized data takes a different approach. We link different data sets by utilizing a reference. A `reference` is a virtual link between two documents in seperate collections. This is done typically by using the `ObjectId/_id` field which is a unique identifier for each record.

Let's look at the following examples:

`publisher` document

```js
{
  _id: ObjectId("3e399709171f6188450e43d2"),
  name: "Penguin Books",
  location: "375 Hudson St, New York, NY 10014",
  url: "https://penguin.com"
}
```

`book` document

```js
{
  title: "A New Earth",
  author: "Eckhart Tolle",
  published_date: "2005",
  publisher_id: ObjectId("3e399709171f6188450e43d2")
}
```

Notice how we create the relationship between `publisher` and `book` via a `publisher_id` field.

- in the `book` document we are creating a **reference** to a `publisher` document

According to MongoDB docs the reason we would want to use a normalized data model would be:

- when embedding would result in **duplication** of data but would not provide sufficient read performance advantages to outweigh the implications of the duplication. (We will look at an example of this in a later lesson)
- to represent more complex many-to-many relationships
- to model large hierarchical data sets

Don't worry about the last two bullet points. A lot of this knowledge will come with maturity of working with MongoDB - the more you work with it, the more you will begin to understand how the relationships work, and what relationship best suits your app's needs.

> More on normalization and denormalization [here](https://techdifferences.com/difference-between-normalization-and-denormalization.html)
> 
## What Are Associations/Relationships

In order to understand how and why we set up relationships, read the following article: [Modeling Relationships in MongoDB](https://betterprogramming.pub/modeling-relationships-in-mongodb-b69b93181c48)

As you can see, there are many different ways of associating data with MongoDB. There are trade offs to every type of association. What's important to understand, is how to set up the associations.

You'll typically see the following:
- One-To-One
      - A person has 1 Drivers License, a high school class has 1 teacher
- One-To-Many
      - A class has many students, a team has many players, a portfolio has many assets
- Many-To-Many
      - Many students take many classes, many planes fly to multiple airports, many suppliers ship to many stores

  
## MongoDB: One-to-Many Relationships

> Take five minutes and read the MongoDB docs on relationships:

- **[MongoDB One-To-Many Embedded](https://docs.mongodb.com/manual/tutorial/model-embedded-one-to-many-relationships-between-documents)**
- **[One To Many Referenced](https://docs.mongodb.com/manual/tutorial/model-referenced-one-to-many-relationships-between-documents)**

> Once again, what are the trade-offs between **embedding** a document vs **referencing** a document?

What's a one-to-many relationship? A common example is a blog app. A blog has users, a user can have many blog posts. One-to-many relationships are quite common and we need to know how to implement them on the database level.

In MongoDB we can create a one-to-many relationship by either:

1. embedding the related documents
2. referencing the related document(s)

There are trade-offs to each. We should understand them and pick what suits our use case best.

Let's consider a few examples!

### Embedding Documents

**[MongoDB One-To-Many Embedded](https://docs.mongodb.com/manual/tutorial/model-embedded-one-to-many-relationships-between-documents)**

#### Example 1

Consider the following `user` document with many `posts`'s embedded in it:

```js
{
   _id: ObjectId("3e399709171f6188450e43d2"),
   name: "Joe Schmoe",
   handle:"joeBeans123",
   posts: [
      {
        title: "123 Fake Street",
        description: "Faketon",
        likes: 16,
      },
      {
        title: "1 Some Other Street",
        description: "Boston",
        likes: 32,
      }
   ]
}
```

As you can see, we can embed content into an existing `document`. This is pretty common in MongoDB.

- **Cons**
  - As the user creates more posts, the array grows. This can lead to increased query latency due to scanning the documents within a collection.
  - A user might accidently create a duplicate entry leaving your front end with duplicate posts.
  - Deleting specific records may become challenging due to how mongoDB scans collections.
- **Pros**
  - simpler queries to find data
  - the data is returned with the desired record right off the bat

#### Example 2

Here's another way we can embed documents:

```js
{
   _id: ObjectId("2e399709171f6188450e43d2")
   title: "Learn JavaScript",
   description: "Take a coding bootcamp on JavaScript",
   status: "active",
   user: {
              first_name: "Joe",
              last_name: "Schmoe",
              email: "j.schmoe@gmail.com",
              job_title: "Junior Developer"
         }
}

{
   _id: ObjectId("8e399709171f6588450e43g2")
   title: "Learn React",
   description: "Take a coding bootcamp on React",
   status: "active",
   user: {
              first_name: "Joe",
              last_name: "Schmoe",
              email: "j.schmoe@gmail.com",
              job_title: "Junior Developer"
         }
}
```

Notice a pattern here. Both of the users are the same. The biggest issue with embedding documents in this way, is that you'll end up creating duplicate records (in this case a user).

### Referencing Documents

**[One To Many Referenced](https://docs.mongodb.com/manual/tutorial/model-referenced-one-to-many-relationships-between-documents)**

#### Example 1

Let's see how we would model the same data by having posts **reference** a user document:

`users collection`

```js
{
   _id: ObjectId("3e399709171f6188450e43d2"),
   name: "Joe Schmoe"
}
```

`posts collection`

```js
{
   _id: ObjectId("9e391709171f6188450e43f4"),
   user_id: ObjectId("3e399709171f6188450e43d2"),
   title: "This restaurant is great",
   description: "I loved this restaurant, it was fantastic",
   likes: 16
}

{
   _id: ObjectId("8s32170987gf6188450y43f2"),
   user_id: ObjectId("3e399709171f6188450e43d2"),
   title: "this restaurant was bad",
   description: "I did not like this restaurant, it was bad",
   likes: 32
}
```

Utilizing this design, we have much more control over the records in our database. By using `references`, we create a virtual link between collections to describe what record belongs to who. The `reference` is typically the `_id` of a document due to it being unique and unmodifiable!

- **Cons**
  - queries to load the associated data are much more complex
  - managing multiple schemas/collections becomes trickier as you add more references
- **Pros**
  - reduces the risk of duplicates due to schema restrictions that we can add
  - managing the data becomes easier (Deleting and Updating)
  - the data is organized in a way that latency does not increase (mongoDB performs some magic to make references super fast)

#### Example 2

We can also use `references` within the parent document. We store the records within an array of the child documents `ObjectId`.

```js
{
  _id: ObjectId("4e339749175f6147450e43d1")
  first_name: "Joe",
  last_name: "Schmoe",
  email: "j.schmoe@gmail.com",
  job_title: "Junior Developer",
  tasks: [ ObjectId("2e399709171f6188450e43d2"), ObjectId("8e399709171f6588450e43g2") ]
}
```

`task`s documents

```js
{
   _id: ObjectId("2e399709171f6188450e43d2")
   title: "Learn JavaScript",
   description: "Take a coding bootcamp on JavaScript",
   status: "active"
}

{
   _id: ObjectId("8e399709171f6588450e43g2")
   title: "Learn React",
   description: "Take a coding bootcamp on React",
   status: "active"
}
```

This is a common way to model one-to-many relationships where we know we plan on creating requests for a user and all their associated tasks. Instead of embedding tasks within the user document, we embed the task id. This is more efficient. Our user document stays small. Its efficient to request all users or a specific user. This model supports a data model where a user can have many tasks because all we're storing is the task id inside the user document - so it doesn't take up much space in the user document. And if we do want the task data we can request it from the tasks collection based on the task id found in the user document.

## Exercise

Let's build a normalized data model using referencing. Npm init -y will create our package.json that allows us to run other installations. We will then install the Mongoose library, create necessary folders, and populate them with files to work with:

```sh
npm init -y
npm install mongoose
mkdir db models seed
touch db/index.js models/{publisher,book,index}.js seed/{publishers,books}.js
```

Start by setting up our database. This is mostly boilerplate that can be re-used for every Mongoose project we create. The biggest thing to watch for is the "booksDatabase" part. This will change depending on what db you are using (in this case, we're working with books), and if you want to connect to the Mongo Atlas

`/db/index.js`

```js

//this pulls in all of our mongoose information from the modules we installed through node (the `npm i mongoose` commmand)
//they are required for all of these actions to run... hence 'require'
const mongoose = require('mongoose')


//we are chaining together a series of commands using dot notation. At its most basic skeleton, can see how `console.log()` and `document.querySelector()` 
//are similar to mongoose.connect().then()


//connect makes sure our JS file is attached to our MongoDB 
//.then is similar to our async/await functionality, it makes sure the previous function is run before we get to the next one and its callback function
//.catch is a way to protect against errors, so we'l see what exactly is going wrong

mongoose
  .connect('mongodb://127.0.0.1:27017/booksDatabase')
  .then(() => {
    console.log('Successfully connected to MongoDB.')
  })
  .catch((e) => {
    console.error('Connection error', e.message)
  })
    
mongoose.set('debug', true)

//from here on in, whenever we use the variable 'db' it refers to the connection to Mongo that we've made here
const db = mongoose.connection

//we are exporting our `db` variable and all of its associated info, so that it can be required and imported into other files in our app
module.exports = db
```

> Notice the following line `mongoose.set('debug', true)`, this is super useful for debugging our queries, it will show the raw query mongo executes right in the terminal

## Defining Schemas and Generating Models

Let's create the Publisher `Schema` first. As you can see, we are defining the datatypes for each, and then setting certain constraints. The 'required: true' constraint means that our data must be _truthy_, it can not be Null, Undefined, or NaN for numbers. We can also set constraits like Max and Min Length, Must Contain, and others. There are _a lot_ out there that you will want to explore and use:

`/models/publisher.js`

```js
//we are pulling in a thing called a Schema, using more of those Mongoose modules we installed
const { Schema } = require('mongoose')


//creating a new Object called a Publisher, that follows the rules that Mongoose defines through the schema
const Publisher = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    url: { type: String, required: true }
  },
  { timestamps: true }
)

//exporting this thing called a Publisher and all of its information so other files can use it
module.exports = Publisher
```

Now that we have the Publisher Schema, we can now create the Book `Schema` that **references** the Publisher Schema:

`/models/book.js`

Notice how we are effectively making a Class to populate with JSON objects. That 'type: Schema.Types.ObjectId' block allows us to target a value outside of this object, what we'll call a "Foreign Key", to attach data collectiosn together. We're going to give it a reference, a 'ref', of 'publisher_id'. This will make Publishers the parent collection, and Books the child.

```js
const { Schema } = require('mongoose')

const Book = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    published_date: { type: String, required: true },
    publisher_id: { type: Schema.Types.ObjectId, ref: 'publisher_id' }
  },
  { timestamps: true }
)

module.exports = Book
```

> Notice how we reference the Publisher Schema by `publisher_id`. If we had a db of Players on Teams, or Artists on Record Labels, what would be the parent, what would be the child, how would we reference them?

Now that we have both schemas created, we need to define them as models, which will allow our Schemas to interface with our MongoDB database.

Hop into the `index.js` in your `models` folder.
As you can see, by using that "require" method, we are able to pull information in from outside files and folders. This means that we can keep our data encapsulated and clean, having maybe 10-15 different files of 10-15 lines of code, rather than 1 file with 150 lines of code. 
Add the following code:

```js

//we can now give those schemas a name to work with so we can refer to and work with them
const mongoose = require('mongoose')
const BookSchema = require('./book')
const PublisherSchema = require('./publisher')

//we can give them any name we want, but like so much else in JS, it would be counterintuitive to not give it a semantic, recognizable name
const Book = mongoose.model('Book', BookSchema)
const Publisher = mongoose.model('Publisher', PublisherSchema)

module.exports = {
  Book,
  Publisher
}
```

We've now created models that we can interact with in our project. When we require the models, we can now require the `models` directory and utitlize destructuring syntax to bring in any models we need like so:

```js
const { Publisher, Book } = require('./models')
```

Now we're ready to create our seed data.

## Seeding Our Database

![seed](https://www.sausd.us/cms/lib/CA01000471/Centricity/Domain/10075/beans%20growing%20animation.gif)

Once again since the Book model depends on the Publisher model, we will create the publisher seed data first:

`/seed/publishers.js`

```js

//pulling in our db module, and the deconstructed object of Publisher, with all of its information
const db = require('../db')
const { Publisher } = require('../models')


//attaching to the db, and giving us an error if anything goes wrong
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

//because we are taking a quick detour out of JS and into Mongo, we need to make sure these are all async functions. That way, even if it only takes .01 of second, it still won't throw things out of order
const main = async () => {
  const publishers = [
    {
      name: 'Penguin Books',
      location: '375 Hudson St, New York, NY 10014',
      url: 'https://penguin.com'
    },
    {
      name: 'HarperCollins',
      location: '10 E 53rd St, New York, NY 10022',
      url: 'https://www.harpercollins.com'
    }
  ]
 
 //running our Mongo commands through JS! How cool is that!
 //it is cool
  await Publisher.insertMany(publishers)
  // using console.log to see the data we've seen
  console.log('Created publishers!')
}

//we keep these functions seperate so they can each run independently (Atomically) and perform their necessary task. 
//this is a bit complicated, yes, but it will prevent A Lot of errors we'd see if we didn't do this
const run = async () => {
//runs our main function and awaits for the data to populate
  await main()
  //closes our db after its run so things don't break
  db.close()
}

run()
```

`/seed/books.js`

```js
const db = require('../db')
const { Publisher, Book } = require('../models')

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const main = async () => {
  const penguinBooks = await Publisher.find({ name: 'Penguin Books' })
  const harperCollins = await Publisher.find({ name: 'HarperCollins' })

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
  console.log('Created books with publishers!')
}
const run = async () => {
  await main()
  db.close()
}

run()
```

Because we are exiting out of our standard JS files and working with our DB, we have to run these as async/await functions. Remember, even if it only takes .01 seconds to access this data, that can still cause huge problems if it takes longer than the JS does to run in its usual cascading fashion!

We can seed our db's using these simple commands from our root folder (or simply remove the seed/ if you are in your seed folder!)

```
node seed/publishers.js
node seed/books.js
```

Because Publishers is the parent it must be seeded first. If we seed the books without the publishers, you will get an error as those refernces will all come back undefined or null -> Falsey! which we know Mongo does not like.

When we seed the data we should see something similar to this

```
Successfully connected to MongoDB.
Mongoose: publishers.insertMany([ { name: 'Penguin Books', location: '375 Hudson St, New York, NY 10014', url: 'https://penguin.com', _id: new ObjectId("646d01883eb7880e63c05f8f"), __v: 0, createdAt: 2023-05-23T18:10:16.255Z, updatedAt: 2023-05-23T18:10:16.255Z }, { name: 'HarperCollins', location: '10 E 53rd St, New York, NY 10022', url: 'https://www.harpercollins.com', _id: new ObjectId("646d01883eb7880e63c05f90"), __v: 0, createdAt: 2023-05-23T18:10:16.255Z, updatedAt: 2023-05-23T18:10:16.255Z }], {})
Created publishers!
```

## Writing Queries

Utilize the provided [resources](https://mongoosejs.com/docs/api/query.html) to complete the following exercise .

In the provided `query.js` file add the following:

```js
const db = require('./db')
const { Book } = require('./models')

async function main() {
  try {
  } catch (error) {
    console.log(error)
  } finally {
    await db.close()
  }
}

main()
```

Write 4 functions that perform the following `CRUD` operations:

1. Finds a book
2. Creates a book
3. Updates a book
4. Deletes a book

As you have seen from our work with APIs in unit 1, reading tutorials and documentation is absolutely crucial to succeed in this field. You are doing yourself a major disservice if you don't take the 5-10 minutes to read through before looking at the answers. But if you do get stuck, here are the answers.

Note: When we ask you to present your work, we'll want to see books besides these!

<details>
  
  ```js
  const db = require('./db')
const { Book, Publisher } = require('./models')

const findBook = async () => {
    const books = await Book.findOne()
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
        await findBook()
        await createBook()
        await updateBook()
        await deleteBook()
    } catch (error) {
        console.log(error)
    } finally {
        await db.close()
    }
}

main()
  ```
  </details>

Make sure to invoke your functions in the `try` block in the `main` function at the bottom of the `query.js` file. They will not work if they are not called!

## Recap

In this lesson, we successfully created `schemas` and `models` to interact with the data in our database. We performed `CRUD` operations on the models and queried the data.

## Resources

- [Mongoose Queries](https://mongoosejs.com/docs/api/query.html)
