import { useLocation } from 'react-router-dom';
import ProfileList from "./ProfileList";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import "./ProfileListPage.css"

const ProfileListPage = () => {
  const location = useLocation();
  const { title = "Followers", profiles = [] } = location.state || {};

  return (
    <div className="profile-list-page">
      <Header />

      <div className="profile-list-container">
        <h1 className="page-title">{title}</h1>
        {profiles.length > 0 ? (
          <ProfileList profiles={profiles} />
        ) : (
          <div className="no-profiles">
            <p>No {title.toLowerCase()} yet.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProfileListPage;
