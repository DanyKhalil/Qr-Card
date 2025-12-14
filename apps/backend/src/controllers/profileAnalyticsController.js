import { User, Profile, ProfileAnalytics, Notification } from '../models/index.js';

// ---- To get all th user profile visit for a single user ----
export const getUserProfileAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: { id: id },
      include: [{
        model: Profile,
        as: 'profile',
        attributes: ['id']
      }]
    });

    if (!user) {
      return res.status(404).json({ error: 'User was not found' });
    }

    if (!user.profile) {
      return res.status(404).json({ error: 'PROFILEEEE was not found for this user' });
    }

    const profileId = user.profile.id;

    // Get all the user visits for this profile with visitor information
    const analytics = await ProfileAnalytics.findAll({
      where: { profile_id: profileId },
      include: [{
        model: User,
        as: 'visitor',
        attributes: ['id', 'name'],
        include: [{
          model: Profile,
          as: 'profile',
          attributes: ['id', 'profile_pic_url']
        }]
      }],
      order: [['visit_date_time', 'DESC']]
    });

    // Format the response to include visitor information
    const formattedAnalytics = analytics.map(visit => ({
      id: visit.id,
      profile_id: visit.profile_id,
      qr_scan: visit.qr_scan,
      visit_date_time: visit.visit_date_time,
      created_at: visit.created_at,
      visitor: visit.visitor ? {
        user_id: visit.visitor.id,
        name: visit.visitor.name,
        profile_pic_url: visit.visitor.profile?.profile_pic_url
      } : null
    }));

    res.json(formattedAnalytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ---- To create a new profile visit when the user visit another user  ----
export const createProfileVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const { qr_scan = false } = req.body;

    // Get the visitor user ID from the bearer token (if available)
    const visitorUserId = req.userId || null;

    // If the visitor is trying to visit their own profile, don't create a visit
    if (visitorUserId && visitorUserId === id) {
      return res.status(200).json({ message: 'Cannot create visit for your own profile' });
    }

    // First, get the user's profile ID
    const user = await User.findOne({
      where: { id: id },
      include: [{
        model: Profile,
        as: 'profile',
        attributes: ['id']
      }]
    });

    if (!user) {
      return res.status(404).json({ error: 'User was not found' });
    }

    if (!user.profile) {
      return res.status(404).json({ error: 'PROFILEEEE was not found for this user' });
    }

    const profileId = user.profile.id;

    // Create the new visit record
    const newVisit = await ProfileAnalytics.create({
      profile_id: profileId,
      visitor_user_id: visitorUserId, // This will be null if no bearer token
      qr_scan: qr_scan
    });

    if (visitorUserId) {
      await Notification.create({
        user_id: id, // The profile owner
        sender_id: visitorUserId, // The visitor
        type: "profile_visit",
        title: "Profile Viewed",
        message: `${req.user?.name || "Someone"} viewed your profile`,
        metadata: {
          visitor_id: visitorUserId,
          qr_scan: qr_scan
        },
        is_read: false,
        is_sent: false,
        is_seen: false
      });
    }

    res.status(201).json(newVisit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};