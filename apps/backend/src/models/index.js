import sequelize from '../config/db.js';
import User from './userModel.js';
import Profile from './profileModel.js';
import SocialMedia from './socialMediaModel.js';
import Video from './videoModel.js';
import Location from './locationModel.js';
import ProfileAnalytics from './profileAnalytics.js'
import CustomContentType from './customeContentType.js';
import CustomContentItem from './customContentItem.js';
import CustomContentField from './customContentField.js';
import CustomContentValue from './customContentValue.js';

const models = {
  User,
  Profile,
  SocialMedia,
  Video,
  Location,
  ProfileAnalytics,
  CustomContentType,
  CustomContentItem,
  CustomContentField,
  CustomContentValue
};

// Set up associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export { sequelize, User, Profile, SocialMedia, Video, Location, ProfileAnalytics,  
        CustomContentType, CustomContentItem, CustomContentField, CustomContentValue,
};