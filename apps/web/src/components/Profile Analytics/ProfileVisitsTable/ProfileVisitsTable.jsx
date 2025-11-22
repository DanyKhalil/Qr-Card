import { useNavigate } from 'react-router-dom';
import './ProfileVisitsTable.css';
import { IoPersonOutline } from 'react-icons/io5';

const ProfileVisitsTable = ({ visits, dateRange }) => {
  const navigate = useNavigate();

  const formatVisitTime = (dateString) => {
    const visitDate = new Date(dateString);
    const now = new Date();
    const diffMs = now - visitDate;
    const diffMinutes = diffMs / (1000 * 60);
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffHours / 24;

    if (diffMinutes < 60) {
      return 'Less than an hour ago';
    } else if (diffHours < 24) {
      const hours = Math.floor(diffHours);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      const days = Math.floor(diffDays);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return visitDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  const getDateRangeText = () => {
    switch (dateRange) {
      case 'today':
        return 'Today';
      case '7days':
        return 'Last 7 Days';
      case '30days':
        return 'Last 30 Days';
      case 'year':
        return 'Last Year';
      default:
        return 'Recent';
    }
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleViewProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (!visits || visits.length === 0) {
    return (
      <div className="profile-visits-table">
        <h3>Profile Visits - {getDateRangeText()}</h3>
        <div className="no-visits">
          <p>No profile visits in {getDateRangeText().toLowerCase()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-visits-table">
      <div className="table-header">
        <h3>Profile Visits - {getDateRangeText()}</h3>
        <span className="visits-count">{visits.length} visits</span>
      </div>
      <div className="visits-container">
        {visits.map((visit) => (
          <div key={visit.id} className="visit-card">
            {visit.visitor ? (
              <>
                <div 
                  className="visitor-info"
                  onClick={() => handleProfileClick(visit.visitor.user_id)}
                >
                  {visit.visitor.profile_pic_url != null ? (
                    <img 
                        src={visit.visitor.profile_pic_url || '/default-avatar.png'} 
                        alt={visit.visitor.name}
                        className="visitor-avatar"
                    />
                   ) : (
                    <div className="anonymous-avatar">
                        <IoPersonOutline />
                    </div>
                  )}
                  <div className="visitor-details">
                    <h4 className="visitor-name">{visit.visitor.name}</h4>
                    <p className="visit-time">{formatVisitTime(visit.visit_date_time)}</p>
                    {visit.qr_scan && (
                      <span className="qr-badge">QR Scan</span>
                    )}
                  </div>
                </div>
                <button 
                  className="view-profile-btn"
                  onClick={() => handleViewProfileClick(visit.visitor.user_id)}
                >
                  View Profile
                </button>
              </>
            ) : (
              <div className="anonymous-visit">
                <div className="anonymous-avatar">
                    <IoPersonOutline />
                </div>
                <div className="visitor-details">
                  <h4 className="visitor-name">Anonymous Visitor</h4>
                  <p className="visit-time">{formatVisitTime(visit.visit_date_time)}</p>
                  {visit.qr_scan && (
                    <span className="qr-badge">QR Scan</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileVisitsTable;