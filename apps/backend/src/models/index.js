import sequelize from '../config/db.js';
import User from './userModel.js';
import Profile from './profileModel.js';
import SocialMedia from './socialMediaModel.js';
import Video from './videoModel.js';
import Location from './locationModel.js';

const models = {
  User,
  Profile,
  SocialMedia,
  Video,
  Location
};

// Set up associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export { sequelize, User, Profile, SocialMedia, Video, Location };