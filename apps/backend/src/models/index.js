import sequelize from '../config/db.js';
import User from './userModel.js';
import Profile from './profileModel.js';
import SocialMedia from './socialMediaModel.js';
import Video from './videoModel.js';
import Location from './locationModel.js';
import ProfileAnalytics from './profileAnalytics.js'
import ProfileFollow from './ProfileFollow.js';
import CustomContentType from './customeContentType.js';
import CustomContentItem from './customContentItem.js';
import CustomContentField from './customContentField.js';
import CustomContentValue from './customContentValue.js';
import Notification from './notificationModel.js';
import SubscriptionPlan from './subscriptionPlan.js';
import UserSubscription from './userSubscription.js';
import Payment from './paymentModel.js';

const models = {
  User,
  Profile,
  SocialMedia,
  Video,
  Location,
  ProfileAnalytics,
  ProfileFollow,
  CustomContentType,
  CustomContentItem,
  CustomContentField,
  CustomContentValue,
  Notification,
  SubscriptionPlan,
  UserSubscription,
  Payment,
};

// Set up associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export { sequelize, User, Profile, SocialMedia, Video, Location, ProfileAnalytics,  ProfileFollow,
        CustomContentType, CustomContentItem, CustomContentField, CustomContentValue, Notification,
        SubscriptionPlan, UserSubscription, Payment,
};
