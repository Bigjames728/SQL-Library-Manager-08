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



// Post new book to database


// Shows book detail form


// Update book info in database


// Deletes a book

module.exports = router;
