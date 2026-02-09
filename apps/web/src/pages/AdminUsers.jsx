import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Style/AdminUsers.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
    hasNext: false,
    hasPrev: false
  });

  // Filters (keeping same structure)
  const [roleFilter, setRoleFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");
  const [lockedFilter, setLockedFilter] = useState("");

  // Sorting
  const [sortBy, setSortBy] = useState("joined_at");
  const [sortOrder, setSortOrder] = useState("DESC");

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "",
    verified: false,
    visibility: true,
  });

  // Reset password state
  const [resetPasswordUserId, setResetPasswordUserId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, roleFilter, verifiedFilter, lockedFilter, sortBy, sortOrder]);

  // Fetch users with pagination
  useEffect(() => {
    fetchUsers();
  }, [currentPage, debouncedSearch, roleFilter, verifiedFilter, lockedFilter, sortBy, sortOrder]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const res = await axios.get(`${API_BASE_URL}/api/users3`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: debouncedSearch,
          role: roleFilter,
          verified: verifiedFilter,
          locked: lockedFilter,
          sortBy,
          sortOrder,
          page: currentPage,
          limit: pagination.limit
        },
      });

      // Handle response - check if it has pagination data or is just array
      if (res.data.success && res.data.users && res.data.pagination) {
        // New paginated response
        const normalized = res.data.users.map((u) => ({
          ...u,
          verified: u.verified === true || u.verified === "true",
          visibility: !(u.visibility === false || u.visibility === "false"),
        }));
        setUsers(normalized);
        setPagination(res.data.pagination);
      } else if (Array.isArray(res.data)) {
        // Old response format (array)
        const normalized = res.data.map((u) => ({
          ...u,
          verified: u.verified === true || u.verified === "true",
          visibility: !(u.visibility === false || u.visibility === "false"),
        }));
        setUsers(normalized);
        // Create pagination info from array
        setPagination({
          page: 1,
          limit: res.data.length,
          total: res.data.length,
          pages: 1,
          hasNext: false,
          hasPrev: false
        });
      } else if (res.data.data && res.data.pagination) {
        // Alternative response format
        const normalized = res.data.data.map((u) => ({
          ...u,
          verified: u.verified === true || u.verified === "true",
          visibility: !(u.visibility === false || u.visibility === "false"),
        }));
        setUsers(normalized);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("You are not authorized to view this page");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(column);
      setSortOrder("DESC");
    }
  };

  const handleDelete = async (profileId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/users3/${profileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("User deleted successfully");
      fetchUsers(); // refresh table after deletion
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user.profile_id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified,
      visibility: user.visibility,
    });
  };

  const handleEditChange = (e) => {
    const { name, type, checked, value } = e.target;

    if (name === "locked") {
      setEditForm((prev) => ({
        ...prev,
        visibility: !checked,
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleUpdate = async (profileId) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/users3/${profileId}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(
        users.map((u) => (u.profile_id === profileId ? res.data.user : u))
      );

      setEditingUserId(null);
      alert("User updated successfully");
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
      alert(err.response?.data?.error || "Failed to update user");
    }
  };

  const handleFilterChange = (name, value) => {
    // Keep existing filter setters but add pagination reset
    if (name === "role") setRoleFilter(value);
    if (name === "verified") setVerifiedFilter(value);
    if (name === "locked") setLockedFilter(value);
  };

  const clearFilters = () => {
    setRoleFilter("");
    setVerifiedFilter("");
    setLockedFilter("");
    setSearch("");
    setSortBy("joined_at");
    setSortOrder("DESC");
  };

  const getLockedStatus = (user) => (user.visibility ? "No" : "Yes");
  const getLockedStyle = (user) =>
    !user.visibility ? { color: "red", fontWeight: "bold" } : {};

  const handleResetPassword = async (profileId) => {
    if (!newPassword) {
      setResetMessage("Please enter a new password");
      return;
    }
    setIsResetting(true);
    setResetMessage("");

    try {
      await axios.post(
        `${API_BASE_URL}/api/users3/${profileId}/reset-password`,
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResetMessage("Password reset successfully");
      setResetPasswordUserId(null);
    } catch (err) {
      console.error(err);
      setResetMessage(err.response?.data?.error || "Failed to reset password");
    } finally {
      setIsResetting(false);
    }
  };

  // Pagination navigation
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.pages) {
      setCurrentPage(page);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (loading && users.length === 0) {
    return (
      <div className="admin-users-page">
        <Header activeIndex={-1} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-users-page">
      <Header activeIndex={-1} />

      <div className="admin-users-container">
        <h1>Admin Panel - User Management</h1>

        {/* Stats Section */}
        <div className="header-stats" style={{ marginBottom: "30px" }}>
          <div className="stat-card">
            <span className="stat-label">Total Users</span>
            <span className="stat-value">{pagination.total || users.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Current Page</span>
            <span className="stat-value">{currentPage} of {pagination.pages}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Users Per Page</span>
            <span className="stat-value">{pagination.limit}</span>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="filters-section">
          <div className="search-clear-row">
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-search"
            />
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Role</label>
              <select 
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  handleFilterChange("role", e.target.value);
                }}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Verification</label>
              <select 
                value={verifiedFilter}
                onChange={(e) => {
                  setVerifiedFilter(e.target.value);
                  handleFilterChange("verified", e.target.value);
                }}
              >
                <option value="">All Verification</option>
                <option value="true">Verified</option>
                <option value="false">Not Verified</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Account Status</label>
              <select 
                value={lockedFilter}
                onChange={(e) => {
                  setLockedFilter(e.target.value);
                  handleFilterChange("locked", e.target.value);
                }}
              >
                <option value="">All Status</option>
                <option value="true">Locked</option>
                <option value="false">Unlocked</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="joined_at">Date Joined</option>
                <option value="name">Name</option>
                <option value="role">Role</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sort Order</label>
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="DESC">Descending</option>
                <option value="ASC">Ascending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Add User Button */}
        <div className="admin-add-button-container" style={{ marginBottom: "20px" }}>
          <button
            className="admin-add-button"
            onClick={() => navigate("/admin/add-user")}
          >
            + Add New User
          </button>
        </div>

        {/* Users Table */}
        <div className="admin-users-table-container">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("joined_at")}>
                  Date Joined{" "}
                  {sortBy === "joined_at" && (sortOrder === "ASC" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("name")}>
                  Name{" "}
                  {sortBy === "name" && (sortOrder === "ASC" ? "▲" : "▼")}
                </th>
                <th>Email</th>
                <th onClick={() => handleSort("role")}>
                  Role{" "}
                  {sortBy === "role" && (sortOrder === "ASC" ? "▲" : "▼")}
                </th>
                <th>Verified</th>
                <th>Locked</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    {search || roleFilter || verifiedFilter || lockedFilter 
                      ? "No users found matching your criteria" 
                      : "No users found"}
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isEditing = editingUserId === user.profile_id;
                  const isResettingThis = resetPasswordUserId === user.profile_id;

                  return (
                    <React.Fragment key={user.profile_id}>
                      {/* Main user row */}
                      <tr className={isEditing ? "editing" : ""}>
                        <td>{formatDate(user.joined_at)}</td>

                        <td>
                          {isEditing ? (
                            <input
                              name="name"
                              value={editForm.name}
                              onChange={handleEditChange}
                              className="edit-input"
                            />
                          ) : (
                            user.name
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <input
                              name="email"
                              value={editForm.email}
                              onChange={handleEditChange}
                              className="edit-input"
                              type="email"
                            />
                          ) : (
                            user.email
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <select
                              name="role"
                              value={editForm.role}
                              onChange={handleEditChange}
                              className="edit-select"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <span className={`role-badge ${user.role}`}>
                              {user.role}
                            </span>
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <input
                              type="checkbox"
                              name="verified"
                              checked={editForm.verified}
                              onChange={handleEditChange}
                              className="edit-checkbox"
                            />
                          ) : user.verified ? (
                            <span className="verified-badge">Yes</span>
                          ) : (
                            <span className="not-verified-badge">No</span>
                          )}
                        </td>

                        <td style={getLockedStyle(user)}>
                          {isEditing ? (
                            <input
                              type="checkbox"
                              name="locked"
                              checked={!editForm.visibility}
                              onChange={handleEditChange}
                              className="edit-checkbox"
                            />
                          ) : (
                            <span className={`locked-badge ${!user.visibility ? 'locked' : 'unlocked'}`}>
                              {getLockedStatus(user)}
                            </span>
                          )}
                        </td>

                        <td>
                          <div className="action-buttons">
                            {isEditing ? (
                              <>
                                <button
                                  className="admin-update-button"
                                  onClick={() => handleUpdate(user.profile_id)}
                                >
                                  Save
                                </button>
                                <button
                                  className="admin-delete-button"
                                  onClick={() => setEditingUserId(null)}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="admin-view-button"
                                  onClick={() => navigate(`/profile/${user.profile_id}`)}
                                >
                                  View
                                </button>
                                <button
                                  className="admin-update-button"
                                  onClick={() => handleEdit(user)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="admin-delete-button"
                                  onClick={() => handleDelete(user.profile_id)}
                                >
                                  Delete
                                </button>
                                <button
                                  className="admin-reset-button"
                                  onClick={() => {
                                    setResetPasswordUserId(user.profile_id);
                                    setNewPassword("");
                                    setResetMessage("");
                                  }}
                                >
                                  Reset Password
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Reset password inline form */}
                      {isResettingThis && (
                        <tr className="reset-password-row">
                          <td colSpan="7">
                            <div className="reset-password-form">
                              <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="password-input"
                              />
                              <button
                                className="confirm-reset-btn"
                                onClick={() => handleResetPassword(user.profile_id)}
                                disabled={isResetting}
                              >
                                {isResetting ? "Resetting..." : "Confirm Reset"}
                              </button>
                              <button
                                className="cancel-reset-btn"
                                onClick={() => setResetPasswordUserId(null)}
                              >
                                Cancel
                              </button>
                              {resetMessage && (
                                <span className={`reset-message ${resetMessage.includes("successfully") ? "success" : "error"}`}>
                                  {resetMessage}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.total > pagination.limit && (
          <div className="pagination">
            <button 
              className="pagination-btn" 
              onClick={() => goToPage(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            
            <div className="page-numbers">
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                let pageNum;
                if (pagination.pages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= pagination.pages - 2) {
                  pageNum = pagination.pages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    className={`page-btn ${currentPage === pageNum ? "active" : ""}`}
                    onClick={() => goToPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              className="pagination-btn"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === pagination.pages}
            >
              Next →
            </button>
            
            <span className="page-info">
              Page {currentPage} of {pagination.pages} ({pagination.total || users.length} total users)
            </span>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminUsers;