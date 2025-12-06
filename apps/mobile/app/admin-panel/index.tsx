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
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEVELOPMENT_CONFIG } from '../../src/config/development';

export default function AdminUsersMobile() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "", verified: false });
  const [error, setError] = useState("");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", email: "", password: "", role: "client" });
  const [roleDropdownVisible, setRoleDropdownVisible] = useState(false);
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

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      const res = await axios.get(`${DEVELOPMENT_CONFIG.backendBaseUrl}/api/users3`, {
        params: { search },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setUsers(Array.isArray(res.data) ? res.data : []);
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
    });
  };

  const handleEditChange = (key, value) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = async (id) => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await axios.put(`${DEVELOPMENT_CONFIG.backendBaseUrl}/api/users3/${id}`, editForm, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const updatedUser = res.data?.user || res.data || { id, ...editForm };
      setUsers((prev) => prev.map((u) => (u.id === id ? updatedUser : u)));
      setEditingUserId(null);
      Alert.alert("Success", "User updated successfully!");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update user");
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

  // Add user handlers
  const handleAddChange = (key, value) => {
    setAddForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddSubmit = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      await axios.post(`${DEVELOPMENT_CONFIG.backendBaseUrl}/api/users3`, addForm, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      Alert.alert("Success", "User created successfully!");
      setAddForm({ name: "", email: "", password: "", role: "client" });
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

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View style={styles.container}>
        <Text style={styles.header}>Admin — Users</Text>

        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search by name or role..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
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
          <ActivityIndicator style={{ marginTop: 20 }} size="large" />
        ) : (
          <ScrollView style={{ flex: 1 }}>
            {users.length === 0 ? (
              <Text style={{ textAlign: "center", marginTop: 20, color: "#777" }}>
                No users found
              </Text>
            ) : (
              users.map((user) => {
                const isEditing = editingUserId === user.id;
                return (
                  <View key={user.id} style={styles.userCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.userName}>{user.name}</Text>
                      <Text style={styles.userEmail}>{user.email}</Text>
                      <Text style={styles.userRole}>Role: {user.role}</Text>
                      <Text style={styles.userVerified}>Verified: {user.verified ? "Yes" : "No"}</Text>
                    </View>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <TouchableOpacity
                        style={[styles.cardButton, { backgroundColor: "#4CAF50" }]}
                        onPress={() => handleEdit(user)}
                      >
                        <Text style={{ color: "#fff" }}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.cardButton, { backgroundColor: "#F44336" }]}
                        onPress={() => handleDelete(user.id)}
                      >
                        <Text style={{ color: "#fff" }}>Delete</Text>
                      </TouchableOpacity>
                    </View>
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
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Add New User</Text>

              <TextInput
                placeholder="Full Name"
                value={addForm.name}
                onChangeText={(v) => handleAddChange("name", v)}
                style={styles.modalInput}
              />
              <TextInput
                placeholder="Email"
                value={addForm.email}
                onChangeText={(v) => handleAddChange("email", v)}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.modalInput}
              />
              <TextInput
                placeholder="Password"
                value={addForm.password}
                onChangeText={(v) => handleAddChange("password", v)}
                secureTextEntry
                style={styles.modalInput}
              />

              {/* Custom Role Dropdown */}
              <View style={{ marginBottom: 12 }}>
                <Text style={{ marginBottom: 4, color: "#333", fontWeight: "600" }}>Role</Text>
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

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={handleAddSubmit}
                >
                  <Text style={styles.actionText}>Create</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => {
                    setAddModalVisible(false);
                    setRoleDropdownVisible(false);
                  }}
                >
                  <Text style={styles.actionText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA", padding: 12 },
  header: { fontSize: 20, fontWeight: "700", marginBottom: 12, color: "#333" },
  searchRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  searchInput: { flex: 1, height: 42, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 10, backgroundColor: "#fff" },
  addButton: { marginLeft: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: "#4C8F66", justifyContent: "center", alignItems: "center" },
  addButtonText: { color: "#fff", fontWeight: "600" },
  errorText: { color: "red", marginTop: 8, marginBottom: 8, textAlign: "center" },
  userCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  userName: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  userEmail: { fontSize: 14, color: "#555", marginBottom: 2 },
  userRole: { fontSize: 14, color: "#333", marginBottom: 2 },
  userVerified: { fontSize: 14, color: "#333" },
  cardButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 16, textAlign: "center" },
  modalInput: { height: 48, borderColor: "#ddd", borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, marginBottom: 12, backgroundColor: "#fff", justifyContent: "center" },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
  actionButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  saveButton: { backgroundColor: "#4CAF50" },
  cancelButton: { backgroundColor: "#EEE" },
  actionText: { fontWeight: "700", color: "#fff", textAlign: "center" },
  dropdownMenu: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, backgroundColor: "#fff", marginTop: 2, overflow: "hidden" },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
});
