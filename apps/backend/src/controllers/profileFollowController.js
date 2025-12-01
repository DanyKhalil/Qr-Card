import { User, Profile, ProfileFollow } from "../models/index.js";

/**
 * Make one user follow another
 * POST /follow
 * body: { follower_user_id, following_user_id }
 */
export const followUser = async (req, res) => {
  try {
    const { follower_user_id, following_user_id } = req.body;

    if (follower_user_id === following_user_id) {
      return res.status(400).json({ error: "Cannot follow yourself" });
    }

    // Find profiles of both users
    const [followerProfile, followingProfile] = await Promise.all([
      Profile.findOne({ where: { user_id: follower_user_id } }),
      Profile.findOne({ where: { user_id: following_user_id } })
    ]);

    if (!followerProfile || !followingProfile) {
      return res.status(404).json({ error: "One or both profiles not found" });
    }

    // Check if already following
    const existingFollow = await ProfileFollow.findOne({
      where: {
        follower_profile_id: followerProfile.id,
        following_profile_id: followingProfile.id
      }
    });

    if (existingFollow) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Create follow
    const follow = await ProfileFollow.create({
      follower_profile_id: followerProfile.id,
      following_profile_id: followingProfile.id
    });

    res.status(201).json({ message: "Followed successfully", follow });
  } catch (error) {
    console.error("Error in followUser:", error);
    res.status(500).json({ error: error.message });
  }
};


/**
 * Unfollow a user
 * DELETE /unfollow
 * body: { follower_user_id, following_user_id }
 */
export const unfollowUser = async (req, res) => {
  try {
    const { follower_user_id, following_user_id } = req.body;

    // Find profiles
    const [followerProfile, followingProfile] = await Promise.all([
      Profile.findOne({ where: { user_id: follower_user_id } }),
      Profile.findOne({ where: { user_id: following_user_id } })
    ]);

    if (!followerProfile || !followingProfile) {
      return res.status(404).json({ error: "One or both profiles not found" });
    }

    // Find the follow
    const follow = await ProfileFollow.findOne({
      where: {
        follower_profile_id: followerProfile.id,
        following_profile_id: followingProfile.id
      }
    });

    if (!follow) {
      return res.status(404).json({ message: "Follow relationship does not exist" });
    }

    // Delete the follow
    await follow.destroy();

    res.json({ message: "Unfollowed successfully" });
  } catch (error) {
    console.error("Error in unfollowUser:", error);
    res.status(500).json({ error: error.message });
  }
};
