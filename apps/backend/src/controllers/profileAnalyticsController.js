import { Profile, ProfileAnalytics, User, Notification } from '../models/index.js';

// ---- To get all the user profile visits for a single user ----
export const getUserProfileAnalytics = async (req, res) => {
  try {
    const { id: profileId } = req.params;

    const profile = await Profile.findByPk(profileId, {
      attributes: ['id']
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const analytics = await ProfileAnalytics.findAll({
      where: { profile_id: profileId },
      include: [
        {
          model: Profile,
          as: 'visitor',
          attributes: ['id', 'name', 'profile_pic_url', 'user_id']
        }
      ],
      order: [['visit_date_time', 'DESC']]
    });

    const formattedAnalytics = analytics.map(visit => ({
      id: visit.id,
      profile_id: visit.profile_id,
      qr_scan: visit.qr_scan,
      visit_date_time: visit.visit_date_time,
      created_at: visit.created_at,
      visitor: visit.visitor
        ? {
            user_id: visit.visitor.user_id,
            profile_id: visit.visitor.id,
            name: visit.visitor.name,
            profile_pic_url: visit.visitor.profile_pic_url
          }
        : null
    }));

    res.json(formattedAnalytics);
  } catch (error) {
    console.error("getUserProfileAnalytics error:", error);
    res.status(500).json({ error: error.message });
  }
};




// ---- To create a new profile visit when the user visit another user  ----
export const createProfileVisit = async (req, res) => {
  try {
    const { id } = req.params; // this is now the profile ID
    const { qr_scan = false, sender_profile_id } = req.body;


    // If no sender_profile_id, we cannot create a visit
    if (sender_profile_id) {
      // Get the profile being visited
      const profile = await Profile.findOne({
        where: { id },
        attributes: ['id', 'user_id', 'name']
      });
      const visitor_profile = await Profile.findOne({
        where: { sender_profile_id },
        attributes: ['id', 'user_id', 'name']
      });

      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      // Prevent creating a visit if the visitor is the same profile
      if (sender_profile_id === profile.id) {
        return res.status(200).json({ message: 'Cannot create visit for your own profile' });
      }

      // Create the new visit record
      const newVisit = await ProfileAnalytics.create({
        profile_id: profile.id,
        visitor_profile_id: sender_profile_id, // <-- use sender_profile_id
        qr_scan: qr_scan
      });

      // Create a notification for the profile owner
        await Notification.create({
          receiver_profile_id: profile.id,          // the profile being visited
          sender_profile_id: sender_profile_id,    // visitor's profile ID
          type: "profile_visit",
          title: "Profile Viewed",
          message: `${visitor_profile?.name || "Someone"} viewed your profile`,
          metadata: {
            visitor_profile_id: sender_profile_id,
            qr_scan: qr_scan
          },
          is_read: false,
          is_sent: false,
          is_seen: false
        });

      res.status(201).json(newVisit);
    }
    else {
      const profile = await Profile.findOne({
        where: { id },
        attributes: ['id', 'user_id', 'name']
      });
      const newVisit = await ProfileAnalytics.create({
        profile_id: profile.id,
        visitor_profile_id: null,
        qr_scan: qr_scan
      });

      // Create a notification for the profile owner
        await Notification.create({
          receiver_profile_id: profile.id,          // the profile being visited
          sender_profile_id: null,    // visitor's profile ID
          type: "profile_visit",
          title: "Profile Viewed",
          message: `Someone viewed your profile`,
          metadata: {
            visitor_profile_id: null,
            qr_scan: qr_scan
          },
          is_read: false,
          is_sent: false,
          is_seen: false
        });

      res.status(201).json(newVisit);
    }

  } catch (error) {
    console.error("createProfileVisit error:", error);
    res.status(400).json({ error: error.message });
  }
};
