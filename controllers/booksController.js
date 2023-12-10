const Book = require('../models/book'); 
const User = require('../models/users');
const fs = require('fs');


exports.addBook = async (req, res) => {
  const { title, author, description} = req.body;
  const defaultImageData = fs.readFileSync("./defaults/default-img.jpg");
  const user = await User.findById(req.user._id);
  const newBook = new Book({
    title,
    author,
    description,
    bookimage: {
      data: req.file ? req.file.buffer : defaultImageData,
      contentType: req.file ? req.file.mimetype : 'default-image.jpg'
    },
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

exports.getAllBooks = async (req, res) => {
  try {
    // const books = await Book.find({});
    const user = await User.findById(req.user._id);
    const books = await Book.aggregate([
      {
        $geoNear: {
          near: user.location,
          distanceField: "distance",
          spherical: true
        }
      },
    ]);
    console.log(books);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
