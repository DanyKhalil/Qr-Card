import { Op, fn, col, where } from "sequelize";
import { Profile, ProfileFollow, Video, Location, User } from "../models/index.js";

export const getFollowersAndFollowing = async (req, res) => {
  const {
    profileId,
    search = "",
    filter = "",
    role = "",
    verified,
    mutual,
    hasVideos,
    location = "",
    sort = "asc",
  } = req.query;

  if (!profileId) return res.status(400).json({ error: "profileId is required" });

  try {
    // 1️⃣ Get the specific profile
    const myProfile = await Profile.findOne({
      where: { id: profileId },
      attributes: ["id"],
    });

    if (!myProfile) return res.status(404).json({ error: "Profile not found" });
    const myProfileId = myProfile.id;

    // 2️⃣ Get follow relations for this profile
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

    // 4️⃣ Fetch profiles with filters
    const includeOptions = [
      {
        model: User,
        as: "user",
        attributes: ["id", "role", "verified"],
        where: {
          ...(role ? { [Op.and]: where(fn("LOWER", col("user.role")), Op.eq, role.toLowerCase()) } : {}),
          ...(verified === "true" ? { verified: true } : {}),
        }
      },
      {
        model: Video,
        as: "videos",
        attributes: ["id"],
        required: hasVideos === "true",
      },
      {
        model: Location,
        as: "locations",
        where: location ? { city: location } : undefined,
        attributes: ["id", "city"],
        required: !!location,
      }
    ];

    // Profile-level search
    const profileWhere = {
      [Op.and]: [
        { id: profileIds }, // always filter by these profile IDs
      ],
    };

    if (search) {
      profileWhere[Op.and].push(
        where(fn("LOWER", col("Profile.name")), {
          [Op.like]: `%${search.toLowerCase()}%`
        })
      );
    }

    const profiles = await Profile.findAll({
      where: profileWhere,
      include: includeOptions,
      order: [["name", sort.toUpperCase()]],
    });

    // 5️⃣ Filter mutual if requested
    let filteredProfiles = profiles;
    if (mutual === "true") {
      filteredProfiles = profiles.filter(
        p => followersSet.has(p.id) && followingSet.has(p.id)
      );
    }

    // 6️⃣ Map result for frontend
    const result = filteredProfiles.map(p => ({
      id: p.user.id,
      profile_id: p.id,
      name: p.name,
      role: p.user.role,
      verified: p.user.verified,
      profile_pic_url: p.profile_pic_url,
      isFollower: followersSet.has(p.id),
      isFollowing: followingSet.has(p.id),
    }));

    res.json(result);

  } catch (error) {
    console.error("followers/following error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
