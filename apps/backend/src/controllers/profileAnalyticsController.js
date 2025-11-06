import { User, Profile, ProfileAnalytics } from '../models/index.js';

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

    // get all the user visit for this profile
    const analytics = await ProfileAnalytics.findAll({
      where: { profile_id: profileId },
      attributes: { 
        exclude: ['visitor_user_id'] // removing visitor id for security in front end
      },
      order: [['visit_date_time', 'DESC']]
    });

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ---- To create a new profile visit when the user visit another user  ----
export const createProfileVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const { qr_scan = false } = req.body;

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

    // getting the currntly logged in user. the middelware should have put it as userId
    const visitorUserId = req.userId || null;

    // Create the new visit record
    const newVisit = await ProfileAnalytics.create({
      profile_id: profileId,
      visitor_user_id: visitorUserId,
      qr_scan: qr_scan
    });

    res.status(201).json(newVisit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};