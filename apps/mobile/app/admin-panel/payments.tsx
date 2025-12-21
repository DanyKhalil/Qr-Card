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
  Image,
  Modal,
  FlatList,
  RefreshControl,
  Platform,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEVELOPMENT_CONFIG } from '../../src/config/development';
import { 
  Search, 
  Filter, 
  X, 
  Calendar, 
  Download, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  XCircle,
  RefreshCw,
  DollarSign,
  Clock,
  Users,
  MoreVertical
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AdminPaymentsMobile() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    payment_method: "",
    start_date: null,
    end_date: null
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });
  const [showDatePicker, setShowDatePicker] = useState({
    start: false,
    end: false
  });
  const [expandedPayment, setExpandedPayment] = useState(null);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Fetch token helper
  const getToken = async () => {
    try {
      return await AsyncStorage.getItem("token");
    } catch (e) {
      console.error("Failed to read token", e);
      return null;
    }
  };

  // Calculate active filters
  useEffect(() => {
    let count = 0;
    if (filters.status) count++;
    if (filters.payment_method) count++;
    if (filters.start_date) count++;
    if (filters.end_date) count++;
    if (search.trim()) count++;
    setActiveFilterCount(count);
  }, [filters, search]);

  // Fetch payments
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        search: search
      };

      // Format dates
      if (filters.start_date) {
        params.start_date = filters.start_date.toISOString().split('T')[0];
      }
      if (filters.end_date) {
        params.end_date = filters.end_date.toISOString().split('T')[0];
      }

      const res = await axios.get(
        `${DEVELOPMENT_CONFIG.backendBaseUrl}/api/subscription/payments`,
        {
          params,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      setPayments(res.data.payments || []);
      setFilteredPayments(res.data.payments || []);
      setPagination(res.data.pagination || pagination);
    } catch (err) {
      console.error("Error fetching payments:", err);
      Alert.alert(
        "Error",
        err.response?.status === 403 
          ? "You are not authorized to view payments"
          : "Failed to load payments"
      );
      setPayments([]);
      setFilteredPayments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(
        `${DEVELOPMENT_CONFIG.backendBaseUrl}/api/subscription/payments/stats`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      setStats(res.data.stats);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, [pagination.page]);

  // Filter payments based on search
  useEffect(() => {
    if (!search.trim()) {
      setFilteredPayments(payments);
      return;
    }

    const filtered = payments.filter(payment => {
      const searchLower = search.toLowerCase();
      return (
        payment.user?.name?.toLowerCase().includes(searchLower) ||
        payment.user?.email?.toLowerCase().includes(searchLower) ||
        payment.transaction_reference?.toLowerCase().includes(searchLower) ||
        payment.id.toLowerCase().includes(searchLower)
      );
    });

    setFilteredPayments(filtered);
  }, [search, payments]);

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchPayments();
    fetchStats();
  };

  // Update payment status
  const handleUpdateStatus = async (paymentId, newStatus) => {
    Alert.alert(
      "Update Payment Status",
      `Are you sure you want to change this payment status to ${newStatus}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Update",
          onPress: async () => {
            try {
              const token = await getToken();
              await axios.patch(
                `${DEVELOPMENT_CONFIG.backendBaseUrl}/api/subscription/payments/${paymentId}`,
                { status: newStatus },
                {
                  headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                }
              );

              Alert.alert("Success", "Payment status updated successfully");
              fetchPayments();
              fetchStats();
            } catch (err) {
              console.error("Error updating payment:", err);
              Alert.alert("Error", err.response?.data?.error || "Failed to update payment");
            }
          },
        },
      ]
    );
  };

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Date picker handlers
  const handleDateChange = (event, selectedDate, type) => {
    setShowDatePicker({ ...showDatePicker, [type]: false });
    if (selectedDate) {
      handleFilterChange(type === 'start' ? 'start_date' : 'end_date', selectedDate);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: "",
      payment_method: "",
      start_date: null,
      end_date: null
    });
    setSearch("");
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Format currency
  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency
    }).format(amount);
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      pending: "#F59E0B",
      completed: "#10B981",
      failed: "#EF4444",
      refunded: "#8B5CF6"
    };
    return colors[status] || "#6B7280";
  };

  // Get method color
  const getMethodColor = (method) => {
    const colors = {
      bank_transfer: "#3B82F6",
      cash: "#8B5CF6",
      paypal: "#0EA5E9",
      stripe: "#F59E0B",
      crypto: "#10B981",
      manual: "#6B7280"
    };
    return colors[method] || "#6B7280";
  };

  // Toggle payment expansion
  const togglePaymentExpansion = (paymentId) => {
    setExpandedPayment(expandedPayment === paymentId ? null : paymentId);
  };

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.pages) {
      setPagination(prev => ({ ...prev, page }));
    }
  };

  // Render status badge
  const renderStatusBadge = (status) => (
    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) + '20' }]}>
      <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "N/A"}
      </Text>
    </View>
  );

  // Render method badge
  const renderMethodBadge = (method) => (
    <View style={[styles.methodBadge, { backgroundColor: getMethodColor(method) + '20' }]}>
      <Text style={[styles.methodText, { color: getMethodColor(method) }]}>
        {method ? method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "N/A"}
      </Text>
    </View>
  );

  // Render stats cards
  const renderStatsCards = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.statsContainer}
    >
      <View style={styles.statCard}>
        <View style={[styles.statIcon, { backgroundColor: '#10B98120' }]}>
          <DollarSign size={20} color="#10B981" />
        </View>
        <Text style={styles.statLabel}>Total Revenue</Text>
        <Text style={styles.statValue}>
          {stats ? formatCurrency(stats.total_revenue) : "$0.00"}
        </Text>
      </View>

      <View style={styles.statCard}>
        <View style={[styles.statIcon, { backgroundColor: '#F59E0B20' }]}>
          <Clock size={20} color="#F59E0B" />
        </View>
        <Text style={styles.statLabel}>Pending</Text>
        <Text style={styles.statValue}>{stats?.pending_payments || 0}</Text>
      </View>

      <View style={styles.statCard}>
        <View style={[styles.statIcon, { backgroundColor: '#3B82F620' }]}>
          <Users size={20} color="#3B82F6" />
        </View>
        <Text style={styles.statLabel}>Active Subs</Text>
        <Text style={styles.statValue}>{stats?.active_subscriptions || 0}</Text>
      </View>
    </ScrollView>
  );

  // Render payment item
  const renderPaymentItem = ({ item: payment }) => {
    const isExpanded = expandedPayment === payment.id;
    
    return (
      <TouchableOpacity
        style={styles.paymentCard}
        onPress={() => togglePaymentExpansion(payment.id)}
        activeOpacity={0.9}
      >
        <View style={styles.paymentHeader}>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentAmount}>
              {formatCurrency(payment.amount, payment.currency)}
            </Text>
            <Text style={styles.paymentUser}>
              {payment.user?.name || "Unknown User"}
            </Text>
            <Text style={styles.paymentDate}>
              {formatDate(payment.created_at)}
            </Text>
          </View>
          <View style={styles.paymentStatus}>
            {renderStatusBadge(payment.status)}
            {renderMethodBadge(payment.payment_method)}
          </View>
        </View>

        {isExpanded && (
          <View style={styles.paymentDetails}>
            {/* User Info */}
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>User Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Email:</Text>
                <Text style={styles.detailValue}>{payment.user?.email || "N/A"}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Reference:</Text>
                <Text style={styles.detailValue}>{payment.transaction_reference || "N/A"}</Text>
              </View>
            </View>

            {/* Subscription Info */}
            {payment.subscription && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Subscription</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Plan:</Text>
                  <Text style={styles.detailValue}>{payment.subscription.plan?.name || "N/A"}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Status:</Text>
                  <Text style={styles.detailValue}>{payment.subscription.status}</Text>
                </View>
              </View>
            )}

            {/* Actions */}
            <View style={styles.detailActions}>
              {payment.status === "pending" && (
                <>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={() => handleUpdateStatus(payment.id, "completed")}
                  >
                    <CheckCircle size={16} color="#FFF" />
                    <Text style={styles.actionButtonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleUpdateStatus(payment.id, "failed")}
                  >
                    <XCircle size={16} color="#FFF" />
                    <Text style={styles.actionButtonText}>Reject</Text>
                  </TouchableOpacity>
                </>
              )}

              {payment.status === "completed" && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.refundButton]}
                  onPress={() => handleUpdateStatus(payment.id, "refunded")}
                >
                  <RefreshCw size={16} color="#FFF" />
                  <Text style={styles.actionButtonText}>Refund</Text>
                </TouchableOpacity>
              )}

              {payment.status === "failed" && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.retryButton]}
                  onPress={() => handleUpdateStatus(payment.id, "pending")}
                >
                  <Clock size={16} color="#FFF" />
                  <Text style={styles.actionButtonText}>Retry</Text>
                </TouchableOpacity>
              )}

              {payment.receipt_url && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.viewButton]}
                  onPress={() => {
                    const receiptUrl = `${DEVELOPMENT_CONFIG.backendBaseUrl}${payment.receipt_url}`;
                    setSelectedReceipt(receiptUrl);
                  }}
                >
                  <Eye size={16} color="#FFF" />
                  <Text style={styles.actionButtonText}>Receipt</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Render filter modal
  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <X size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Status Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Status</Text>
              <View style={styles.filterOptions}>
                {["", "pending", "completed", "failed", "refunded"].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterOption,
                      filters.status === status && styles.filterOptionActive
                    ]}
                    onPress={() => handleFilterChange("status", status)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.status === status && styles.filterOptionTextActive
                    ]}>
                      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "All"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Method Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Payment Method</Text>
              <View style={styles.filterOptions}>
                {["", "bank_transfer", "cash", "paypal", "stripe", "crypto", "manual"].map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.filterOption,
                      filters.payment_method === method && styles.filterOptionActive
                    ]}
                    onPress={() => handleFilterChange("payment_method", method)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.payment_method === method && styles.filterOptionTextActive
                    ]}>
                      {method ? method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "All"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date Filters */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Date Range</Text>
              
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker({ ...showDatePicker, start: true })}
              >
                <Calendar size={20} color="#6B7280" />
                <Text style={styles.dateInputText}>
                  {filters.start_date 
                    ? filters.start_date.toLocaleDateString("en-US")
                    : "Start Date"
                  }
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker({ ...showDatePicker, end: true })}
              >
                <Calendar size={20} color="#6B7280" />
                <Text style={styles.dateInputText}>
                  {filters.end_date 
                    ? filters.end_date.toLocaleDateString("en-US")
                    : "End Date"
                  }
                </Text>
              </TouchableOpacity>

              {showDatePicker.start && (
                <DateTimePicker
                  value={filters.start_date || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => handleDateChange(event, date, 'start')}
                />
              )}

              {showDatePicker.end && (
                <DateTimePicker
                  value={filters.end_date || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => handleDateChange(event, date, 'end')}
                />
              )}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.clearButton]}
              onPress={clearFilters}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.applyButton]}
              onPress={() => {
                setShowFilters(false);
                fetchPayments();
              }}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Render receipt modal
  const renderReceiptModal = () => (
    <Modal
      visible={!!selectedReceipt}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setSelectedReceipt(null)}
    >
      <View style={styles.receiptModalOverlay}>
        <View style={styles.receiptModalContainer}>
          <View style={styles.receiptModalHeader}>
            <Text style={styles.receiptModalTitle}>Payment Receipt</Text>
            <TouchableOpacity onPress={() => setSelectedReceipt(null)}>
              <X size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.receiptImageContainer}>
            <Image
              source={{ uri: selectedReceipt }}
              style={styles.receiptImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.receiptModalFooter}>
            <TouchableOpacity
              style={[styles.receiptButton, styles.downloadButton]}
              onPress={() => {
                // Implement download functionality
                Alert.alert("Info", "Download functionality would be implemented here");
              }}
            >
              <Download size={20} color="#FFF" />
              <Text style={styles.receiptButtonText}>Download</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.receiptButton, styles.closeButton]}
              onPress={() => setSelectedReceipt(null)}
            >
              <Text style={[styles.receiptButtonText, { color: "#1F2937" }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Render pagination
  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.paginationButton, pagination.page === 1 && styles.paginationButtonDisabled]}
          onPress={() => goToPage(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          <ChevronLeft size={20} color={pagination.page === 1 ? "#9CA3AF" : "#3B82F6"} />
          <Text style={[
            styles.paginationButtonText,
            pagination.page === 1 && styles.paginationButtonTextDisabled
          ]}>
            Previous
          </Text>
        </TouchableOpacity>

        <View style={styles.pageInfo}>
          <Text style={styles.pageInfoText}>
            Page {pagination.page} of {pagination.pages}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.paginationButton, pagination.page === pagination.pages && styles.paginationButtonDisabled]}
          onPress={() => goToPage(pagination.page + 1)}
          disabled={pagination.page === pagination.pages}
        >
          <Text style={[
            styles.paginationButtonText,
            pagination.page === pagination.pages && styles.paginationButtonTextDisabled
          ]}>
            Next
          </Text>
          <ChevronRight size={20} color={pagination.page === pagination.pages ? "#9CA3AF" : "#3B82F6"} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Payment Management</Text>
        {renderStatsCards()}
      </View>

      {/* Search and Filter Bar */}
      <View style={styles.searchBar}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            placeholder="Search payments..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholderTextColor="#9CA3AF"
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch("")}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.filterButton, activeFilterCount > 0 && styles.filterButtonActive]}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={20} color={activeFilterCount > 0 ? "#FFF" : "#6B7280"} />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading && payments.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading payments...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={filteredPayments}
            renderItem={renderPaymentItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#3B82F6"]}
                tintColor="#3B82F6"
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No payments found</Text>
                {activeFilterCount > 0 && (
                  <TouchableOpacity
                    style={styles.emptyButton}
                    onPress={clearFilters}
                  >
                    <Text style={styles.emptyButtonText}>Clear Filters</Text>
                  </TouchableOpacity>
                )}
              </View>
            }
          />
          {renderPagination()}
        </>
      )}

      {/* Modals */}
      {renderFilterModal()}
      {renderReceiptModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  statsContainer: {
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 150,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#111827",
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  filterButtonActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  listContainer: {
    paddingBottom: 20,
  },
  paymentCard: {
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
    borderColor: "#F3F4F6",
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  paymentInfo: {
    flex: 1,
  },
  paymentAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  paymentUser: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 14,
    color: "#6B7280",
  },
  paymentStatus: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  methodBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  methodText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  paymentDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  detailSection: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  detailKey: {
    fontSize: 14,
    color: "#6B7280",
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: "#111827",
    flex: 1,
  },
  detailActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
  approveButton: {
    backgroundColor: "#10B981",
  },
  rejectButton: {
    backgroundColor: "#EF4444",
  },
  refundButton: {
    backgroundColor: "#8B5CF6",
  },
  retryButton: {
    backgroundColor: "#F59E0B",
  },
  viewButton: {
    backgroundColor: "#3B82F6",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  modalContent: {
    padding: 20,
  },
  filterGroup: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
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
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterOptionActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  filterOptionText: {
    fontSize: 14,
    color: "#374151",
  },
  filterOptionTextActive: {
    color: "#FFF",
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dateInputText: {
    fontSize: 16,
    color: "#6B7280",
    marginLeft: 12,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  applyButton: {
    backgroundColor: "#3B82F6",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  receiptModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  receiptModalContainer: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    width: "100%",
    maxHeight: "80%",
  },
  receiptModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  receiptModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  receiptImageContainer: {
    padding: 20,
  },
  receiptImage: {
    width: "100%",
    height: 300,
  },
  receiptModalFooter: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 12,
  },
  receiptButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  downloadButton: {
    backgroundColor: "#3B82F6",
  },
  closeButton: {
    backgroundColor: "#F3F4F6",
  },
  receiptButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  paginationButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFF",
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
    marginHorizontal: 4,
  },
  paginationButtonTextDisabled: {
    color: "#9CA3AF",
  },
  pageInfo: {
    alignItems: "center",
  },
  pageInfoText: {
    fontSize: 14,
    color: "#6B7280",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#3B82F6",
  },
  emptyButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
});