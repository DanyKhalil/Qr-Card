import express from "express";
import { getUsers, createUser, updateUser, deleteUser, getUserProfile, updateUserProfile } from "../controllers/userController.js";
import { uploadUserMedia } from "../middleware/uploadMiddleware.js";

const router = express.Router(); // here we are creating a new router for the user 

router.route("/")
  .get(getUsers)
  .post(createUser);

router.route("/:id")
  .get(getUserProfile)
  .put(uploadUserMedia, updateUserProfile)
  .delete(deleteUser);

export default router;