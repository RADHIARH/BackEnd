const controller = require("../controllers/userController");
const express = require("express");
const router = express.Router();
const middleware = require("../middleware/middleware");
router.put("/", middleware.verifyToken, controller.updateuserinfo);
module.exports = router;
