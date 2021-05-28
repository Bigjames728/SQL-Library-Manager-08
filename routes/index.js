var express = require('express');
var router = express.Router();
var Book = require('../models').Book;
const Sequelize = require('sequelize');
const { Op } = require('sequelize');


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
    res.redirect('/books');
  } catch (error) {
    if (error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      res.render("new-book", { book, errors: error.errors, title: "New Book" })
    } else {
      throw error; // error caught in the asyncHandler's catch block
    }
  }
}));

// Search for books - * this has to be above the '/books/:id' route *
router.get('/books/search', asyncHandler (async (req, res, next) => {
  const { q } = req.query;

  Book.findAll({ where: { title: { [Op.like]: '%' + q + '%' } } })
    .then(books => res.render('index', { books }))
    .catch(err => console.log(err));
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
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/');
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('update-book', { book, errors: error.errors, title: "Edit Book" })
    } else {
      throw error; // error caught in the asynchanlders catch block
    }
  } 
}));


// Deletes a book
router.post('/books/:id/delete', asyncHandler( async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    res.sendStatus(404);
  }
}));


module.exports = router;
