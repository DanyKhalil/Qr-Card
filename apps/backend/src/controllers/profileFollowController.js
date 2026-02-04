import { User, Profile, ProfileFollow, Notification } from "../models/index.js";

/**
 * Make one user follow another
 * POST /follow
 * body: { follower_user_id, following_user_id }
 */
export const followUser = async (req, res) => {
  try {
    const { follower_profile_id, following_profile_id } = req.body;

    if (!follower_profile_id || !following_profile_id) {
      return res.status(400).json({ error: "Both profile IDs are required" });
    }

    if (follower_profile_id === following_profile_id) {
      return res.status(400).json({ error: "Cannot follow yourself" });
    }

    // Find both profiles directly
    const [followerProfile, followingProfile] = await Promise.all([
      Profile.findByPk(follower_profile_id, {
        attributes: ["id", "name"]
      }),
      Profile.findByPk(following_profile_id, {
        attributes: ["id"]
      })
    ]);

    if (!followerProfile || !followingProfile) {
      return res.status(404).json({ error: "One or both profiles not found" });
    }

    // Check if already following
    const existingFollow = await ProfileFollow.findOne({
      where: {
        follower_profile_id,
        following_profile_id
      }
    });

    if (existingFollow) {
      return res.status(400).json({ message: "Already following this profile" });
    }

    // Create follow
    const follow = await ProfileFollow.create({
      follower_profile_id,
      following_profile_id
    });

    // Send notification
    await Notification.create({
      receiver_profile_id: following_profile_id,
      sender_profile_id: follower_profile_id,
      type: "new_follower",
      title: "New Follower",
      message: `${followerProfile.name} started following you`,
      metadata: {
        follower_profile_id,
        following_profile_id
      },
      is_read: false,
      is_sent: false,
      is_seen: false
    });

    res.status(201).json({
      message: "Followed successfully",
      follow
    });

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
    const { follower_profile_id, following_profile_id } = req.body;

    if (!follower_profile_id || !following_profile_id) {
      return res.status(400).json({ error: "Both profile IDs are required" });
    }

    if (follower_profile_id === following_profile_id) {
      return res.status(400).json({ error: "Cannot unfollow yourself" });
    }

    // Ensure both profiles exist
    const [followerProfile, followingProfile] = await Promise.all([
      Profile.findByPk(follower_profile_id, { attributes: ["id"] }),
      Profile.findByPk(following_profile_id, { attributes: ["id"] })
    ]);

    if (!followerProfile || !followingProfile) {
      return res.status(404).json({ error: "One or both profiles not found" });
    }

    // Find the follow relationship
    const follow = await ProfileFollow.findOne({
      where: {
        follower_profile_id,
        following_profile_id
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

export const getUserFollowStatus = async (req, res) => {
  try {
    const { profileId } = req.params;

    if (!profileId) {
      return res.status(400).json({ error: "Profile ID is required" });
    }

    // Find profile directly
    const profile = await Profile.findByPk(profileId, {
      attributes: ["id", "name", "profile_pic_url", "headline", "bio"]
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Get followers (profiles that follow this profile)
    const followersData = await ProfileFollow.findAll({
      where: { following_profile_id: profile.id },
      include: [
        {
          model: Profile,
          as: "follower",
          attributes: ["id", "profile_pic_url", "headline", "bio", "name"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "email"]
            }
          ]
        }
      ]
    });

    // Get following (profiles this profile follows)
    const followingData = await ProfileFollow.findAll({
      where: { follower_profile_id: profile.id },
      include: [
        {
          model: Profile,
          as: "following",
          attributes: ["id", "profile_pic_url", "headline", "bio", "name"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "email"]
            }
          ]
        }
      ]
    });

    // Format followers
    const followers = followersData.map(f => ({
      follow_id: f.id,
      profile_id: f.follower?.id,
      name: f.follower?.name,
      email: f.follower?.user?.email,
      profile_pic_url: f.follower?.profile_pic_url,
      headline: f.follower?.headline,
      bio: f.follower?.bio
    }));

    // Format following
    const following = followingData.map(f => ({
      follow_id: f.id,
      profile_id: f.following?.id,
      name: f.following?.name,
      email: f.following?.user?.email,
      profile_pic_url: f.following?.profile_pic_url,
      headline: f.following?.headline,
      bio: f.following?.bio
    }));

    res.json({
      followers,
      following,
      count_followers: followers.length,
      count_following: following.length
    });

  } catch (error) {
    console.error("Error in getUserFollowStatus:", error);
    res.status(500).json({ error: error.message });
  }
};

