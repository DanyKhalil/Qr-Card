import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Modal,
  Platform,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEVELOPMENT_CONFIG } from '../../src/config/development';
import { Lock, LockOpen, Eye, EyeOff } from 'lucide-react-native';

export default function AdminUsersMobile() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ 
    name: "", 
    email: "", 
    role: "", 
    verified: false,
    visibility: true // true = unlocked, false = locked
  });
  const [error, setError] = useState("");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addForm, setAddForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    role: "client",
    visibility: true // default unlocked
  });
  const [roleDropdownVisible, setRoleDropdownVisible] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editPassword, setEditPassword] = useState("");
  const debounceRef = useRef(null);

  // Fetch token helper
  const getToken = async () => {
    try {
      return await AsyncStorage.getItem("token");
    } catch (e) {
      console.error("Failed to read token", e);
      return null;
    }
  };

  // Fetch users with normalized booleans (like web version)
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      const res = await axios.get(`${DEVELOPMENT_CONFIG.backendBaseUrl}/api/users3`, {
        params: { search },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      // Normalize booleans (fixes locked column issue) - same as web
      const normalized = res.data.map((u) => ({
        ...u,
        visibility: 
          u.visibility === false || u.visibility === "false" ? false : true,
        verified: u.verified === true || u.verified === "true" ? true : false,
      }));

      setUsers(Array.isArray(normalized) ? normalized : []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users. You might be unauthorized.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchUsers, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Edit user
  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "",
      verified: !!user.verified,
      visibility: user.visibility === false || user.visibility === "false" ? false : true,
    });
    setEditPassword("");
    setShowEditPassword(false);
  };

  const handleEditChange = (key, value) => {
    if (key === "locked") {
      // locked = !visibility (same as web logic)
      setEditForm((prev) => ({ ...prev, visibility: !value }));
    } else {
      setEditForm((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleUpdate = async (id) => {
    setLoading(true);
    try {
      const token = await getToken();
      const updateData = { ...editForm };
      
      // Include password only if it was changed
      if (editPassword.trim() !== "") {
        updateData.password = editPassword;
      }
      
      const res = await axios.put(
        `${DEVELOPMENT_CONFIG.backendBaseUrl}/api/users3/${id}`, 
        updateData, 
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      
      const updatedUser = res.data?.user || res.data || { id, ...editForm };
      
      // Normalize the updated user
      const normalizedUser = {
        ...updatedUser,
        visibility: 
          updatedUser.visibility === false || updatedUser.visibility === "false" ? false : true,
        verified: updatedUser.verified === true || updatedUser.verified === "true" ? true : false,
      };
      
      setUsers((prev) => prev.map((u) => (u.id === id ? normalizedUser : u)));
      setEditingUserId(null);
      setEditPassword("");
      Alert.alert("Success", "User updated successfully!");
      fetchUsers(); // Refresh data like web version
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.response?.data?.error || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDelete = (id) => {
    Alert.alert(
      "Delete User",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await getToken();
              await axios.delete(`${DEVELOPMENT_CONFIG.backendBaseUrl}/api/users3/${id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
              });
              setUsers((prev) => prev.filter((u) => u.id !== id));
              Alert.alert("Success", "User deleted successfully!");
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Failed to delete user");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Lock/Unlock user
  const handleToggleLock = async (user) => {
    const newVisibility = !user.visibility; // toggle visibility
    const action = newVisibility ? "unlock" : "lock";
    
    Alert.alert(
      `${action === "lock" ? "Lock" : "Unlock"} User`,
      `Are you sure you want to ${action} this user?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: action === "lock" ? "Lock" : "Unlock",
          style: action === "lock" ? "destructive" : "default",
          onPress: async () => {
            try {
              const token = await getToken();
              const res = await axios.put(
                `${DEVELOPMENT_CONFIG.backendBaseUrl}/api/users3/${user.id}`, 
                { 
                  ...user, 
                  visibility: newVisibility,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  verified: user.verified
                }, 
                {
                  headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                }
              );
              
              const updatedUser = res.data?.user || res.data || { ...user, visibility: newVisibility };
              const normalizedUser = {
                ...updatedUser,
                visibility: 
                  updatedUser.visibility === false || updatedUser.visibility === "false" ? false : true,
                verified: updatedUser.verified === true || updatedUser.verified === "true" ? true : false,
              };
              
              setUsers((prev) => prev.map((u) => (u.id === user.id ? normalizedUser : u)));
              Alert.alert("Success", `User ${action}ed successfully!`);
            } catch (err) {
              console.error(err);
              Alert.alert("Error", `Failed to ${action} user`);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Add user handlers
  const handleAddChange = (key, value) => {
    setAddForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddSubmit = async () => {
    if (!addForm.name || !addForm.email || !addForm.password) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }
    
    setLoading(true);
    try {
      const token = await getToken();
      await axios.post(`${DEVELOPMENT_CONFIG.backendBaseUrl}/api/users3`, addForm, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      Alert.alert("Success", "User created successfully!");
      setAddForm({ name: "", email: "", password: "", role: "client", visibility: true });
      setAddModalVisible(false);
      setRoleDropdownVisible(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.response?.data?.error || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for locked status
  const getLockedStatus = (user) => {
    return user.visibility ? "No" : "Yes"; // visibility true = not locked (same as web)
  };

  const getLockedStyle = (user) => {
    return !user.visibility
      ? { color: "#FF3B30", fontWeight: "700" }
      : { color: "#34C759" };
  };

  const getLockedIcon = (user) => {
    return !user.visibility ? (
      <Lock size={16} color="#FF3B30" />
    ) : (
      <LockOpen size={16} color="#34C759" />
    );
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Admin — Users</Text>

        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search by name or role..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setAddModalVisible(true)}
          >
            <Text style={styles.addButtonText}>Add User</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {users.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No users found</Text>
              </View>
            ) : (
              users.map((user) => {
                const isEditing = editingUserId === user.id;
                return (
                  <View key={user.id} style={styles.userCard}>
                    <View style={styles.userInfoContainer}>
                      <View style={styles.userHeaderRow}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <View style={styles.lockStatusContainer}>
                          {getLockedIcon(user)}
                          <Text style={[styles.lockStatusText, getLockedStyle(user)]}>
                            {getLockedStatus(user)}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.userEmail}>{user.email}</Text>
                      <View style={styles.userMetaRow}>
                        <Text style={styles.userRole}>Role: {user.role}</Text>
                        <Text style={[
                          styles.userVerified, 
                          user.verified ? styles.verifiedYes : styles.verifiedNo
                        ]}>
                          Verified: {user.verified ? "Yes" : "No"}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.actionsContainer}>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.lockButton]}
                        onPress={() => handleToggleLock(user)}
                      >
                        {!user.visibility ? (
                          <LockOpen size={14} color="#FFF" />
                        ) : (
                          <Lock size={14} color="#FFF" />
                        )}
                        <Text style={styles.actionButtonText}>
                          {!user.visibility ? "Unlock" : "Lock"}
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => handleEdit(user)}
                      >
                        <Text style={styles.actionButtonText}>Edit</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDelete(user.profile_id)}
                      >
                        <Text style={styles.actionButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Edit Form (expands below card when editing) */}
                    {isEditing && (
                      <View style={styles.editFormContainer}>
                        <Text style={styles.editFormTitle}>Edit User</Text>
                        
                        <TextInput
                          placeholder="Name"
                          value={editForm.name}
                          onChangeText={(v) => handleEditChange("name", v)}
                          style={styles.editInput}
                        />
                        
                        <TextInput
                          placeholder="Email"
                          value={editForm.email}
                          onChangeText={(v) => handleEditChange("email", v)}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          style={styles.editInput}
                        />
                        
                        <TextInput
                          placeholder="Role"
                          value={editForm.role}
                          onChangeText={(v) => handleEditChange("role", v)}
                          style={styles.editInput}
                        />
                        
                        <View style={styles.passwordInputContainer}>
                          <TextInput
                            placeholder="New Password (leave empty to keep current)"
                            value={editPassword}
                            onChangeText={setEditPassword}
                            secureTextEntry={!showEditPassword}
                            style={[styles.editInput, { flex: 1 }]}
                          />
                          <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={() => setShowEditPassword(!showEditPassword)}
                          >
                            {showEditPassword ? (
                              <EyeOff size={20} color="#666" />
                            ) : (
                              <Eye size={20} color="#666" />
                            )}
                          </TouchableOpacity>
                        </View>
                        
                        <View style={styles.switchRow}>
                          <Text style={styles.switchLabel}>Verified:</Text>
                          <Switch
                            value={editForm.verified}
                            onValueChange={(v) => handleEditChange("verified", v)}
                            trackColor={{ false: "#D1D1D6", true: "#34C759" }}
                          />
                          <Text style={styles.switchText}>
                            {editForm.verified ? "Yes" : "No"}
                          </Text>
                        </View>
                        
                        <View style={styles.switchRow}>
                          <Text style={styles.switchLabel}>Locked:</Text>
                          <Switch
                            value={!editForm.visibility} // locked = !visibility
                            onValueChange={(v) => handleEditChange("locked", v)}
                            trackColor={{ false: "#D1D1D6", true: "#FF3B30" }}
                          />
                          <Text style={styles.switchText}>
                            {!editForm.visibility ? "Yes" : "No"}
                          </Text>
                        </View>
                        
                        <View style={styles.editFormActions}>
                          <TouchableOpacity
                            style={[styles.editFormButton, styles.saveButton]}
                            onPress={() => handleUpdate(user.profile_id)}
                          >
                            <Text style={styles.editFormButtonText}>Save</Text>
                          </TouchableOpacity>
                          
                          <TouchableOpacity
                            style={[styles.editFormButton, styles.cancelButton]}
                            onPress={() => {
                              setEditingUserId(null);
                              setEditPassword("");
                            }}
                          >
                            <Text style={[styles.editFormButtonText, { color: "#FF3B30" }]}>Cancel</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </ScrollView>
        )}

        {/* Add User Modal */}
        <Modal
          visible={addModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setAddModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <ScrollView 
              style={styles.modalScrollView}
              contentContainerStyle={styles.modalScrollContent}
            >
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Add New User</Text>

                <TextInput
                  placeholder="Full Name *"
                  value={addForm.name}
                  onChangeText={(v) => handleAddChange("name", v)}
                  style={styles.modalInput}
                />
                <TextInput
                  placeholder="Email *"
                  value={addForm.email}
                  onChangeText={(v) => handleAddChange("email", v)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.modalInput}
                />
                <TextInput
                  placeholder="Password *"
                  value={addForm.password}
                  onChangeText={(v) => handleAddChange("password", v)}
                  secureTextEntry
                  style={styles.modalInput}
                />

                {/* Custom Role Dropdown */}
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.modalLabel}>Role *</Text>
                  <TouchableOpacity
                    style={styles.modalInput}
                    onPress={() => setRoleDropdownVisible(!roleDropdownVisible)}
                  >
                    <Text>{addForm.role.charAt(0).toUpperCase() + addForm.role.slice(1)}</Text>
                  </TouchableOpacity>

                  {roleDropdownVisible && (
                    <View style={styles.dropdownMenu}>
                      {["client", "admin"].map((roleOption) => (
                        <TouchableOpacity
                          key={roleOption}
                          onPress={() => {
                            handleAddChange("role", roleOption);
                            setRoleDropdownVisible(false);
                          }}
                          style={styles.dropdownItem}
                        >
                          <Text>{roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.modalSwitchRow}>
                  <Text style={styles.modalLabel}>Locked:</Text>
                  <Switch
                    value={!addForm.visibility} // locked = !visibility
                    onValueChange={(v) => handleAddChange("visibility", !v)}
                    trackColor={{ false: "#D1D1D6", true: "#FF3B30" }}
                  />
                  <Text style={styles.modalSwitchText}>
                    {!addForm.visibility ? "Yes" : "No"}
                  </Text>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalActionButton, styles.modalSaveButton]}
                    onPress={handleAddSubmit}
                    disabled={loading}
                  >
                    <Text style={styles.modalActionButtonText}>
                      {loading ? "Creating..." : "Create User"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalActionButton, styles.modalCancelButton]}
                    onPress={() => {
                      setAddModalVisible(false);
                      setRoleDropdownVisible(false);
                    }}
                    disabled={loading}
                  >
                    <Text style={[styles.modalActionButtonText, { color: "#FF3B30" }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F5F6FA", 
    padding: 16 
  },
  header: { 
    fontSize: 24, 
    fontWeight: "700", 
    marginBottom: 20, 
    color: "#1C1C1E",
    marginTop: Platform.OS === 'ios' ? 10 : 0,
  },
  searchRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 20 
  },
  searchInput: { 
    flex: 1, 
    height: 48, 
    borderWidth: 1, 
    borderColor: "#C7C7CC", 
    borderRadius: 10, 
    paddingHorizontal: 16, 
    backgroundColor: "#FFF",
    fontSize: 16,
    color: "#1C1C1E",
  },
  addButton: { 
    marginLeft: 12, 
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    borderRadius: 10, 
    backgroundColor: "#007AFF", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  addButtonText: { 
    color: "#FFF", 
    fontWeight: "600", 
    fontSize: 16 
  },
  errorText: { 
    color: "#FF3B30", 
    marginTop: 8, 
    marginBottom: 8, 
    textAlign: "center",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
  },
  userCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F2F2F7",
  },
  userInfoContainer: {
    marginBottom: 12,
  },
  userHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  userName: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: "#1C1C1E",
    flex: 1,
  },
  lockStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  lockStatusText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  userEmail: { 
    fontSize: 14, 
    color: "#8E8E93", 
    marginBottom: 8 
  },
  userMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userRole: { 
    fontSize: 14, 
    color: "#1C1C1E",
    fontWeight: "500",
  },
  userVerified: { 
    fontSize: 14,
    fontWeight: "500",
  },
  verifiedYes: {
    color: "#34C759",
  },
  verifiedNo: {
    color: "#FF9500",
  },
  actionsContainer: { 
    flexDirection: "row", 
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: "center",
    gap: 4,
  },
  actionButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
  lockButton: {
    backgroundColor: "#8E8E93",
  },
  editButton: {
    backgroundColor: "#007AFF",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
  editFormContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
  },
  editFormTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  editInput: {
    height: 44,
    borderWidth: 1,
    borderColor: "#C7C7CC",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "#FFF",
    fontSize: 15,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    padding: 8,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 15,
    color: "#1C1C1E",
    marginRight: 12,
    flex: 1,
  },
  switchText: {
    fontSize: 15,
    color: "#1C1C1E",
    marginLeft: 8,
    fontWeight: "500",
  },
  editFormActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
  editFormButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  editFormButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#34C759",
  },
  cancelButton: {
    backgroundColor: "#F2F2F7",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalScrollView: {
    width: "100%",
    maxHeight: "80%",
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: "700", 
    marginBottom: 20, 
    textAlign: "center",
    color: "#1C1C1E",
  },
  modalLabel: {
    fontSize: 15,
    color: "#1C1C1E",
    marginBottom: 8,
    fontWeight: "500",
  },
  modalInput: { 
    height: 48, 
    borderColor: "#C7C7CC", 
    borderWidth: 1, 
    borderRadius: 10, 
    paddingHorizontal: 16, 
    marginBottom: 16, 
    backgroundColor: "#FFF",
    justifyContent: "center",
    fontSize: 15,
    color: "#1C1C1E",
  },
  modalSwitchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  modalSwitchText: {
    fontSize: 15,
    color: "#1C1C1E",
    marginLeft: 8,
    fontWeight: "500",
  },
  modalButtons: { 
    flexDirection: "row", 
    justifyContent: "flex-end", 
    gap: 12 
  },
  modalActionButton: { 
    paddingVertical: 12, 
    paddingHorizontal: 24, 
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
  },
  modalActionButtonText: { 
    fontWeight: "600", 
    fontSize: 16,
    color: "#FFF",
  },
  modalSaveButton: { 
    backgroundColor: "#007AFF" 
  },
  modalCancelButton: { 
    backgroundColor: "#F2F2F7" 
  },
  dropdownMenu: { 
    borderWidth: 1, 
    borderColor: "#C7C7CC", 
    borderRadius: 8, 
    backgroundColor: "#FFF", 
    marginTop: 2, 
    overflow: "hidden",
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  dropdownItem: { 
    paddingVertical: 12, 
    paddingHorizontal: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: "#F2F2F7" 
  },
});
