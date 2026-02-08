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
  FlatList,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEVELOPMENT_CONFIG } from '../../src/config/development';
import { 
  Lock, 
  LockOpen, 
  Eye, 
  EyeOff, 
  Filter, 
  SortAsc, 
  SortDesc, 
  ChevronLeft, 
  ChevronRight,
  X,
  ChevronDown
} from 'lucide-react-native';

export default function AdminUsersMobile() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
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
  
  // NEW: Filters state
  const [filtersModalVisible, setFiltersModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    role: "",
    verified: "",
    locked: ""
  });
  
  // NEW: Sorting state
  const [sortBy, setSortBy] = useState("joined_at");
  const [sortOrder, setSortOrder] = useState("DESC");
  
  // NEW: Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
    hasNext: false,
    hasPrev: false
  });
  
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

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  // Reset to page 1 when filters/search/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filters, sortBy, sortOrder]);

  // Fetch users with pagination and filters
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      const params = {
        search: debouncedSearch,
        role: filters.role,
        verified: filters.verified,
        locked: filters.locked,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: pagination.limit
      };

      const res = await axios.get(`${DEVELOPMENT_CONFIG.backendBaseUrl}/api/users3`, {
        params,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      // Handle different response formats (same as web)
      let usersData = [];
      let paginationData = {};

      if (res.data.success && res.data.users && res.data.pagination) {
        // New paginated response
        usersData = res.data.users;
        paginationData = res.data.pagination;
      } else if (Array.isArray(res.data)) {
        // Old response format (array)
        usersData = res.data;
        paginationData = {
          page: 1,
          limit: res.data.length,
          total: res.data.length,
          pages: 1,
          hasNext: false,
          hasPrev: false
        };
      } else if (res.data.data && res.data.pagination) {
        // Alternative response format
        usersData = res.data.data;
        paginationData = res.data.pagination;
      }

      // Normalize booleans (same as web)
      const normalized = usersData.map((u) => ({
        ...u,
        visibility: u.visibility === false || u.visibility === "false" ? false : true,
        verified: u.verified === true || u.verified === "true" ? true : false,
      }));

      setUsers(normalized);
      setPagination(paginationData);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users. You might be unauthorized.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, debouncedSearch, filters, sortBy, sortOrder]);

  // NEW: Handle sort change
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(column);
      setSortOrder("DESC");
    }
  };

  // NEW: Apply filters from modal
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setFiltersModalVisible(false);
  };

  // NEW: Clear all filters
  const clearFilters = () => {
    setFilters({
      role: "",
      verified: "",
      locked: ""
    });
    setSearch("");
    setSortBy("joined_at");
    setSortOrder("DESC");
  };

  // NEW: Pagination navigation
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.pages) {
      setCurrentPage(page);
    }
  };

  // NEW: Format date for mobile
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Rest of your existing functions (handleEdit, handleUpdate, handleDelete, etc.)
  // ... [All your existing functions remain the same] ...

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
      
      const normalizedUser = {
        ...updatedUser,
        visibility: updatedUser.visibility === false || updatedUser.visibility === "false" ? false : true,
        verified: updatedUser.verified === true || updatedUser.verified === "true" ? true : false,
      };
      
      setUsers((prev) => prev.map((u) => (u.id === id ? normalizedUser : u)));
      setEditingUserId(null);
      setEditPassword("");
      Alert.alert("Success", "User updated successfully!");
      fetchUsers();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.response?.data?.error || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

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
              fetchUsers();
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

  const handleToggleLock = async (user) => {
    const newVisibility = !user.visibility;
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
                visibility: updatedUser.visibility === false || updatedUser.visibility === "false" ? false : true,
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
    return user.visibility ? "No" : "Yes";
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

  // NEW: Render user item for FlatList
  const renderUserItem = ({ item: user }) => {
    const isEditing = editingUserId === user.id;
    return (
      <View style={styles.userCard}>
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
          <Text style={styles.dateJoined}>
            Joined: {formatDate(user.joined_at)}
          </Text>
        </View>
        
        <View style={styles.actionsContainer}>
          {/* <TouchableOpacity
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
          </TouchableOpacity> */}
          
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

        {/* Edit Form */}
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
                value={!editForm.visibility}
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
  };


  // NEW: Check if any filters are active
  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== "") || 
           search !== "" || 
           sortBy !== "joined_at" || 
           sortOrder !== "DESC";
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Admin — Users</Text>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Users</Text>
            <Text style={styles.statValue}>{pagination.total || users.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Page</Text>
            <Text style={styles.statValue}>{currentPage}/{pagination.pages}</Text>
          </View>
        </View>

        {/* Search and Controls Row */}
        <View style={styles.controlsRow}>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search by name or email..."
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
              placeholderTextColor="#999"
            />
          </View>
          
          <TouchableOpacity
            style={[styles.filterButton, hasActiveFilters() && styles.filterButtonActive]}
            onPress={() => setFiltersModalVisible(true)}
          >
            <Filter size={20} color={hasActiveFilters() ? "#007AFF" : "#666"} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setAddModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Active Filters Badge */}
        {hasActiveFilters() && (
          <TouchableOpacity 
            style={styles.activeFiltersBadge}
            onPress={clearFilters}
          >
            <Text style={styles.activeFiltersText}>
              Filters Active • Tap to clear
            </Text>
            <X size={14} color="#007AFF" />
          </TouchableOpacity>
        )}

        {/* Sorting Controls */}
        <View style={styles.sortingRow}>
          <Text style={styles.sortingLabel}>Sort by:</Text>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === "joined_at" && styles.sortButtonActive]}
            onPress={() => handleSort("joined_at")}
          >
            <Text style={styles.sortButtonText}>Date Joined</Text>
            {sortBy === "joined_at" && (
              sortOrder === "ASC" ? 
                <SortAsc size={14} color="#007AFF" /> : 
                <SortDesc size={14} color="#007AFF" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === "name" && styles.sortButtonActive]}
            onPress={() => handleSort("name")}
          >
            <Text style={styles.sortButtonText}>Name</Text>
            {sortBy === "name" && (
              sortOrder === "ASC" ? 
                <SortAsc size={14} color="#007AFF" /> : 
                <SortDesc size={14} color="#007AFF" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === "role" && styles.sortButtonActive]}
            onPress={() => handleSort("role")}
          >
            <Text style={styles.sortButtonText}>Role</Text>
            {sortBy === "role" && (
              sortOrder === "ASC" ? 
                <SortAsc size={14} color="#007AFF" /> : 
                <SortDesc size={14} color="#007AFF" />
            )}
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          <>
            <FlatList
              data={users}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.profile_id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {hasActiveFilters() 
                      ? "No users found matching your criteria" 
                      : "No users found"}
                  </Text>
                </View>
              }
            />

            {/* Pagination Controls */}
            {pagination.total > pagination.limit && (
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
                  onPress={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={20} color={currentPage === 1 ? "#999" : "#007AFF"} />
                </TouchableOpacity>
                
                <Text style={styles.pageInfo}>
                  Page {currentPage} of {pagination.pages}
                </Text>
                
                <TouchableOpacity
                  style={[styles.paginationButton, currentPage === pagination.pages && styles.paginationButtonDisabled]}
                  onPress={() => goToPage(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                >
                  <ChevronRight size={20} color={currentPage === pagination.pages ? "#999" : "#007AFF"} />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {/* Filters Modal */}
        <Modal
          visible={filtersModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setFiltersModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.filtersModalContainer}>
              <View style={styles.filtersModalHeader}>
                <Text style={styles.filtersModalTitle}>Filters & Sort</Text>
                <TouchableOpacity
                  onPress={() => setFiltersModalVisible(false)}
                  style={styles.closeButton}
                >
                  <X size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.filtersModalContent}>
                {/* Role Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Role</Text>
                  <View style={styles.filterOptions}>
                    {["", "admin", "user"].map((role) => (
                      <TouchableOpacity
                        key={role || "all"}
                        style={[
                          styles.filterOption,
                          filters.role === role && styles.filterOptionActive
                        ]}
                        onPress={() => setFilters(prev => ({ ...prev, role }))}
                      >
                        <Text style={[
                          styles.filterOptionText,
                          filters.role === role && styles.filterOptionTextActive
                        ]}>
                          {role === "" ? "All Roles" : role === "admin" ? "Admin" : "User"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Verification Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Verification</Text>
                  <View style={styles.filterOptions}>
                    {["", "true", "false"].map((verified) => (
                      <TouchableOpacity
                        key={verified || "all"}
                        style={[
                          styles.filterOption,
                          filters.verified === verified && styles.filterOptionActive
                        ]}
                        onPress={() => setFilters(prev => ({ ...prev, verified }))}
                      >
                        <Text style={[
                          styles.filterOptionText,
                          filters.verified === verified && styles.filterOptionTextActive
                        ]}>
                          {verified === "" ? "All" : verified === "true" ? "Verified" : "Not Verified"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Lock Status Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Account Status</Text>
                  <View style={styles.filterOptions}>
                    {["", "true", "false"].map((locked) => (
                      <TouchableOpacity
                        key={locked || "all"}
                        style={[
                          styles.filterOption,
                          filters.locked === locked && styles.filterOptionActive
                        ]}
                        onPress={() => setFilters(prev => ({ ...prev, locked }))}
                      >
                        <Text style={[
                          styles.filterOptionText,
                          filters.locked === locked && styles.filterOptionTextActive
                        ]}>
                          {locked === "" ? "All Status" : locked === "true" ? "Locked" : "Unlocked"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Sorting Section */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Sort By</Text>
                  <View style={styles.filterOptions}>
                    {[
                      { value: "joined_at", label: "Date Joined" },
                      { value: "name", label: "Name" },
                      { value: "role", label: "Role" }
                    ].map((sort) => (
                      <TouchableOpacity
                        key={sort.value}
                        style={[
                          styles.filterOption,
                          sortBy === sort.value && styles.filterOptionActive
                        ]}
                        onPress={() => setSortBy(sort.value)}
                      >
                        <Text style={[
                          styles.filterOptionText,
                          sortBy === sort.value && styles.filterOptionTextActive
                        ]}>
                          {sort.label}
                        </Text>
                        {sortBy === sort.value && (
                          <TouchableOpacity
                            onPress={() => setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC")}
                            style={styles.sortOrderButton}
                          >
                            {sortOrder === "ASC" ? 
                              <SortAsc size={16} color="#007AFF" /> : 
                              <SortDesc size={16} color="#007AFF" />
                            }
                          </TouchableOpacity>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>
              
              <View style={styles.filtersModalFooter}>
                <TouchableOpacity
                  style={[styles.modalActionButton, styles.clearButton]}
                  onPress={() => {
                    clearFilters();
                    setFiltersModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalActionButtonText, { color: "#FF3B30" }]}>
                    Clear All
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalActionButton, styles.applyButton]}
                  onPress={() => setFiltersModalVisible(false)}
                >
                  <Text style={[styles.modalActionButtonText, { color: "#007AFF" }]}>
                    Apply Filters
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Add User Modal (existing - keep as is) */}
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

                {/* <View style={styles.modalSwitchRow}>
                  <Text style={styles.modalLabel}>Locked:</Text>
                  <Switch
                    value={!addForm.visibility}
                    onValueChange={(v) => handleAddChange("visibility", !v)}
                    trackColor={{ false: "#D1D1D6", true: "#FF3B30" }}
                  />
                  <Text style={styles.modalSwitchText}>
                    {!addForm.visibility ? "Yes" : "No"}
                  </Text>
                </View> */}

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
    fontSize: 28, 
    fontWeight: "700", 
    marginBottom: 16, 
    color: "#1C1C1E",
    marginTop: Platform.OS === 'ios' ? 10 : 0,
  },
  // Stats Row
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  // Controls Row
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  searchContainer: {
    flex: 1,
  },
  searchInput: { 
    height: 48, 
    borderWidth: 1, 
    borderColor: "#C7C7CC", 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    backgroundColor: "#FFF",
    fontSize: 16,
    color: "#1C1C1E",
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#C7C7CC",
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonActive: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F7FF",
  },
  addButton: { 
    paddingHorizontal: 16, 
    height: 48,
    borderRadius: 12, 
    backgroundColor: "#007AFF", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  addButtonText: { 
    color: "#FFF", 
    fontWeight: "600", 
    fontSize: 16 
  },
  // Active Filters Badge
  activeFiltersBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F7FF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 12,
    gap: 6,
  },
  activeFiltersText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  // Sorting Row
  sortingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sortingLabel: {
    fontSize: 14,
    color: "#8E8E93",
    marginRight: 4,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#C7C7CC",
    gap: 4,
  },
  sortButtonActive: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F7FF",
  },
  sortButtonText: {
    fontSize: 14,
    color: "#1C1C1E",
  },
  sortOrderButton: {
    marginLeft: 2,
  },
  // List
  listContainer: {
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
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
  dateJoined: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  // Pagination
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
    gap: 24,
  },
  paginationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#C7C7CC",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  pageInfo: {
    fontSize: 16,
    color: "#1C1C1E",
    fontWeight: "500",
  },
  // Filters Modal
  filtersModalContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    marginTop: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  filtersModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  filtersModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  closeButton: {
    padding: 4,
  },
  filtersModalContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  filterOptionActive: {
    backgroundColor: "#F0F7FF",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  filterOptionText: {
    fontSize: 14,
    color: "#666",
  },
  filterOptionTextActive: {
    color: "#007AFF",
    fontWeight: "500",
  },
  filtersModalFooter: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
    gap: 12,
  },
  modalActionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: "#F2F2F7",
  },
  applyButton: {
    backgroundColor: "#F0F7FF",
  },
  // Existing styles (keep all your existing styles below)
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