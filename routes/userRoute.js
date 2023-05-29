const express = require("express");
const verifyTokenRoute = require('../controllers/userController')
const user_route = express();

const user_controller = require("../controllers/userController");

user_route.post("/register", user_controller.registerUser);

user_route.post("/login",user_controller.user_login)

user_route.get("/profile",verifyTokenRoute.verifyToken,user_controller.user_profile)


module.exports = user_route;
