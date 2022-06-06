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

const createToken = (id) => {
  return jwt.sign({ userid: id }, "tetfvgdsvcs", {
    expiresIn: "15h",
  });
};
const login = async (req, res) => {
  // validate if user already exists in the database
  try {
    const user = await users.findOne({
      email: req.body.email,
    });

    // verification de la similarite des mots de passes
    const passwordHush = await bcrypt.compare(req.body.password, user.password);
    if (passwordHush) {
      // creation de token
      const token = createToken(user._id);
      console.log("ena hush" + passwordHush);
      console.log(token);
      // envoie de token au client
      console.log("mot de passe correcte");
      res.json({ token: token, user: user });
    } else {
      res.status(400).json({ message: "C pas bon" });
    }
  } catch (err) {
    res.send(err);
  }
};

const getusers = async (req, res) => {
  try {
    const data = await users.find();
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
const getconnecteduser = async (req, res) => {
  const id = req.body.userid;
  try {
    const user = await users.findById(id);
    res.send(user);
  } catch (err) {
    console.log(err);
  }
};
const getusermessages = async (req, res) => {
  try {
    const messages = await users_messages.find();
    res.send(messages);
  } catch (err) {
    console.log(err);
  }
};
const deletemessage = async (req, res) => {
  try {
    const { idd } = req.params;
    res.send(await users_messages.findByIdAndDelete(idd));
  } catch (err) {
    res.send(err);
  }
};

const addmessage = async (req, res) => {
  const message = req.body.message;
  const id_sender = req.body.iduser;
  const id_receiver = req.body.id_receiver;
  try {
    const data = new users_messages({
      message: message,
      id_sender: id_sender,
      id_receiver: id_receiver,
      vue: false,
    });
    await data.save();
  } catch (err) {
    res.send(err);
  }
};
const register = async (req, res) => {
  try {
    const username = req.body.username;
    console.log(username);
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    const data = new users({
      username: username,
      email: email,
      password: password,
      actif: false,
      img: "http://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png",
      phone: phone,
      invitations: [],
      friendsList: [],
      messages: [],
    });
    await data.save();
    console.log("added");
  } catch (err) {
    console.log(err);
  }
};
// Groups



const updateuserinfo = async (req, res) => {
  const userid = req.body.iduse;
  const username = req.body.username;
  const email = req.body.email;
  const phone = req.body.phone;
  try {
    const updatedusers = await users.findByIdAndUpdate(userid, {
      username: username,
      email: email,
      phone: phone,
    });
    res.send(updatedusers);
    console.log("updated");
  } catch (err) {
    console.log(err);
  }
};
const editpassword = async (req, res) => {
  try {
    const user = await users.findById(req.body.userid);
    const passwordHush = await bcrypt.compare(
      req.body.lastpassword,
      user.password
    );
    if (passwordHush) {
      const newusers = await users.findByIdAndUpdate(req.body.userid, {
        password: bcrypt.hashSync(req.body.password, 10),
      });
      res.send(newusers);
      console.log(newusers);
    }
  } catch (err) {
    console.log(err);
  }
};


module.exports.getusers = getusers;
module.exports.getusermessages = getusermessages;
module.exports.deletemessage = deletemessage;
module.exports.addmessage = addmessage;
module.exports.login = login;
module.exports.getconnecteduser = getconnecteduser;
module.exports.register = register;
module.exports.updateuserinfo = updateuserinfo;
module.exports.editpassword = editpassword;

