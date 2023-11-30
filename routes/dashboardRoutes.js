const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const verifyToken = require('../middleware/verifyToken');

// Route to get the dashboard data
router.get('/',verifyToken.authenticate, dashboardController.getDashboard);

// Route to handle book searches
router.get('/search', verifyToken.authenticate, dashboardController.searchBooks);

module.exports = router;
