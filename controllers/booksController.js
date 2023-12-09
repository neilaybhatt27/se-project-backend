const Book = require('../models/book'); 
const User = require('../models/users');

exports.addBook = async (req, res) => {
  const { title, author, description, image} = req.body;
  const user = await User.findById(req.user._id);
  const newBook = new Book({
    title,
    author,
    description,
    image,
    location : user.location,
    userid: req.user._id,
  });

  try {
    const book = await newBook.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserBookHistory = async (req, res) => {
  try {
    const userId = req.user._id; 
    const borrowedBooks = await Book.find({ currentBorrower: userId });
    const lendedBooks = await Book.find({ userid: userId, currentBorrower: { $ne: null } });

    res.json({
      borrowedBooks: borrowedBooks,
      lendedBooks: lendedBooks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};