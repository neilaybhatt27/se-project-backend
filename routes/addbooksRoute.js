const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');
const verifyToken = require('../middleware/verifyToken');

// Route to add a new book
router.post('/add',verifyToken.authenticate, booksController.addBook);

router.get('/activity',verifyToken.authenticate, booksController.getUserBookHistory);

module.exports = router;
