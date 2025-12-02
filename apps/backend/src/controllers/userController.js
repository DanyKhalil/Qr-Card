import { User, Profile, SocialMedia, Video, Location, CustomContentType, ProfileFollow, CustomContentItem, CustomContentField, CustomContentValue } from '../models/index.js';

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

export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // find user and profile
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

    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.profile) return res.status(404).json({ error: "Profile not found for this user" });

    const profileId = user.profile.id;

    // ---------------------------------------
    // ---------------------------------------

    // Followers: profiles that FOLLOW this profile
    const followers = await ProfileFollow.findAll({
      where: { following_profile_id: profileId },
      include: [
        {
          model: Profile,
          as: "follower",
          attributes: ["id", "profile_pic_url", "headline", "bio"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name"]
            }
          ]
        }
      ]
    });

    // Following: profiles this profile is FOLLOWING
    const following = await ProfileFollow.findAll({
      where: { follower_profile_id: profileId },
      include: [
        {
          model: Profile,
          as: "following",
          attributes: ["id", "profile_pic_url", "headline", "bio"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name"]
            }
          ]
        }
      ]
    });

    // ---------------------------------------
    // format to JSON-friendly structure
    // ---------------------------------------

    // Format Profile Base Info
    const userProfile = {
      name: user.name,
      cover_photo_url: user.profile.cover_pic_url,
      profile_pic_url: user.profile.profile_pic_url,
      qr_code_color: user.profile.qr_code_color, 
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
      
      followers: followers.map(f => ({
        follow_id: f.id,
        profile_id: f.follower?.id,
        user_id: f.follower?.user?.id,
        name: f.follower?.user?.name,
        profile_pic_url: f.follower?.profile_pic_url,
        headline: f.follower?.headline,
        bio: f.follower?.bio
      })),

      following: following.map(f => ({
        follow_id: f.id,
        profile_id: f.following?.id,
        user_id: f.following?.user?.id,
        name: f.following?.user?.name,
        profile_pic_url: f.following?.profile_pic_url,
        headline: f.following?.headline,
        bio: f.following?.bio
      })),

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
      connectLinks, videos, locations, customContent,
      coverPhotoPath, profilePhotoPath,
      qrCodeColor
    } = req.body;

    if (!id) {
      return res.status(403).json({
        success:false,
        message: 'Unauthorized User'
      })
    }

    // Parse JSON strings
    const parsedConnectLinks = connectLinks ? JSON.parse(connectLinks) : [];
    const parsedVideos = videos ? JSON.parse(videos) : [];
    const parsedLocations = locations ? JSON.parse(locations) : [];
    const parsedCustomContent = customContent ? JSON.parse(customContent) : [];
    

    // Handling cover and profile picture changes
    let finalProfilePhotoPath = profilePhotoPath;
    let finalCoverPhotoPath = coverPhotoPath;

    // Check if new profile picture was uploaded
    if (req.files && req.files.profilePicture) {
      const profileFile = req.files.profilePicture[0];
      finalProfilePhotoPath = `http://localhost:5050/uploads/profiles/${profileFile.filename}`;
    } else {
      finalProfilePhotoPath = profilePhotoPath || null;
    }
    // Check if new cover photo was uploaded
    if (req.files && req.files.coverPhoto) {
      const coverFile = req.files.coverPhoto[0];
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
    const existingCustomTypes = await CustomContentType.findAll({
      where: {profile_id: profile.id},
      include: [
        {
          model: CustomContentField,
          as: 'fields'
        },
        {
          model: CustomContentItem,
          as: 'items',
          include: [{
            model: CustomContentValue,
            as: 'values'
          }]
        }
      ]
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
      qr_code_color: qrCodeColor || "#000000"
    })

    // Social media links update
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
    for (let link of parsedConnectLinks) {
      let newLink = checkIfNew(link.id, socialMediaLinks);
      if (newLink) {
        if (link.url) {
          await SocialMedia.create({
            profile_id: profile.id,
            url: link.url
          })
        }
      }
    }

    // Videos links update
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

    // Locations update
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

    // CUSTOM CONTENT UPDATE - Fixed handling with field ID mapping
    for (let incomingType of parsedCustomContent) {
      let existingType = existingCustomTypes.find(type => type.id === incomingType.id);
      
      if (!existingType) {
        // CREATE NEW TYPE
        const newTypeRecord = await CustomContentType.create({
          profile_id: profile.id,
          name: incomingType.name,
          slug: incomingType.slug,
          description: incomingType.description
        });

        // Create field mapping for temporary IDs
        const fieldIdMap = {};
        
        // Add fields for the new type
        for (let incomingField of incomingType.fields || []) {
          const newField = await CustomContentField.create({
            content_type_id: newTypeRecord.id,
            field_name: incomingField.name,
            label: incomingField.label,
            field_key: incomingField.key,
            field_type: incomingField.type,
            required: incomingField.required,
            display_order: incomingField.display_order,
            config: incomingField.config
          });
          // Map temporary frontend ID to real backend ID
          fieldIdMap[incomingField.id] = newField.id;
        }

        // Add items for the new type
        for (let incomingItem of incomingType.items || []) {
          const newItemRecord = await CustomContentItem.create({
            content_type_id: newTypeRecord.id,
            profile_id: profile.id,
            title: incomingItem.title,
            visibility: incomingItem.visibility
          });

          // Add values for the new item
          for (let incomingValue of incomingItem.values || []) {
            const realFieldId = fieldIdMap[incomingValue.field_id];
            if (realFieldId) {
              await CustomContentValue.create({
                content_item_id: newItemRecord.id,
                content_field_id: realFieldId,
                value_text: ['longtext', 'text'].includes(incomingValue.field_type) ? incomingValue.value : null,
                value_json: !['longtext', 'text'].includes(incomingValue.field_type) ? incomingValue.value : null
              });
            }
          }
        }
      } else {
        // UPDATE EXISTING TYPE
        await existingType.update({
          name: incomingType.name,
          slug: incomingType.slug,
          description: incomingType.description
        });

        // Handle fields for this type - with ID mapping
        const fieldIdMap = {};
        const existingFields = existingType.fields || [];

        for (let incomingField of incomingType.fields || []) {
          let existingField = existingFields.find(f => f.id === incomingField.id);
          
          if (!existingField) {
            // CREATE NEW FIELD
            const newField = await CustomContentField.create({
              content_type_id: existingType.id,
              field_name: incomingField.name,
              label: incomingField.label,
              field_key: incomingField.key,
              field_type: incomingField.type,
              required: incomingField.required,
              display_order: incomingField.display_order,
              config: incomingField.config
            });
            fieldIdMap[incomingField.id] = newField.id;
          } else {
            // UPDATE EXISTING FIELD
            await existingField.update({
              field_name: incomingField.name,
              label: incomingField.label,
              field_key: incomingField.key,
              field_type: incomingField.type,
              required: incomingField.required,
              display_order: incomingField.display_order,
              config: incomingField.config
            });
            fieldIdMap[incomingField.id] = existingField.id;
          }
        }

        // Delete fields that were removed
        for (let existingField of existingFields) {
          let fieldExists = incomingType.fields?.find(f => f.id === existingField.id);
          if (!fieldExists) {
            await CustomContentField.destroy({ where: { id: existingField.id } });
          }
        }

        // Handle items for this type
        const existingItems = existingType.items || [];

        for (let incomingItem of incomingType.items || []) {
          let existingItem = existingItems.find(it => it.id === incomingItem.id);
          
          if (!existingItem) {
            // CREATE NEW ITEM
            const newItemRecord = await CustomContentItem.create({
              content_type_id: existingType.id,
              profile_id: profile.id,
              title: incomingItem.title,
              visibility: incomingItem.visibility
            });

            // Add values for the new item
            for (let incomingValue of incomingItem.values || []) {
              const realFieldId = fieldIdMap[incomingValue.field_id] || incomingValue.field_id;
              const fieldExists = await CustomContentField.findOne({
                where: { id: realFieldId, content_type_id: existingType.id }
              });
              
              if (fieldExists) {
                await CustomContentValue.create({
                  content_item_id: newItemRecord.id,
                  content_field_id: realFieldId,
                  value_text: ['longtext', 'text'].includes(incomingValue.field_type) ? incomingValue.value : null,
                  value_json: !['longtext', 'text'].includes(incomingValue.field_type) ? incomingValue.value : null
                });
              }
            }
          } else {
            // UPDATE EXISTING ITEM
            await existingItem.update({
              title: incomingItem.title,
              visibility: incomingItem.visibility
            });

            // Handle values for this item
            const existingValues = existingItem.values || [];

            // Update or create values
            for (let incomingValue of incomingItem.values || []) {
              const realFieldId = fieldIdMap[incomingValue.field_id] || incomingValue.field_id;
              let existingValue = existingValues.find(v => v.content_field_id === realFieldId);

              if (existingValue) {
                // UPDATE EXISTING VALUE
                await existingValue.update({
                  value_text: ['longtext', 'text'].includes(incomingValue.field_type) ? incomingValue.value : null,
                  value_json: !['longtext', 'text'].includes(incomingValue.field_type) ? incomingValue.value : null
                });
              } else {
                // CREATE NEW VALUE
                const fieldExists = await CustomContentField.findOne({
                  where: { id: realFieldId, content_type_id: existingType.id }
                });
                
                if (fieldExists) {
                  await CustomContentValue.create({
                    content_item_id: existingItem.id,
                    content_field_id: realFieldId,
                    value_text: ['longtext', 'text'].includes(incomingValue.field_type) ? incomingValue.value : null,
                    value_json: !['longtext', 'text'].includes(incomingValue.field_type) ? incomingValue.value : null
                  });
                }
              }
            }

            // Delete values that were removed
            for (let existingValue of existingValues) {
              let valueExists = incomingItem.values?.find(v => {
                const realFieldId = fieldIdMap[v.field_id] || v.field_id;
                return realFieldId === existingValue.content_field_id;
              });
              if (!valueExists) {
                await CustomContentValue.destroy({ where: { id: existingValue.id } });
              }
            }
          }
        }

        // Delete items that were removed
        for (let existingItem of existingItems) {
          let itemExists = incomingType.items?.find(it => it.id === existingItem.id);
          if (!itemExists) {
            await CustomContentItem.destroy({ where: { id: existingItem.id } });
          }
        }
      }
    }

    // Delete types that were removed
    for (let existingType of existingCustomTypes) {
      let typeExists = parsedCustomContent.find(type => type.id === existingType.id);
      if (!typeExists) {
        await CustomContentType.destroy({ where: { id: existingType.id } });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
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