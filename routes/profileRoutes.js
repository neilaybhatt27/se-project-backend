const express = require('express');
const router = express.Router();
const profileController = require("../controllers/profileController");
const multer = require('multer');
const token = require('../middleware/verifyToken');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'defaults');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
}); 
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024} });

router.get("/user", token.authenticate ,profileController.getProfile);
router.put("/location", token.authenticate, profileController.updateLocation);
router.put("/upload-picture", token.authenticate, upload.single('image'), profileController.updateProfilePicture);

module.exports = router;