import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Style/AdminUsers.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);

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
  }, [search]);

  // ======================
  // FETCH USERS + Normalize booleans
  // ======================
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5050/api/users3?search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Normalize booleans (fixes locked column issue)
      console.log(res.data)
      const normalized = res.data.map((u) => ({
        ...u,
        visibility:
          u.visibility === false || u.visibility === "false" ? false : true,
        verified: u.verified === true || u.verified === "true" ? true : false,
      }));

      setUsers(normalized);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("You are not authorized to view this page");
    }
  };

  // ======================
  // DELETE USER
  // ======================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5050/api/users3/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.filter((user) => user.id !== id));
      alert("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  // ======================
  // EDIT USER
  // ======================
  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified,
      visibility: user.visibility, // true = unlocked
    });
  };

  // ======================
  // HANDLE EDIT CHANGES
  // ======================
  const handleEditChange = (e) => {
    const { name, type, checked, value } = e.target;

    if (name === "locked") {
      // locked checked → visibility false
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

  // ======================
  // UPDATE USER
  // ======================
  const handleUpdate = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:5050/api/users3/${id}`,
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(users.map((user) => (user.id === id ? res.data.user : user)));
      setEditingUserId(null);
      alert("User updated successfully");
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
      alert(err.response?.data?.error || "Failed to update user");
    }
  };

  // ======================
  // Display Locked Column
  // ======================
  const getLockedStatus = (user) => {
    return user.visibility ? "No" : "Yes"; // visibility true = not locked
  };

  const getLockedStyle = (user) => {
    return !user.visibility
      ? { color: "red", fontWeight: "bold" }
      : {};
  };

  // ======================
  // RENDER
  // ======================
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
          <button
            className="admin-add-button"
            onClick={() => navigate("/admin/add-user")}
          >
            Add User
          </button>
        </div>

        <table className="admin-users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Verified</th>
              <th>Locked</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const isEditing = editingUserId === user.id;

              return (
                <tr key={user.id}>
                  <td>{user.id}</td>

                  {/* NAME */}
                  <td>
                    {isEditing ? (
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

                  {/* EMAIL */}
                  <td>
                    {isEditing ? (
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

                  {/* ROLE */}
                  <td>
                    {isEditing ? (
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

                  {/* VERIFIED */}
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

                  {/* LOCKED */}
                  <td style={getLockedStyle(user)}>
                    {isEditing ? (
                      <input
                        type="checkbox"
                        name="locked"
                        checked={!editForm.visibility} // locked = !visibility
                        onChange={handleEditChange}
                      />
                    ) : (
                      getLockedStatus(user)
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td>
                    {isEditing ? (
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
              );
            })}
          </tbody>
        </table>
      </div>

      <Footer />
    </div>
  );
};

export default AdminUsers;
