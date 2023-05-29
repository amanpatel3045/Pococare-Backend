const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const config = require("../config/config");
const jwt = require("jsonwebtoken");

const create_token = async (id) => {
  try {
    const token = await jwt.sign({ _id: id }, config.secret_jwt, {
      expiresIn: "20h",
    });

    return token;
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// const securePassword = async (req,res) => {
//   try {
//     const HashedPassword = await bcryptjs.hash(req.body.password, 10);
//     return HashedPassword;
//   } catch (err) {
//     // res.status(400).send(err.message);
//     console.log(err)
//   }
// };

const registerUser = async (req, res) => {
  try {
    // const spassword = await securePassword(req.body.password);
    const hashedPassword = await bcryptjs.hashSync(req.body.password);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    const userData = await User.findOne({ email: req.body.email });
    if (userData) {
      res
        .status(500)
        .send({ success: false, message: "Your email already exist" });
    } else {
      const user_data = await user.save();
      res.status(200).send({ success: true, data: user_data });
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
};
//login method
const user_login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });
    if (userData) {
      const passwordMatch = await bcryptjs.compareSync(
        password,
        userData.password
      );
      if (passwordMatch) {
        const tokenData = await create_token(userData._id);
        // const refreshToken = await jwt.sign({ _id: id }, config.secret_jwt, {
        //   expiresIn: "10d",
        // });
        const userResult = {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          password: userData.password,
          token: tokenData,
          // refreshT: refreshToken,
        };
        const response = {
          success: true,
          msg: "User Details",
          data: userResult,
        };

        res.status(200).send(response);
      } else {
        res
          .status(200)
          .send({ success: false, msg: "Login credentials are incorrect" });
      }
    } else {
      res
        .status(200)
        .send({ success: false, msg: "Login credentials are incorrect" });
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
};

//middleware
const verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  console.log(bearerHeader);
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.send({
      message: "Token is not valid",
    });
  }
};

// const handle_Refresh_Token = (refreshToken) => {
//   try{
//     jwt.verify(refreshToken, config.refresh_jwt, (err, authData) => {
//       if (err) {
//         res.send({ message: "Invalid Token" });

//       } else {

//         res.status(200).send({
//           success: true,
//           message: "profile page accessed",
//           authData,
//         });
//       }
//     });
//   }catch(err){
//     res.status(400).send(err.message);
//   }
// };

const user_profile = async (req, res) => {
  try {
    jwt.verify(req.token, config.secret_jwt, (err, authData) => {
      if (err) {
        res.send({ message: "Invalid Token" });
        // handle_Refresh_Token(refreshToken);
      } else {
        res.status(200).send({
          success: true,
          message: "profile page accessed",
          authData,
        });
      }
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = {
  registerUser,
  user_login,
  verifyToken,
  user_profile,
};
