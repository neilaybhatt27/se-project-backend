const Book = require('../models/book'); // import your Book model
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
