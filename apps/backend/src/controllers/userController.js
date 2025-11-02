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
        id: sm.id,
        url: sm.url,
        display_order: sm.display_order
      })) || [],
      website_link: user.profile.website,
      videos_links: user.profile.videos?.map(video => ({
        id: video.id,
        video_url: video.video_url,
        title: video.title,
        description: video.description,
        display_order: video.display_order
      })) || [],
      locations: user.profile.locations?.map(location => ({
        id: location.id,
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
    const {
      userName, dob, phoneNumber, 
      headline, bio, websiteUrl, 
      connectLinks, videos, locations
    } = req.body;

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
    const socialMediaLinks = await SocialMedia.findAll({
      where: {profile_id: profile.id}
    })
    const userVideos = await Video.findAll({
      where: {profile_id: profile.id}
    })
    const userLocations = await Location.findAll({
      where: {profile_id: profile.id}
    }) 

    if (!user || !profile){
      return res.status(404).json({
        success: false,
        message: "Not FOund User"
      })
    }


    const checkIfDeleted = (id, objects) => {
      for (let obj of objects) {
        if (obj.id === id)
          return false;
      }
      return true;
    }
    const checkIfNew = (id, objects) => {
      for (let obj of objects) {
        if (obj.id === id)
          return false;
      }
      return true;
    }

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

    // social media links uodate
    for (let link of socialMediaLinks) {
      let deleted = checkIfDeleted(link.id, connectLinks);
      if (deleted) {
        await SocialMedia.destroy({ where: {id: link.id}})
      }
      else {
        let incomingLink = await connectLinks.find(curLink => curLink.id === link.id);
        await link.update({
          url: incomingLink.url,
        })
      }
    }
    for (let link of connectLinks) {
      let newLink = checkIfNew(link.id, socialMediaLinks);
      if (newLink) {
        await SocialMedia.create({
          profile_id: profile.id,
          url: link.url
        })
      }
    }

    // vidoes links update
    for (let link of userVideos) {
      let deleted = checkIfDeleted(link.id, videos);
      if (deleted) {
        await Video.destroy({ where: {id: link.id}})
      }
      else {
        let incomingLink = await videos.find(curLink => curLink.id === link.id);
        await link.update({
          video_url: incomingLink.video_url,
          title: incomingLink.title,
          description: incomingLink.description,
        })
      }
    }
    for (let link of videos) {
      let newLink = checkIfNew(link.id, userVideos);
      if (newLink) {
        await Video.create({
          profile_id: profile.id,
          video_url: link.video_url,
          title: link.title,
          description: link.description,
        })
      }
    }

    // locations update
    for (let link of userLocations) {
      let deleted = checkIfDeleted(link.id, locations);
      if (deleted) {
        await Location.destroy({ where: {id: link.id}})
      }
      else {
        let incomingLink = await userLocations.find(curLink => curLink.id === link.id);
        await link.update({
          floor: incomingLink.floor,
          building: incomingLink.building,
          street: incomingLink.street,
          city: incomingLink.city,
          state: incomingLink.state,
          country: incomingLink.country,
          maps_url: incomingLink.maps_url,
          title: incomingLink.title,
        })
      }
    }
    for (let link of locations) {
      let newLink = checkIfNew(link.id, userLocations);
      if (newLink) {
        await Location.create({
          profile_id: profile.id,
          floor: incomingLink.floor,
          building: incomingLink.building,
          street: incomingLink.street,
          city: incomingLink.city,
          state: incomingLink.state,
          country: incomingLink.country,
          maps_url: incomingLink.maps_url,
          title: incomingLink.title,
        })
      }
    }

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