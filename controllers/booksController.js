const path = require('path');
const Book = require('../models/book'); 
const User = require('../models/users');
const fs = require('fs');


exports.addBook = async (req, res) => {
  const { title, author, description} = req.body;
  // const defaultImageData = fs.readFileSync("./defaults/default-img.jpg");
  const user = await User.findById(req.user._id);
  const uploadPath = path.resolve(__dirname, '..');
  const newBook = new Book({
    title,
    author,
    description,
    bookimage: {
      data: fs.readFileSync(path.join(uploadPath + '/defaults/' + req.file.filename)),
      // data: req.body.buffer,
      contentType: req.file.mimetype
    },
    location : user.location,
    userid: req.user._id,
  });
  // console.log(req.file)

  try {
    const book = await newBook.save();
    fs.unlinkSync(path.join(uploadPath + '/defaults/' + req.file.filename));
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

exports.getUploadedBooks = async (req, res) => {
  try {
    const verified = req.user;
    const uploadedBooks = await Book.find({userid: verified._id});
    res.json(uploadedBooks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

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
      {
        $match: {
          userid: { $ne: user._id }
        }
      },
    ]);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
