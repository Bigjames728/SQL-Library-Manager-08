var express = require('express');
var router = express.Router();
var Book = require('../models').Book;


function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      next(error);
    }
  }
}

// Redirect when the url is localhost:3000/ to localhost:3000/books
router.get('/', asyncHandler(async(req, res) => {
  res.redirect('/books');
}));


/* GET home page. */
router.get('/books', asyncHandler (async(req, res, next) => {
  const books = await Book.findAll();
  res.render('index', { books: books });
}));

// Create new book form
router.get('/books/new', asyncHandler (async(req, res, next) => {
  res.render('new-book');
}));


// Post new book to database
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/');
  } catch (error) {
    if (error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      res.render("new-book", { book, errors: error.errors, title: "New Book" })
    } else {
      throw error; // error caught in the asyncHandler's catch block
    }
  }
}));

// Shows book detail form
router.get('/books/:id', asyncHandler (async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
  res.render('update-book', { book: book });
  } else {
    next(err)
  }
}));


// Update book info in database
router.post('/books/:id', asyncHandler (async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.update(req.body);
    res.redirect('/');
  } else {
    res.sendStatus(404);
  }
}))


// Deletes a book
router.post('/books/:id/delete', asyncHandler( async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  await Book.destroy(book);
  res.redirect('/books');
  
}));

module.exports = router;
