const express = require('express');
const router = express.Router();
const profileController = require("../controllers/profileController");
const multer = require('multer');
const storage = multer.memoryStorage(); // Store in memory as a Buffer
const upload = multer({ storage: storage });

router.get("/user", profileController.getProfile);
router.put("/location", profileController.updateLocation);
router.put("/upload-picture", upload.single('image'), profileController.updateProfilePicture);

module.exports = router;