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
  const [editingUserId, setEditingUserId] = useState(null);

  // Filters
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

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, verifiedFilter, lockedFilter, sortBy, sortOrder]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users3`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search,
          role: roleFilter,
          verified: verifiedFilter,
          locked: lockedFilter,
          sortBy,
          sortOrder,
        },
      });

      const normalized = res.data.map((u) => ({
        ...u,
        verified: u.verified === true || u.verified === "true",
        visibility: !(u.visibility === false || u.visibility === "false"),
      }));

      setUsers(normalized);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("You are not authorized to view this page");
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

  const getLockedStatus = (user) => (user.visibility ? "No" : "Yes");
  const getLockedStyle = (user) =>
    !user.visibility ? { color: "red", fontWeight: "bold" } : {};

  return (
    <div className="admin-users-page">
      <Header activeIndex={-1} />

      <div className="admin-users-container">
        <h1>Admin Panel</h1>

        {/* Search + Add */}
        <div className="admin-search-add-container">
          <input
            type="text"
            placeholder="Search by name, email or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search"
          />

          <div className="admin-add-button-container">
            <button
              className="admin-add-button"
              onClick={() => navigate("/admin/add-user")}
            >
              Add User
            </button>
          </div>
        </div>

        {/* Filters */}
<div className="admin-filters" style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
  <select
    className="dropdown-input"
    value={roleFilter}
    onChange={(e) => setRoleFilter(e.target.value)}
  >
    <option value="">All Roles</option>
    <option value="admin">Admin</option>
    <option value="user">User</option>
  </select>

  <select
    className="dropdown-input"
    value={verifiedFilter}
    onChange={(e) => setVerifiedFilter(e.target.value)}
  >
    <option value="">All</option>
    <option value="true">Verified</option>
    <option value="false">Not Verified</option>
  </select>

  <select
    className="dropdown-input"
    value={lockedFilter}
    onChange={(e) => setLockedFilter(e.target.value)}
  >
    <option value="">All</option>
    <option value="true">Locked</option>
    <option value="false">Unlocked</option>
  </select>
</div>


        {/* Table */}
        <div className="admin-users-table-container">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("joined_at")}>
                  Date Joined{" "}
                  {sortBy === "joined_at" ? (sortOrder === "ASC" ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("name")}>
                  Name {sortBy === "name" ? (sortOrder === "ASC" ? "▲" : "▼") : ""}
                </th>
                <th>Email</th>
                <th onClick={() => handleSort("role")}>
                  Role {sortBy === "role" ? (sortOrder === "ASC" ? "▲" : "▼") : ""}
                </th>
                <th>Verified</th>
                <th>Locked</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => {
                const isEditing = editingUserId === user.profile_id;

                return (
                  <tr
                    key={user.profile_id}
                    className={isEditing ? "editing" : ""}
                  >
                    <td>{new Date(user.joined_at).toLocaleDateString()}</td>

                    <td>
                      {isEditing ? (
                        <input
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
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
                        />
                      ) : (
                        user.email
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <input
                          name="role"
                          value={editForm.role}
                          onChange={handleEditChange}
                        />
                      ) : (
                        user.role
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <input
                          type="checkbox"
                          name="verified"
                          checked={editForm.verified}
                          onChange={handleEditChange}
                        />
                      ) : user.verified ? (
                        "Yes"
                      ) : (
                        "No"
                      )}
                    </td>

                    <td style={getLockedStyle(user)}>
                      {isEditing ? (
                        <input
                          type="checkbox"
                          name="locked"
                          checked={!editForm.visibility}
                          onChange={handleEditChange}
                        />
                      ) : (
                        getLockedStatus(user)
                      )}
                    </td>

                    <td>
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
                            onClick={() =>
                              navigate(`/profile/${user.profile_id}`)
                            }
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
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminUsers;
