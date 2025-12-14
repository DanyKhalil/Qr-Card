import { User, Profile, ProfileFollow, Video, Location } from "../models/index.js";
import { Op, fn, col, where } from "sequelize";

export const getFollowersAndFollowing = async (req, res) => {
  const {
    userId,
    search = "",
    filter = "",
    role = "",
    verified,
    mutual,
    hasVideos,
    location = "",
    sort = "asc",
  } = req.query;

  if (!userId) return res.status(400).json({ error: "userId is required" });

  try {
    // 1️⃣ Get current user's profile
    const myProfile = await Profile.findOne({
      where: { user_id: userId },
      attributes: ["id"],
    });

    if (!myProfile) return res.status(404).json({ error: "Profile not found" });
    const myProfileId = myProfile.id;

    // 2️⃣ Get follow relations
    const relations = await ProfileFollow.findAll({
      where: {
        [Op.or]: [
          { follower_profile_id: myProfileId },
          { following_profile_id: myProfileId },
        ],
      },
      attributes: ["follower_profile_id", "following_profile_id"],
    });

    const followersSet = new Set();
    const followingSet = new Set();
    relations.forEach(r => {
      if (r.follower_profile_id === myProfileId) followingSet.add(r.following_profile_id);
      if (r.following_profile_id === myProfileId) followersSet.add(r.follower_profile_id);
    });

    // 3️⃣ Determine which profile IDs to return
    const filtersArray = filter ? filter.split(",") : [];
    let profileIds = [];
    if (filtersArray.includes("following") && !filtersArray.includes("followers")) {
      profileIds = [...followingSet];
    } else if (filtersArray.includes("followers") && !filtersArray.includes("following")) {
      profileIds = [...followersSet];
    } else {
      profileIds = [...new Set([...followersSet, ...followingSet])];
    }

    if (!profileIds.length) return res.json([]);

    // 4️⃣ Fetch users with filters
    const includeOptions = [
      {
        model: Profile,
        as: "profile",
        where: { id: profileIds },
        attributes: ["id", "profile_pic_url"],
        include: [],
      },
    ];

    if (hasVideos === "true") {
      includeOptions[0].include.push({
        model: Video,
        as: "videos",
        attributes: ["id"],
        required: true,
      });
    }

    if (location) {
      includeOptions[0].include.push({
        model: Location,
        as: "locations",
        where: { city: location },
        attributes: ["id", "city"],
        required: true,
      });
    }

    // 5️⃣ Build user where clause
    const whereClause = {
      ...(role ? { [Op.and]: where(fn("LOWER", col("User.role")), Op.eq, role.toLowerCase()) } : {}),
      ...(search ? { [Op.and]: where(fn("LOWER", col("User.name")), Op.like, `%${search.toLowerCase()}%`) } : {}),
      ...(verified === "true" ? { verified: true } : {}),
    };

    const users = await User.findAll({
      include: includeOptions,
      where: whereClause,
      attributes: ["id", "name", "role", "verified"],
      order: [["name", sort.toUpperCase()]],
    });

    // 6️⃣ Filter mutual if requested
    let filteredUsers = users;
    if (mutual === "true") {
      filteredUsers = users.filter(u => followersSet.has(u.profile.id) && followingSet.has(u.profile.id));
    }

    // 7️⃣ Map result for frontend
    const result = filteredUsers.map(u => ({
      id: u.id,
      name: u.name,
      role: u.role,
      verified: u.verified,
      profile_pic_url: u.profile.profile_pic_url,
      isFollower: followersSet.has(u.profile.id),
      isFollowing: followingSet.has(u.profile.id),
    }));

    res.json(result);

  } catch (error) {
    console.error("followers/following error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
