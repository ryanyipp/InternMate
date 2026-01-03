import express from "express";
import {create, login, update, remove, forgetPassword, getUserById} from "../controllers/userController.js";
import {registerSchema, loginSchema, updateSchema} from "../middleware/validateLogin.js";
import {validateRequest} from "../middleware/validateRequest.js";
import {checkUserExist} from "../middleware/checkUserExist.js";

const route = express.Router();

// Registration route with validation
route.post("/register", validateRequest(registerSchema), checkUserExist, create);

// Login route with validation
route.post("/login", validateRequest(loginSchema), login);

// Forget password route
route.post("/forgotPassword", forgetPassword);

// Get user by ID route
route.get("/:id", getUserById);

// Edit route
route.patch("/:username", validateRequest(updateSchema), update);

// Delete route
route.delete("/:username", remove);

export default route;