import { User, Profile, ProfileFollow, Notification } from "../models/index.js";

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

    const followerUser = await User.findOne({
      where: { id: follower_user_id },
      attributes: ['name']
    });

    if (!followerUser) {
      return res.status(404).json({ error: "Follower user not found" });
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

    // sending a notificationnnnn
    await Notification.create({
      user_id: following_user_id,
      sender_id: follower_user_id,
      type: "new_follower",
      title: "New Follower",
      message: `${followerUser.name} started following you`,
      metadata: {
        follower_id: follower_user_id,
        profile_id: followerProfile.id
      },
      is_read: false,
      is_sent: false,
      is_seen: false
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

export const getUserFollowStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user's profile
    const userProfile = await Profile.findOne({
      where: { user_id: userId }
    });

    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    // Get followers: profiles that follow this user
    const followersData = await ProfileFollow.findAll({
      where: { following_profile_id: userProfile.id },
      include: [
        {
          model: Profile,
          as: "follower",
          attributes: ["id", "user_id", "profile_pic_url", "headline", "bio"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email"]
            }
          ]
        }
      ]
    });

    // Get following: profiles this user follows
    const followingData = await ProfileFollow.findAll({
      where: { follower_profile_id: userProfile.id },
      include: [
        {
          model: Profile,
          as: "following",
          attributes: ["id", "user_id", "profile_pic_url", "headline", "bio"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email"]
            }
          ]
        }
      ]
    });

    // Format followers array
    const followers = followersData.map(f => ({
      follow_id: f.id,
      profile_id: f.follower?.id,
      user_id: f.follower?.user?.id,
      name: f.follower?.user?.name,
      email: f.follower?.user?.email,
      profile_pic_url: f.follower?.profile_pic_url,
      headline: f.follower?.headline,
      bio: f.follower?.bio
    }));

    // Format following array
    const following = followingData.map(f => ({
      follow_id: f.id,
      profile_id: f.following?.id,
      user_id: f.following?.user?.id,
      name: f.following?.user?.name,
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