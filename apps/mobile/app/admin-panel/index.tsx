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
  const [addModalVisible, setAddModalVisible] = useState(false); // Modal state
  const [addForm, setAddForm] = useState({ name: "", email: "", password: "", role: "user" }); // Add user form
  const debounceRef = useRef(null);

  const getToken = async () => {
    try {
      return await AsyncStorage.getItem("token");
    } catch (e) {
      console.error("Failed to read token", e);
      return null;
    }
  };

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
      console.error("Error fetching users:", err);
      setError("Failed to fetch users. You might be unauthorized.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchUsers(), 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    Alert.alert(
      "Delete user",
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
              Alert.alert("Success", "User deleted successfully");
            } catch (err) {
              console.error("Error deleting user:", err);
              Alert.alert("Error", "Failed to delete user");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

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
      Alert.alert("Success", "User updated successfully");
    } catch (err) {
      console.error("Error updating user:", err);
      Alert.alert("Error", "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  // --- Add User Handlers ---
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
      setAddForm({ name: "", email: "", password: "", role: "user" });
      setAddModalVisible(false);
      fetchUsers(); // Refresh the table
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
            autoCapitalize="none"
            returnKeyType="search"
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
            <ScrollView horizontal contentContainerStyle={{ paddingVertical: 10 }}>
              <View>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <View style={[styles.cell, styles.cellId]}>
                    <Text style={[styles.cellText, styles.headerText]}>ID</Text>
                  </View>
                  <View style={[styles.cell, styles.cellLarge]}>
                    <Text style={[styles.cellText, styles.headerText]}>Name</Text>
                  </View>
                  <View style={[styles.cell, styles.cellLarge]}>
                    <Text style={[styles.cellText, styles.headerText]}>Email</Text>
                  </View>
                  <View style={[styles.cell, styles.cellMedium]}>
                    <Text style={[styles.cellText, styles.headerText]}>Role</Text>
                  </View>
                  <View style={[styles.cell, styles.cellSmall]}>
                    <Text style={[styles.cellText, styles.headerText]}>Verified</Text>
                  </View>
                  <View style={[styles.cell, styles.cellActions]}>
                    <Text style={[styles.cellText, styles.headerText]}>Actions</Text>
                  </View>
                </View>

                {/* Table Rows */}
                {users.length === 0 ? (
                  <View style={styles.noDataRow}>
                    <Text style={styles.noDataText}>No users found.</Text>
                  </View>
                ) : (
                  users.map((user) => {
                    const isEditing = editingUserId === user.id;
                    return (
                      <View key={user.id} style={styles.tableRow}>
                        <View style={[styles.cell, styles.cellId]}>
                          <Text style={styles.cellText}>{String(user.id)}</Text>
                        </View>

                        <View style={[styles.cell, styles.cellLarge]}>
                          {isEditing ? (
                            <TextInput
                              value={editForm.name}
                              onChangeText={(v) => handleEditChange("name", v)}
                              style={styles.inlineInput}
                            />
                          ) : (
                            <Text style={styles.cellText}>{user.name}</Text>
                          )}
                        </View>

                        <View style={[styles.cell, styles.cellLarge]}>
                          {isEditing ? (
                            <TextInput
                              value={editForm.email}
                              onChangeText={(v) => handleEditChange("email", v)}
                              style={styles.inlineInput}
                              keyboardType="email-address"
                              autoCapitalize="none"
                            />
                          ) : (
                            <Text style={styles.cellText}>{user.email}</Text>
                          )}
                        </View>

                        <View style={[styles.cell, styles.cellMedium]}>
                          {isEditing ? (
                            <TextInput
                              value={editForm.role}
                              onChangeText={(v) => handleEditChange("role", v)}
                              style={styles.inlineInput}
                            />
                          ) : (
                            <Text style={styles.cellText}>{user.role}</Text>
                          )}
                        </View>

                        <View style={[styles.cell, styles.cellSmall]}>
                          {isEditing ? (
                            <Switch
                              value={editForm.verified}
                              onValueChange={(val) => handleEditChange("verified", val)}
                            />
                          ) : (
                            <Text style={styles.cellText}>{user.verified ? "Yes" : "No"}</Text>
                          )}
                        </View>

                        <View style={[styles.cell, styles.cellActions]}>
                          {isEditing ? (
                            <>
                              <TouchableOpacity
                                style={[styles.actionButton, styles.saveButton]}
                                onPress={() => handleUpdate(user.id)}
                              >
                                <Text style={styles.actionText}>Save</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[styles.actionButton, styles.cancelButton]}
                                onPress={() => setEditingUserId(null)}
                              >
                                <Text style={styles.actionText}>Cancel</Text>
                              </TouchableOpacity>
                            </>
                          ) : (
                            <>
                              <TouchableOpacity
                                style={[styles.actionButton, styles.editButton]}
                                onPress={() => handleEdit(user)}
                              >
                                <Text style={styles.actionText}>Edit</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[styles.actionButton, styles.deleteButton]}
                                onPress={() => handleDelete(user.id)}
                              >
                                <Text style={styles.actionText}>Delete</Text>
                              </TouchableOpacity>
                            </>
                          )}
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
            </ScrollView>
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
              <TextInput
                placeholder="Role (user/company/admin)"
                value={addForm.role}
                onChangeText={(v) => handleAddChange("role", v)}
                style={styles.modalInput}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={handleAddSubmit}
                >
                  <Text style={styles.actionText}>Create</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => setAddModalVisible(false)}
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
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 12, paddingTop: 18 },
  header: { fontSize: 20, fontWeight: "700", marginBottom: 12, color: "#333" },
  searchRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  searchInput: { flex: 1, height: 42, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 10 },
  addButton: { marginLeft: 8, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, backgroundColor: "#4C8F66", justifyContent: "center", alignItems: "center" },
  addButtonText: { color: "#fff", fontWeight: "600" },
  errorText: { color: "red", marginTop: 8, marginBottom: 8 },
  tableRow: { flexDirection: "row", alignItems: "center", minHeight: 56, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  tableHeader: { backgroundColor: "#fafafa" },
  cell: { paddingHorizontal: 12, paddingVertical: 10, justifyContent: "center" },
  cellId: { width: 70 },
  cellSmall: { width: 90 },
  cellMedium: { width: 120 },
  cellLarge: { width: 220 },
  cellActions: { width: 180, flexDirection: "row", justifyContent: "flex-start", gap: 8 },
  headerText: { fontWeight: "700", color: "#555" },
  cellText: { fontSize: 14, color: "#222" },
  inlineInput: { height: 36, borderColor: "#ddd", borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, fontSize: 14, backgroundColor: "#fff" },
  actionButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, marginRight: 8 },
  editButton: { backgroundColor: "#CFEFD8" },
  deleteButton: { backgroundColor: "#FFD6D6" },
  saveButton: { backgroundColor: "#CFEFD8" },
  cancelButton: { backgroundColor: "#EEE" },
  actionText: { fontWeight: "700", color: "#333", fontSize: 13 },
  noDataRow: { padding: 20 },
  noDataText: { color: "#666" },
  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "90%", backgroundColor: "#fff", borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12, textAlign: "center" },
  modalInput: { height: 42, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 10, marginBottom: 12 },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
});
