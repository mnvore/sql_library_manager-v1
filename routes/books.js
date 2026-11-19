
 // use express to create the routes for my books
 const express = require('express');
 const { Book } = require('../models');
 const router = express.Router();

 // i get all the books from the database and show them on the main book page
 router.get('/', async (req, res, next) => {
   try {
     const books = await Book.findAll();
     res.render('index', { books });
   } catch (error) {
     next(error);
   }
 });

 // show the empty form so someone can add a new book in
 router.get('/new', (req, res) => {
   res.render('new-book');
 });

 // save a new book to the database once form is submitted
 router.post('/new', async (req, res, next) => {
   try {
     await Book.create(req.body);
     res.redirect('/books');
   } catch (error) {
     if (error.name === 'SequelizeValidationError') {
       const book = await Book.build(req.body);
       res.render('new-book', { book, errors: error.errors });
     } else {
       next(error);
     }
   }
 });

// find the selected book and show its edit form
router.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render('update-book', { book });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});

 // save the changes made to an existing book
 router.post('/:id', async (req, res, next) => {
   let book;

   try {
     book = await Book.findByPk(req.params.id);

     if (book) {
       await book.update(req.body);
       res.redirect('/books');
     } else {
       next();
     }
   } catch (error) {
     if (error.name === 'SequelizeValidationError') {
       book = await Book.build(req.body);
       book.id = req.params.id;
       res.render('update-book', { book, errors: error.errors });
     } else {
       next(error);
     }
   }
 });

 //delete the selected book and return back to the book list
 router.post('/:id/delete', async (req, res, next) => {
   try {
     const book = await Book.findByPk(req.params.id);
     if (book) {
       await book.destroy();
       res.redirect('/books');
     } else {
       next();
     }
   } catch (error) {
     next(error);
   }
 });
 module.exports = router;
