import express from "express";
import { getUsers, createUser, updateUser, deleteUser, getUserProfile, updateUserProfile , updateUserProfileMobile} from "../controllers/userController.js";
import { uploadUserMedia } from "../middleware/uploadMiddleware.js";

const router = express.Router(); // here we are creating a new router for the user 

router.route("/")
  .get(getUsers)
  .post(createUser);

router.route("/:id")
  .get(getUserProfile)
  .put(uploadUserMedia, updateUserProfile)
  .delete(deleteUser);

router.route("/:id/mobile")
  .put(updateUserProfileMobile);

export default router;