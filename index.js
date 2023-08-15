require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

//Database
const database = require("./database/database");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");


//INITIALISE Express

const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL
).then(() => console.log("Connection Established"));

/*
Route         /
Description   Get all books
Access        Public
Parameter     None
Method        Get
*/

booky.get("/",async (req,res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

/*
Route         /is
Description   Get Specific books
Access        Public
Parameter     isbn
Method        GET
*/

booky.get("/is/:isbn",async (req,res) => {
  const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});

//null !0 = 1. !1=0
  if(!getSpecificBook) {
    return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
  }

  return res.json({book: getSpecificBook});
});


/*
Route         /c
Description   Get all books
Access        Public
Parameter     category
Method        GET
*/

booky.get("/c/:category",async (req,res) => {
  const getSpecificBook = await BookModel.findOne({category: req.params.category});

  if(!getSpecificBook) {
    return res.json({error: `No book found for the Category of ${req.params.category}`});
  }

  return res.json({book: getSpecificBook});
});


/*
Route         /l
Description   Get all books
Access        Public
Parameter     language
Method        GET
*/

booky.get("/l/:language",async (req,res) => {
  const getSpecificBook = await BookModel.findOne({language: req.params.isbn});

  if(!getSpecificBook) {
    return res.json({error: `No book found for Language of ${req.params.language}`});
  }

  return res.json({Book: getSpecificBook});

});


/*
Route         /author
Description   Get all authors
Access        Public
Parameter     none
Method        GET
*/

booky.get("/authors",async (req,res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json(getAllAuthors);
});

/*
Route         /author/id
Description   Get authors based on id
Access        Public
Parameter     ISBN
Method        GET
*/

booky.get("/author/id/:id", (req,res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.id === req.id
  );

  if(getSpecificAuthor.length === 0) {
    return res.json({Error: `No author found for ID of ${req.id}`});
  }

  return res.json({author: getSpecificAuthor});
});


/*
Route         /author/book
Description   Get authors based on books
Access        Public
Parameter     ISBN
Method        GET
*/

booky.get("/author/book/:isbn", (req,res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.books.includes(req.params.isbn)
  )

  if(getSpecificAuthor.length === 0) {
    return res.json({Error: `No author found for book of ${req.params.isbn}`});
  }

  return res.json({author: getSpecificAuthor});
});

/*
Route         /publication
Description   Get all publications
Access        Public
Parameter     none
Method        GET
*/

booky.get("/publication",async (req,res) => {
  const getAllPublications = await PublicationModel.find();
  return res.json(getAllPublications);
});


/*
Route         /publication
Description   Get Specific publications
Access        Public
Parameter     none
Method        GET
*/

booky.get("/publication/:isbn", (req,res) =>{
  const getSpecificPublication = database.publication.filter(
    (publication) => publication.book === req.params.isbn
  )

  if(getSpecificPublication.length === 0) {
    return res.json({Error: `No Publication found for isbn of ${req.params.isbn}`});
  }

  return res.json({Publications: getSpecificPublication});
});


/*
Route         /publication
Description   Get Specific publications based on books
Access        Public
Parameter     none
Method        GET
*/

booky.get("/publication/book/:isbn", (req,res) =>{
  const getSpecificPublication = database.publication.filter(
    (publication) => publication.books.includes(req.params.isbn)
  )

  if(getSpecificPublication.length === 0) {
    return res.json({Error: `No Publication found for book of ${req.params.isbn}`});
  }

  return res.json({Publications: getSpecificPublication});
});


//POST

/*
Route         /book/new
Description   ADD NEW BOOKS
Access        Public
Parameter     none
Method        POST
*/

booky.post("/book/new",async (req,res) =>{
  const { newBook } = req.body;
  const addNewBook = BookModel.create(newBook);
  return res.json({
    books: addNewBook,
    message: "Book added Successfully!!!"
  });
});


/*
Route         /author/new
Description   ADD NEW AUTHORS
Access        Public
Parameter     none
Method        POST
*/

booky.post("/author/new",async (req,res) => {
  const { newAuthor } = req.body;
  const addNewAuthor = AuthorModel.create(newAuthor);
  return res.json({
    author: addNewAuthor,
    message: "Author added Successfully!!!"
  });
});


/*
Route         /publication/new
Description   ADD NEW PUBLICATION
Access        Public
Parameter     none
Method        POST
*/

booky.post("/publication/new",async (req,res) =>{
  const { newPublication } = req.body;
  const addNewPublication = PublicationModel.create(newPublication);
  return res.json({
    publication: addNewPublication,
    message: "Publication added Successfully!!!"
  });
});


/*
Route         /publication/new
Description   EDIT PUBLICATION
Access        Public
Parameter     none
Method        POST
*/

booky.post("/publication/new", (req,res) =>{
  const newPublication = req.body;
  database.publication.push(newPublication)

  if(newPublication.books === "12345book" ) {
    return res.json(database.publication);
  }

  else {
      return res.json(database.publication);
  }
});


/***********PUT************/
/*
Route         /book/update
Description   Update book on Isbn
Access        Public
Parameter     isbn
Method        PUT
*/

booky.put("/book/update/:isbn",async (req,res) => {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      Title: req.body.bookTitle
    },
    {
      new: true
    }
  );

  return res.json({
    books: updatedBook,
  })
});

/******Updating new author*****/

/*
Route         /book/author/update/
Description   Update/ Add new book
Access        Public
Parameter     ISBN
Method        PUT
*/

booky.put("/book/author/update/:isbn",async(req,res) => {
  //Update book Database
const updatedBook = await BookModel.findOneAndUpdate(
  {
    ISBN: req.params.isbn
  },
  {
    $addToSet: {
      authors: req.body.newAuthor
    }
  },
  {
    new: true
  }
);

  //Update the author database
const updatedAuthor = await AuthorModel.findOneAndUpdate(
  {
  id: req.body.newAuthor
},
{
  $addToSet: {
    books: req.params.isbn
  }
},
{
  new: true
}
);

return res.json({
  books: updatedBook,
  authors: updatedAuthor,
  message: "New Author was added"
})
});



//DELETE

/*
Route         //book/delete
Description   Delete a book
Access        Public
Parameter     ISBN
Method        DELETE
*/

booky.delete("/book/delete/:isbn",async (req,res) => {
  //Which ever book that doesnt match with the isbn,just send it to an updatedBookDatabase array
  //and the rest will be filtered out.

const updatedBookDatabase = await BookModel.findOneAndDelete(
  {
    ISBN: req.params.isbn
  }
);

return res.json({
  books: updatedBookDatabase
});
});

/*
Route         //author/delete
Description   Delete an author
Access        Public
Parameter     Name
Method        DELETE
*/

booky.delete("/author/delete/:name", (req,res) => {
  const updatedAuthorDatabase = database.author.filter(
    (author) => author.name !== req.params.name
  )
  database.author = updatedAuthorDatabase;

  return res.json({authors: database.author})
});

/*
Route         /book/delete/author
Description   Delete an author
Access        Public
Parameter     ISBN,AuthorId
Method        DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
  //Update the book Database
database.books.forEach((book) => {
  if(book.ISBN === req.params.isbn) {
    const newAuthorList = book.author.filter(
      (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
    );
    book.author = newAuthorList
    return;
  }
});


  //update the author database
  database.author.forEach((eachAuthor) => {
    if(eachAuthor.id === parseInt(req.params.authorId)) {
      const newBookList = eachAuthor.books.filter(
        (book) => book !== req.params.isbn
      );
      eachAuthor.books = newBookList;
      return;
    }
  });

  return res.json({
    book: database.books,
    author: database.author,
    message: "Author was deleted!!!!"
  });
});



booky.listen(3000,() => {
  console.log("Server is up and running");
});
