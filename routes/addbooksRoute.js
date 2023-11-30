const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');
const verifyToken = require('../middleware/verifyToken');

// Route to add a new book
router.post('/books',verifyToken.authenticate, booksController.addBook);

module.exports = router;
