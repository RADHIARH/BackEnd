const controller = require("../../controllers/groupsController");
const express = require("express");
const router = express.Router();
const middleware = require("../../middleware/middleware");
router.post("/", middleware.verifyToken, controller.addgroup);
module.exports = router;
