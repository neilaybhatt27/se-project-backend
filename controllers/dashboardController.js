const Books = require('../models/book');
const User = require('../models/users');


exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const books = await Books.aggregate([
      {
        $geoNear: {
          near: user.location,
          distanceField: "distance",
          spherical: true
        }
      },
    ]);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 

exports.searchBooks = async (req, res) => {
  try {
   const searchTerm = req.query.term; 
   const user = await User.findById(req.user._id);
   const userLocation = user.location.coordinates;
 
   const books = await Book.aggregate([
     {
       $geoNear: {
         near: userLocation,
         distanceField: "distance",
         spherical: true,
         query: {
           title: { $regex: searchTerm, $options: 'i' },
         },
       },
     },
     {
       $project: {
         bookid: 1,
         image: 1,
         title: 1,
         author: 1,
         genre: 1,
         location: 1,
         status: 1,
         description: 1,
         distance: 1,
       },
     },
   ]);
 
   res.json(books);
  } catch (error) {
   res.status(500).json({ message: error.message });
  }
 };

const Book = require('../models/book');