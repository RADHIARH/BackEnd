const controller = require("../controllers/invitationsController");
const express = require("express");
const router = express.Router();
router.post("/", controller.addfriend);
module.exports = router;
