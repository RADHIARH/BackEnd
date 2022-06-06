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
const res = require("express/lib/response");
const addfriend = async (req, res) => {
  const iduser = req.body.iduser;
  const idfriend = req.body.idfriend;
  try {
    const newusers = await users.findByIdAndUpdate(idfriend, {
      $push: {
        invitations: { idfriend: iduser, accepted: false },
      },
    });
    res.send(newusers);
    console.log("invitation sent ");
  } catch (err) {
    console.log(err);
  }
};
const acceptinvit = async (req, res) => {
  const userid = req.body.id_user;
  const idfriend = req.body.idfriend;
  try {
    await users.findByIdAndUpdate(
      userid,
      {
        $set: {
          invitations: { idfriend: idfriend, accepted: true },
        },
      },
      {
        $push: {
          friendsList: { idfriend: idfriend },
        },
      }
    );

    console.log("accepted");
  } catch (err) {
    console.log(err);
  }
  // accept invit 2
};

const acceptinvit2 = async (req, res) => {
  const userid = req.body.id_user;
  const idfriend = req.body.idfriend;
  try {
    await users.findByIdAndUpdate(idfriend, {
      $push: {
        friendsList: { idfriend: userid },
      },
    });

    console.log("accepted");
  } catch (err) {
    console.log(err);
  }
  //   const newusers = users.bulkWrite(
  //     [
  //       {
  //         updateOne: {
  //           filter: { _id: userid },
  //           update: {
  //             $set: { invitations: { idfriend: idfriend, accepted: true } },
  //             $push: { friendsList: { idfriend: idfriend } },
  //           },
  //         },
  //       },
  //       {
  //         updateOne: {
  //           filter: { _id: idfriend },
  //           update: {
  //             $set: { invitations: { idfriend: userid } },
  //           },
  //         },
  //       },
  //     ],
  //     {
  //       ordered: true,
  //     }
  //   );
  //   console.log("friends added ");
  //   res.send(newusers);
  // } catch (err) {
  //   console.log(err);
  // }
};
const removefriend = async (req, res) => {
  const iduser = req.body.iduser;
  const idfriend = req.body.idfriend;
  try {
    const newusers = await users.findByIdAndUpdate(iduser, {
      $pull: {
        friendsList: { idfriend: idfriend },
      },
    });
    res.send(newusers);
    console.log("deleted");
  } catch (err) {
    console.log(err);
  }
};
module.exports.addfriend = addfriend;
module.exports.acceptinvit = acceptinvit;
module.exports.removefriend = removefriend;
module.exports.acceptinvit2 = acceptinvit2;
