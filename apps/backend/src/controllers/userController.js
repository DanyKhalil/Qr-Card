import { 
  User, 
  Profile, 
  SocialMedia, 
  Video, 
  Location, 
  CustomContentType, 
  ProfileFollow, 
  CustomContentItem, 
  CustomContentField, 
  CustomContentValue,
  UserSubscription,
  SubscriptionPlan,
} from '../models/index.js';

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

// === to get user profuoe info ----
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
              attributes: ['id', 'url', 'display_order', 'created_at']
            },
            {
              model: Video,
              as: 'videos',
              attributes: ['id', 'video_url', 'title', 'description', 'display_order', 'created_at']
            },
            {
              model: Location,
              as: 'locations',
              attributes: [
                'id', 'title', 'country', 'state', 'city', 'street',
                'building', 'floor', 'maps_url', 'latitude', 'longitude', 'created_at'
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
                    'field_type', 'required', 'display_order', 'config', 'created_at'
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
                        'id', 'value_text', 'value_json', 'created_at'
                      ],
                      include: [
                        {
                          model: CustomContentField,
                          as: 'field',
                          attributes: [
                            'id', 'field_key', 'field_name', 'label', 'field_type', 'created_at'
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
    // ADD: fetch latest subscription
    // ---------------------------------------
    const subscriptionRecord = await UserSubscription.findOne({
      where: { profile_id: user.profile.id },
      include: [
        {
          model: SubscriptionPlan,
          as: "plan",
          attributes: ["name"]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    const now = new Date();

    let subscription = {
      is_active: false,
      status: "none",
      plan_name: null,
      expires_at: null,
      days_remaining: null,
      requires_payment: true
    };

    if (subscriptionRecord) {
      const endDate = subscriptionRecord.end_date
        ? new Date(subscriptionRecord.end_date)
        : null;

      // CORRECTED: Determine if subscription is currently active
      // Subscription is active if: status is "active" AND (no end date OR end date in future)
      let isActive = false;
      
      if (subscriptionRecord.status === "active") {
        if (endDate) {
          // Subscription has an end date, check if it's in the future
          isActive = endDate > now;
        } else {
          // Subscription has no end date (perpetual or manual control)
          isActive = true;
        }
      }
      // All other statuses: pending, expired, cancelled, suspended are not active
      else {
        isActive = false;
      }

      let daysRemaining = null;
      if (endDate && endDate > now) {
        daysRemaining = Math.max(
          0,
          Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
        );
      }

      // CORRECTED: Map "suspended" to "failed" for frontend compatibility
      const frontendStatus = subscriptionRecord.status === "suspended" 
        ? "failed" 
        : subscriptionRecord.status;

      subscription = {
        is_active: isActive,
        status: frontendStatus, // Use mapped status for frontend
        plan_name: subscriptionRecord.plan?.name || null,
        expires_at: subscriptionRecord.end_date,
        days_remaining: daysRemaining,
        requires_payment: !isActive // Payment required if not active
      };
    }

    // ---------------------------------------
    // Followers
    // ---------------------------------------
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
      ],
      order: [['created_at', 'ASC']]
    });

    // ---------------------------------------
    // Following
    // ---------------------------------------
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
      ],
      order: [['created_at', 'ASC']]
    });

    // Sort helper
    const sortByCreatedAt = (array) => {
      return array.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    };

    // Format Profile Base Info
    const userProfile = {
      profile_id: user.profile.id,
      name: user.name,
      cover_photo_url: user.profile.cover_pic_url,
      profile_pic_url: user.profile.profile_pic_url,
      qr_code_color: user.profile.qr_code_color, 
      qr_code_include_profile_pic: user.profile.qr_code_include_profile_pic,
      qr_code_include_contact: user.profile.qr_code_include_contact,
      qr_code_include_social: user.profile.qr_code_include_social,
      qr_code_include_website: user.profile.qr_code_include_website,
      dob: user.profile.dob,
      headline: user.profile.headline,
      bio: user.profile.bio,
      phone_number: user.profile.phone_number ? [user.profile.phone_number] : [],
      email: user.email ? [user.email] : [],
      website_link: user.profile.website,
      visibility: user.visibility,

      social_media_links: sortByCreatedAt(
        user.profile.social_media?.map(sm => ({
          id: sm.id,
          url: sm.url,
          display_order: sm.display_order,
          created_at: sm.created_at
        })) || []
      ),

      videos_links: sortByCreatedAt(
        user.profile.videos?.map(video => ({
          id: video.id,
          video_url: video.video_url,
          title: video.title,
          description: video.description,
          display_order: video.display_order,
          created_at: video.created_at
        })) || []
      ),

      locations: sortByCreatedAt(
        user.profile.locations?.map(loc => ({
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
              : null,
          created_at: loc.created_at
        })) || []
      ),

      followers: followers.map(f => ({
        follow_id: f.id,
        profile_id: f.follower?.id,
        user_id: f.follower?.user?.id,
        name: f.follower?.user?.name,
        profile_pic_url: f.follower?.profile_pic_url,
        headline: f.follower?.headline,
        bio: f.follower?.bio,
        created_at: f.created_at
      })),

      following: following.map(f => ({
        follow_id: f.id,
        profile_id: f.following?.id,
        user_id: f.following?.user?.id,
        name: f.following?.user?.name,
        profile_pic_url: f.following?.profile_pic_url,
        headline: f.following?.headline,
        bio: f.following?.bio,
        created_at: f.created_at
      })),

      custom_content: sortByCreatedAt(
        user.profile.custom_types?.map(type => ({
          id: type.id,
          name: type.name,
          slug: type.slug,
          description: type.description,
          created_at: type.created_at,

          fields: sortByCreatedAt(
            type.fields?.map(f => ({
              id: f.id,
              name: f.field_name,
              label: f.label,
              key: f.field_key,
              type: f.field_type,
              required: f.required,
              display_order: f.display_order,
              config: f.config,
              created_at: f.created_at
            })) || []
          ),

          items: sortByCreatedAt(
            type.items?.map(item => ({
              id: item.id,
              title: item.title,
              visibility: item.visibility,
              created_at: item.created_at,
              values: sortByCreatedAt(
                item.values?.map(v => ({
                  field_id: v.field?.id,
                  field_key: v.field?.field_key,
                  field_name: v.field?.field_name,
                  field_label: v.field?.label,
                  field_type: v.field?.field_type,
                  value: v.value_json ?? v.value_text,
                  created_at: v.created_at
                })) || []
              )
            })) || []
          )
        })) || []
      ),
      subscription
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
      qrCodeColor, qr_code_include_profile_pic, qr_code_include_contact, qr_code_include_social, qr_code_include_website
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
    

    // --------------------------------------------------------------
    // HANDLE ALL IMAGE UPLOADS
    // --------------------------------------------------------------
    
    // 1. Profile and Cover Photos
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

    // 2. Custom Content Images
    // Create a map of custom image files from req.files
    const customImageFiles = {};
    if (req.files && Array.isArray(req.files)) {
      
      req.files.forEach((file, index) => {
        console.log('File object:', {
          fieldname: file.fieldname,
          originalname: file.originalname,
          filename: file.filename,
          path: file.path,
          destination: file.destination,
          mimetype: file.mimetype,
          size: file.size
        });
        
        if (file.fieldname && file.fieldname.startsWith('customImage_')) {
          customImageFiles[file.fieldname] = `http://localhost:5050/uploads/custom-content/${file.filename}`;
        }
      });
    } else if (req.files && typeof req.files === 'object') {
      // Fallback for object format (if using .fields())
      Object.keys(req.files).forEach(key => {
        if (key.startsWith('customImage_')) {
          const file = req.files[key][0];
          customImageFiles[key] = `http://localhost:5050/uploads/custom-content/${file.filename}`;
        }
      });
    }


    // 3. Process custom content to replace image placeholders with actual URLs
    const processedCustomContent = parsedCustomContent.map(contentType => ({
      ...contentType,
      items: contentType.items?.map(item => ({
        ...item,
        values: item.values?.map(value => {
          // Check if this is an image field that has a placeholder
          if (value.field_type === 'image' && value.value && typeof value.value === 'string' && value.value.startsWith('__IMAGE_PLACEHOLDER_')) {
            // Extract the key from placeholder
            const placeholderMatch = value.value.match(/__IMAGE_PLACEHOLDER_(.*)__/);
            if (placeholderMatch && placeholderMatch[1]) {
              const imageKey = `customImage_${placeholderMatch[1]}`;
              // Replace with actual URL if we have it
              if (customImageFiles[imageKey]) {
                return {
                  ...value,
                  value: customImageFiles[imageKey]
                };
              }
            }
          }
          return value;
        })
      }))
    }));

    // --------------------------------------------------------------
    // DATABASE OPERATIONS
    // --------------------------------------------------------------
    
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
      qr_code_color: qrCodeColor || "#000000",
      qr_code_include_profile_pic: qr_code_include_profile_pic || true,
      qr_code_include_contact: qr_code_include_contact || true,
      qr_code_include_social: qr_code_include_social || true,
      qr_code_include_website: qr_code_include_website || true,
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

    // CUSTOM CONTENT UPDATE - with image handling
    for (let incomingType of processedCustomContent) {
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
              // For image type, store URL in value_text (since it's a string)
              if (incomingValue.field_type === 'image') {
                await CustomContentValue.create({
                  content_item_id: newItemRecord.id,
                  content_field_id: realFieldId,
                  value_text: incomingValue.value, // Image URL
                  value_json: null
                });
              } else {
                await CustomContentValue.create({
                  content_item_id: newItemRecord.id,
                  content_field_id: realFieldId,
                  value_text: ['longtext', 'text'].includes(incomingValue.field_type) ? incomingValue.value : null,
                  value_json: !['longtext', 'text'].includes(incomingValue.field_type) ? incomingValue.value : null
                });
              }
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
                // For image type, store URL in value_text
                if (incomingValue.field_type === 'image') {
                  await CustomContentValue.create({
                    content_item_id: newItemRecord.id,
                    content_field_id: realFieldId,
                    value_text: incomingValue.value, // Image URL
                    value_json: null
                  });
                } else {
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
                if (incomingValue.field_type === 'image') {
                  await existingValue.update({
                    value_text: incomingValue.value, // Image URL
                    value_json: null
                  });
                } else {
                  await existingValue.update({
                    value_text: ['longtext', 'text'].includes(incomingValue.field_type) ? incomingValue.value : null,
                    value_json: !['longtext', 'text'].includes(incomingValue.field_type) ? incomingValue.value : null
                  });
                }
              } else {
                // CREATE NEW VALUE
                const fieldExists = await CustomContentField.findOne({
                  where: { id: realFieldId, content_type_id: existingType.id }
                });
                
                if (fieldExists) {
                  if (incomingValue.field_type === 'image') {
                    await CustomContentValue.create({
                      content_item_id: existingItem.id,
                      content_field_id: realFieldId,
                      value_text: incomingValue.value, // Image URL
                      value_json: null
                    });
                  } else {
                    await CustomContentValue.create({
                      content_item_id: existingItem.id,
                      content_field_id: realFieldId,
                      value_text: ['longtext', 'text'].includes(incomingValue.field_type) ? incomingValue.value : null,
                      value_json: !['longtext', 'text'].includes(incomingValue.field_type) ? incomingValue.value : null
                    });
                  }
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
      let typeExists = processedCustomContent.find(type => type.id === existingType.id);
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