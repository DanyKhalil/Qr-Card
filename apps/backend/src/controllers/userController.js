import { User, Profile, SocialMedia, Video, Location, CustomContentType, CustomContentItem, CustomContentField, CustomContentValue } from '../models/index.js';

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
                'id', 'title', 'country', 'state', 'city', 'street',
                'building', 'floor', 'maps_url', 'latitude', 'longitude'
              ]
            },
            {
              model: CustomContentType,
              as: 'custom_types',
              include: [
                {
                  model: CustomContentField,
                  as: 'fields',
                  attributes: [
                    'id', 'field_name', 'label', 'field_key',
                    'field_type', 'required', 'display_order', 'config'
                  ]
                },
                {
                  model: CustomContentItem,
                  as: 'items',
                  attributes: [
                    'id', 'title', 'visibility', 'created_at'
                  ],
                  include: [
                    {
                      model: CustomContentValue,
                      as: 'values',
                      attributes: [
                        'id', 'value_text', 'value_json'
                      ],
                      include: [
                        {
                          model: CustomContentField,
                          as: 'field',
                          attributes: [
                            'id', 'field_key', 'field_name', 'label', 'field_type'
                          ]
                        }
                      ]
                    }
                  ]
                }
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

    // Format Profile Base Info
    const userProfile = {
      name: user.name,
      cover_photo_url: user.profile.cover_pic_url,
      profile_pic_url: user.profile.profile_pic_url,
      dob: user.profile.dob,
      headline: user.profile.headline,
      bio: user.profile.bio,
      phone_number: user.profile.phone_number ? [user.profile.phone_number] : [],
      email: user.email ? [user.email] : [],
      website_link: user.profile.website,

      social_media_links: user.profile.social_media?.map(sm => ({
        id: sm.id,
        url: sm.url,
        display_order: sm.display_order
      })) || [],

      videos_links: user.profile.videos?.map(video => ({
        id: video.id,
        video_url: video.video_url,
        title: video.title,
        description: video.description,
        display_order: video.display_order
      })) || [],

      locations: user.profile.locations?.map(loc => ({
        id: loc.id,
        title: loc.title,
        country: loc.country,
        state: loc.state,
        city: loc.city,
        street: loc.street,
        building: loc.building,
        floor: loc.floor,
        maps_url: loc.maps_url,
        coordinates:
          loc.latitude && loc.longitude
            ? { latitude: loc.latitude, longitude: loc.longitude }
            : null
      })) || [],

      // ⭐ CUSTOM CONTENT RESPONSE ⭐
      custom_content: user.profile.custom_types?.map(type => ({
        id: type.id,
        name: type.name,
        slug: type.slug,
        description: type.description,

        fields: type.fields?.map(f => ({
          id: f.id,
          name: f.field_name,
          label: f.label,
          key: f.field_key,
          type: f.field_type,
          required: f.required,
          display_order: f.display_order,
          config: f.config
        })) || [],

        items: type.items?.map(item => ({
          id: item.id,
          title: item.title,
          visibility: item.visibility,

          values: item.values?.map(v => ({
            field_id: v.field.id,
            field_key: v.field.field_key,
            field_name: v.field.field_name,
            field_label: v.field.label,
            field_type: v.field.field_type,
            value: v.value_json ?? v.value_text
          })) || []
        })) || []
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
      connectLinks, videos, locations,
      coverPhotoPath, profilePhotoPath
    } = req.body;

    if (!id) {
      return res.status(403).json({
        success:false,
        message: 'Unauthorized User'
      })
    }

    // parsee JSON strings
    const parsedConnectLinks = connectLinks ? JSON.parse(connectLinks) : [];
    const parsedVideos = videos ? JSON.parse(videos) : [];
    const parsedLocations = locations ? JSON.parse(locations) : [];
    

    // handling cover and profile picture changes
    let finalProfilePhotoPath = profilePhotoPath;
    let finalCoverPhotoPath = coverPhotoPath;

    // Check if new profile picture was uploaded
    if (req.files && req.files.profilePicture) {
      const profileFile = req.files.profilePicture[0];
      // finalProfilePhotoPath = `/uploads/profiles/${profileFile.filename}`;
      finalProfilePhotoPath = `http://localhost:5050/uploads/profiles/${profileFile.filename}`;
    } else {
      finalProfilePhotoPath = profilePhotoPath || null;
    }
    // Check if new cover photo was uploaded
    if (req.files && req.files.coverPhoto) {
      const coverFile = req.files.coverPhoto[0];
      // finalCoverPhotoPath = `/uploads/covers/${coverFile.filename}`;
      finalCoverPhotoPath = `http://localhost:5050/uploads/covers/${coverFile.filename}`;
    } else {
      finalCoverPhotoPath = coverPhotoPath || null;
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
        message: "Not Found User"
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

    let cleanDob = null;
    if (dob && !isNaN(new Date(dob).getTime())) {
      cleanDob = new Date(dob).toISOString().split("T")[0]; // YYYY-MM-DD
    }

    const updateProfile = await profile.update({
      headline: headline.trim(),
      dob: cleanDob,
      phone_number: phoneNumber,
      bio: bio,
      website: websiteUrl,
      cover_pic_url: finalCoverPhotoPath,
      profile_pic_url: finalProfilePhotoPath,
    })

    // social media links uodate
    for (let link of socialMediaLinks) {
      let deleted = checkIfDeleted(link.id, parsedConnectLinks);
      if (deleted) {
        await SocialMedia.destroy({ where: {id: link.id}})
      }
      else {
        let incomingLink = parsedConnectLinks.find(curLink => curLink.id === link.id);
        if (incomingLink && incomingLink.url) {
          await link.update({
            url: incomingLink.url,
          })
        }
      }
    }
    for (let link of parsedConnectLinks) { // CHANGED
      let newLink = checkIfNew(link.id, socialMediaLinks);
      if (newLink) {
        // ADD NULL CHECK
        if (link.url) {
          await SocialMedia.create({
            profile_id: profile.id,
            url: link.url
          })
        }
      }
    }

    // vidoes links update
    for (let link of userVideos) {
      let deleted = checkIfDeleted(link.id, parsedVideos);
      if (deleted) {
        await Video.destroy({ where: {id: link.id}})
      }
      else {
        let incomingLink = parsedVideos.find(curLink => curLink.id === link.id);
        await link.update({
          video_url: incomingLink.video_url,
          title: incomingLink.title,
          description: incomingLink.description,
        })
      }
    }
    for (let link of parsedVideos) {
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
      let deleted = checkIfDeleted(link.id, parsedLocations);
      if (deleted) {
        await Location.destroy({ where: {id: link.id}})
      }
      else {
        let incomingLink = parsedLocations.find(curLink => curLink.id === link.id);
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
    for (let link of parsedLocations) {
      let newLink = checkIfNew(link.id, userLocations);
      if (newLink) {
        await Location.create({
          profile_id: profile.id,
          floor: link.floor,
          building: link.building,
          street: link.street,
          city: link.city,
          state: link.state,
          country: link.country,
          maps_url: link.maps_url,
          title: link.title,
        })
      }
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated succesffully',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


export const updateUserProfileMobile = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      userName, dob, phoneNumber,
      headline, bio, websiteUrl,
      connectLinks = [], videos = [], locations = [],
      coverPhotoPath, profilePhotoPath
    } = req.body;

    if (!id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized User'
      });
    }

    // Find user and profile
    const user = await User.findOne({ where: { id } });
    const profile = await Profile.findOne({ where: { user_id: id } });

    if (!user || !profile) {
      return res.status(404).json({
        success: false,
        message: "User or profile not found"
      });
    }

    // Handle profile/cover photo if uploaded
    let finalProfilePhotoPath = profilePhotoPath || null;
    let finalCoverPhotoPath = coverPhotoPath || null;

    if (req.files?.profilePicture) {
      finalProfilePhotoPath = `http://localhost:5050/uploads/profiles/${req.files.profilePicture[0].filename}`;
    }

    if (req.files?.coverPhoto) {
      finalCoverPhotoPath = `http://localhost:5050/uploads/covers/${req.files.coverPhoto[0].filename}`;
    }

    // Update user and profile
    await user.update({ name: userName.trim() });
    await profile.update({
      headline: headline?.trim(),
      dob,
      phone_number: phoneNumber,
      bio,
      website: websiteUrl,
      cover_pic_url: finalCoverPhotoPath,
      profile_pic_url: finalProfilePhotoPath,
    });

    // --- Update social media links ---
    const existingLinks = await SocialMedia.findAll({ where: { profile_id: profile.id } });

    // Delete removed
    for (let link of existingLinks) {
      if (!connectLinks.some(l => l.id === link.id)) {
        await SocialMedia.destroy({ where: { id: link.id } });
      }
    }

    // Update or create
    for (let link of connectLinks) {
      if (link.id) {
        const existing = existingLinks.find(l => l.id === link.id);
        if (existing) {
          await existing.update({ url: link.url });
        }
      } else if (link.url) {
        await SocialMedia.create({ profile_id: profile.id, url: link.url });
      }
    }

    // --- Update videos ---
    const existingVideos = await Video.findAll({ where: { profile_id: profile.id } });

    for (let v of existingVideos) {
      if (!videos.some(vid => vid.id === v.id)) {
        await Video.destroy({ where: { id: v.id } });
      }
    }

    for (let v of videos) {
      if (v.id) {
        const existing = existingVideos.find(ev => ev.id === v.id);
        if (existing) {
          await existing.update({
            video_url: v.video_url,
            title: v.title,
            description: v.description
          });
        }
      } else if (v.video_url) {
        await Video.create({
          profile_id: profile.id,
          video_url: v.video_url,
          title: v.title,
          description: v.description
        });
      }
    }

    // --- Update locations ---
    const existingLocations = await Location.findAll({ where: { profile_id: profile.id } });

    for (let loc of existingLocations) {
      if (!locations.some(l => l.id === loc.id)) {
        await Location.destroy({ where: { id: loc.id } });
      }
    }

    for (let loc of locations) {
      if (loc.id) {
        const existing = existingLocations.find(el => el.id === loc.id);
        if (existing) {
          await existing.update({
            title: loc.title,
            country: loc.country,
            state: loc.state,
            city: loc.city,
            street: loc.street,
            building: loc.building,
            floor: loc.floor,
            maps_url: loc.maps_url || ''
          });
        }
      } else if (loc.title) {
        await Location.create({
          profile_id: profile.id,
          title: loc.title,
          country: loc.country,
          state: loc.state,
          city: loc.city,
          street: loc.street,
          building: loc.building,
          floor: loc.floor,
          maps_url: loc.maps_url || ''
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully (mobile)'
    });
  } catch (error) {
    console.error('Error in updateUserProfileMobile:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};