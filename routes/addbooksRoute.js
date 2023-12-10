const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');
const verifyToken = require('../middleware/verifyToken');
const multer = require("multer");
const storage = multer.memoryStorage(); // Store in memory as a Buffer
const upload = multer({ storage: storage });

// Route to add a new book
router.post('/add',verifyToken.authenticate, upload.single('file'), booksController.addBook);

router.get('/activity',verifyToken.authenticate, booksController.getUserBookHistory);

router.get('/',verifyToken.authenticate, booksController.getAllBooks);

module.exports = router;
