import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Style/AdminUsers.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "", verified: false });

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Fetch users whenever 'search' changes
  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:5050/api/users3?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` } // <-- send token
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("You are not authorized to view this page");
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5050/api/users3/${id}`, {
        headers: { Authorization: `Bearer ${token}` } // <-- send token
      });
      setUsers(users.filter((user) => user.id !== id));
      alert("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  // Start editing a user
  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified,
    });
  };

  // Handle input changes in the edit form
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit update
  const handleUpdate = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5050/api/users3/${id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` } // <-- send token
      });
      setUsers(users.map((user) => (user.id === id ? res.data.user : user)));
      setEditingUserId(null);
      alert("User updated successfully");
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user");
    }
  };

  return (
    <div className="admin-users-page">
      <Header />

      <div className="admin-users-container">
        <h1>Admin Users</h1>

        <div className="admin-search-add-container">
          <input
            type="text"
            placeholder="Search by name or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search"
          />
          <button className="admin-add-button">Add User</button>
        </div>

        <table className="admin-users-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  {user.profile?.profile_pic_url ? (
                    <img
                      src={
                        user.profile.profile_pic_url.startsWith("http")
                          ? user.profile.profile_pic_url
                          : `http://localhost:5050${user.profile.profile_pic_url}`
                      }
                      alt={user.name}
                      className="admin-profile-pic"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  {editingUserId === user.id ? (
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editingUserId === user.id ? (
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editingUserId === user.id ? (
                    <input
                      type="text"
                      name="role"
                      value={editForm.role}
                      onChange={handleEditChange}
                    />
                  ) : (
                    user.role
                  )}
                </td>
                <td>
                  {editingUserId === user.id ? (
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
                <td>
                  {editingUserId === user.id ? (
                    <>
                      <button
                        className="admin-update-button"
                        onClick={() => handleUpdate(user.id)}
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
                        className="admin-update-button"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-delete-button"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Footer />
    </div>
  );
};

export default AdminUsers;
