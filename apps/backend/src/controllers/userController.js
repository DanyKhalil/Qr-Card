import { User, Profile, SocialMedia, Video, Location } from '../models/index.js';

// ---- To get all the users ----
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ---- To create a new User ----
export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ---- To update a User ----
export const updateUser = async (req, res) => {
  try {
    const [updated] = await User.update(req.body, { where: { id: req.params.id } });
    res.json({ updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ---- To delete a User ----
export const deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ---- To get user profile with all its detials ----
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    /// here i am findng a user using hid id
    const user = await User.findOne({
      where: { id },
      include: [
        {
          model: Profile,
          as: 'profile',
          include: [
            {
              model: SocialMedia,
              as: 'social_media',
              attributes: ['id', 'url', 'display_order']
            },
            {
              model: Video,
              as: 'videos',
              attributes: ['id', 'video_url', 'title', 'description', 'display_order']
            },
            {
              model: Location,
              as: 'locations',
              attributes: [
                'id', 'title', 'country', 'state', 'city', 'street', 'building', 
                'floor', 'maps_url', 'latitude', 'longitude'
              ]
            }
          ]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.profile) {
      return res.status(404).json({ error: "Profile not found for this user" });
    }

    //  if all are alright, we format the json, so the front end can use it directky
    const userProfile = {
      name: user.name,
      cover_photo_url: user.profile.cover_pic_url,
      profile_pic_url: user.profile.profile_pic_url,
      dob: user.profile.dob,
      headline: user.profile.headline,
      bio: user.profile.bio,
      phone_number: user.profile.phone_number ? [user.profile.phone_number] : [],
      email: user.email ? [user.email] : [],
      social_media_links: user.profile.social_media?.map(sm => ({
        url: sm.url,
        display_order: sm.display_order
      })) || [],
      website_link: user.profile.website,
      videos_links: user.profile.videos?.map(video => ({
        video_url: video.video_url,
        title: video.title,
        description: video.description,
        display_order: video.display_order
      })) || [],
      locations: user.profile.locations?.map(location => ({
        title: location.title,
        country: location.country,
        state: location.state,
        city: location.city,
        street: location.street,
        building: location.building,
        floor: location.floor,
        maps_url: location.maps_url,
        coordinates: location.latitude && location.longitude ? {
          latitude: location.latitude,
          longitude: location.longitude
        } : null
      })) || []
    };

    res.json(userProfile);
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ error: error.message });
  }
};

// --- to start updating the user info on all tabels -
export const updateUserProfile = async (req, res) => {
  try {
    const {id} = req.params;
    const {userName, dob, phoneNumber, headline, bio, websiteUrl} = req.body;

    if (!id) {
      return res.status(403).json({
        success:false,
        message: 'Unauthorized User'
      })
    }

    const user = await User.findOne({
      where: {id: id}
    })
    const profile = await Profile.findOne({
      where: {user_id: id}
    })

    if (!user || !profile){
      return res.status(404).json({
        success: false,
        message: "Not FOund User"
      })
    }
    console.log(phoneNumber)

    const updateUser = await user.update({
      name: userName.trim()
    })
    const updateProfile = await profile.update({
      headline: headline.trim(),
      dob: dob,
      phone_number: phoneNumber,
      bio: bio,
      website: websiteUrl
    })

    res.status(200).json({
      success: true,
      message: 'Profile updated succesffully',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}