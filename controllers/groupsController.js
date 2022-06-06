//connect to mongoclusetr
const req = require("express/lib/request");
const { json } = require("express/lib/response");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const url = `mongodb+srv://radhia_rh:RADHIARAHMANI2022@cluster0.b8mc7.mongodb.net/myDataBase?retryWrites=true&w=majority`;
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log("Connected to database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

const users = require("../models/users");
const users_messages = require("../models/users_messages");
const res = require("express/lib/response");
const bcrypt = require("bcryptjs");
const groups = require("../models/groups");
const groups_messages = require("../models/groups_messages");

const getgroups = async (req, res) => {
  try {
    const listgroups = await groups.find();
    res.send(listgroups);
    // console.log(listgroups);
  } catch (err) {
    console.log(err);
  }
};
const addgroup = async (req, res) => {
  const groupname = req.body.groupname;
  const data = await new groups({
    name: groupname,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/LetterG.svg/800px-LetterG.svg.png",
    members: [],
    messages: [],
  });
  await data.save();
};
const getmsggroup = async (req, res) => {
  try {
    const listgroups = await groups_messages.find();
    res.send(listgroups);
  } catch (err) {
    console.log(err);
  }
};
const joingroup = async (req, res) => {
  const iduser = req.body.iduse;
  const idgroup = req.body.idgroup;
  try {
    const newgroups = await groups.findByIdAndUpdate(idgroup, {
      $push: {
        members: { iduser: iduser },
      },
    });
    console.log("userrr" + iduser + "added to group" + idgroup);
    res.send(newgroups);
  } catch (err) {
    res.send(err);
  }
};
const addmessagetogroup = async (req, res) => {
  const iduse = req.body.iduse;
  const idgroup = req.body.idgroup;
  const message = req.body.message;
  try {
    const data = new groups_messages({
      message: message,
      id_sender: iduse,
      id_group: idgroup,
    });
    await data.save();
    console.log("message added");
  } catch (err) {
    console.log(err);
  }
};

module.exports.addgroup = addgroup;
module.exports.getgroups = getgroups;
module.exports.joingroup = joingroup;
module.exports.addmessagetogroup = addmessagetogroup;
module.exports.getmsggroup = getmsggroup;
