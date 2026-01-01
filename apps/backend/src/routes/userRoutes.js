import express from "express";
import { 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  getUserProfile, 
  // updateUserProfile , 
  updateUserProfileMobile, 
  getProfileDetailsByProfileId,
  updateProfileById,
  getAllProfilesByProfileId,
  createProfileForUserByProfileId,
  deleteProfileByProfileId,
} from "../controllers/userController.js";
import { uploadUserMedia } from "../middleware/uploadMiddleware.js";

const router = express.Router(); // here we are creating a new router for the user 

router.route("/")
  .get(getUsers)
  .post(createUser);

router.route("/:id")
  // .get(getUserProfile)
  .get(getProfileDetailsByProfileId)
  .put(uploadUserMedia, updateProfileById)
  .delete(deleteUser);

router.route("/:id/mobile")
  .put(updateUserProfileMobile);





router.get(
  "/profiles/by-profile/:profileId",
  getAllProfilesByProfileId
);

router.post(
  "/profiles/create-from/:profileId",
  createProfileForUserByProfileId
);

router.delete(
  "/profiles/delete/:profileId",
  deleteProfileByProfileId
);

export default router;
