import React, { useEffect, useState, useCallback } from "react";
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
  Linking,
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
  User,
  ExternalLink,
  Info
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from "expo-router";

export default function AdminPaymentsMobile() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
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
    limit: 10,
    total: 0,
    pages: 1
  });
  const [showDatePicker, setShowDatePicker] = useState({
    start: false,
    end: false
  });
  const [expandedPayment, setExpandedPayment] = useState(null);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  
  const transformImageUrl = (url: string) => {
    if (!url) return url;
    return url.replace('http://localhost:5050', DEVELOPMENT_CONFIG.backendBaseUrl);
  };

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
    if (debouncedSearch.trim()) count++;
    setActiveFilterCount(count);
  }, [filters, debouncedSearch]);

  // Debounced search effect (WEB FEATURE)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch payments (with debounced search)
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        search: debouncedSearch
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

  // Initial load and pagination changes
  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, [pagination.page, filters, debouncedSearch]);

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
    setDebouncedSearch("");
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Format date (with time - WEB FEATURE)
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

  // Format date without time (WEB FEATURE)
  const formatDateWithoutTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Format currency
  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency
    }).format(amount);
  };

  // Get status style (WEB FEATURE - colors)
  const getStatusStyle = (status) => {
    const styles = {
      pending: { backgroundColor: "#fef3c7", color: "#92400e" },
      completed: { backgroundColor: "#d1fae5", color: "#065f46" },
      failed: { backgroundColor: "#fee2e2", color: "#991b1b" },
      refunded: { backgroundColor: "#f3e8ff", color: "#6b21a8" }
    };
    return styles[status] || { backgroundColor: "#f3f4f6", color: "#374151" };
  };

  // Get method style (WEB FEATURE - colors)
  const getMethodStyle = (method) => {
    const styles = {
      bank_transfer: { backgroundColor: "#dbeafe", color: "#1e40af" },
      cash: { backgroundColor: "#f3e8ff", color: "#6b21a8" },
      paypal: { backgroundColor: "#f0f9ff", color: "#0369a1" },
      stripe: { backgroundColor: "#fef3c7", color: "#92400e" },
      crypto: { backgroundColor: "#dcfce7", color: "#166534" },
      manual: { backgroundColor: "#f3f4f6", color: "#374151" }
    };
    return styles[method] || { backgroundColor: "#f3f4f6", color: "#374151" };
  };

  // Get subscription status (WEB FEATURE)
  const getSubscriptionStatus = (subscription) => {
    if (!subscription) return null;
    
    if (subscription.status === "pending") {
      return { text: "Pending", type: "pending", color: "#fcd34d", textColor: "#374151" };
    }
    if (subscription.status === "cancelled") {
      return { text: "Expired", type: "expired", color: "#fca5a5", textColor: "#991b1b" };
    }
    if (subscription.plan?.billing_interval === "lifetime") {
      return { text: "Active", type: "active", color: "#6ee7b7", textColor: "#065f46" };
    }
    if (new Date(subscription.end_date) < new Date()) {
      return { text: "Expired", type: "expired", color: "#fca5a5", textColor: "#991b1b" };
    }
    return { text: "Active", type: "active", color: "#6ee7b7", textColor: "#065f46" };
  };

  // Navigate to user profile (WEB FEATURE)
  const navigateToUserProfile = (profileId) => {
    if (profileId) {
      router.push(`/(stack)/user-profile/${profileId}`);
    }
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

  // Generate page numbers (WEB FEATURE - smart pagination)
  const getPageNumbers = () => {
    const totalPages = pagination.pages;
    const currentPage = pagination.page;
    const pages = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i);
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
    }
    
    return pages;
  };

  // Render user avatar (WEB FEATURE)
  const renderUserAvatar = (payment) => {
    const profile = payment.profile || {};
    const name = profile.name || "U";
    
    if (profile.profile_pic_url) {
      return (
        <Image
          source={{ uri: transformImageUrl(profile.profile_pic_url) }} 
          style={styles.userAvatar}
        />
      );
    }
    
    return (
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>{name.charAt(0)}</Text>
      </View>
    );
  };

  // Render subscription cell (WEB FEATURE)
  const renderSubscriptionCell = (subscription) => {
    if (!subscription) return <Text style={styles.noSubscription}>No subscription</Text>;
    
    const status = getSubscriptionStatus(subscription);
    const planName = subscription.plan?.name || "N/A";
    
    return (
      <View style={styles.subscriptionCell}>
        <Text style={styles.subPlan}>{planName}</Text>
        <View style={styles.subStatusRow}>
          <View style={[styles.subStatusBadge, { backgroundColor: status.color }]}>
            <Text style={[styles.subStatusText, { color: status.textColor }]}>
              {status.text}
            </Text>
          </View>
          
          {status.type === "active" && subscription.plan?.billing_interval === "lifetime" && (
            <Text style={styles.subExpires}>till ∞</Text>
          )}
          
          {status.type === "active" && subscription.plan?.billing_interval !== "lifetime" && (
            <Text style={styles.subExpires}>till {formatDateWithoutTime(subscription.end_date)}</Text>
          )}
        </View>
      </View>
    );
  };

  // Render status badge (updated with web colors)
  const renderStatusBadge = (status) => {
    const style = getStatusStyle(status);
    return (
      <View style={[styles.statusBadge, { backgroundColor: style.backgroundColor }]}>
        <Text style={[styles.statusText, { color: style.color }]}>
          {status?.charAt(0).toUpperCase() + status?.slice(1) || "N/A"}
        </Text>
      </View>
    );
  };

  // Render method badge (updated with web colors)
  const renderMethodBadge = (method) => {
    const style = getMethodStyle(method);
    return (
      <View style={[styles.methodBadge, { backgroundColor: style.backgroundColor }]}>
        <Text style={[styles.methodText, { color: style.color }]}>
          {method ? method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "N/A"}
        </Text>
      </View>
    );
  };

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

  // Render payment item (updated with web features)
  const renderPaymentItem = ({ item: payment }) => {
    if (!payment) return null;

    const isExpanded = expandedPayment === payment.id;
    const profile = payment.profile || {};
    const subscription = payment.subscription;
    
    return (
      <TouchableOpacity
        style={[
          styles.paymentCard,
          payment.status === "pending" && styles.pendingCard,
          payment.status === "completed" && styles.completedCard,
          payment.status === "failed" && styles.failedCard,
          payment.status === "refunded" && styles.refundedCard,
        ]}
        onPress={() => togglePaymentExpansion(payment.id)}
        activeOpacity={0.9}
      >
        <View style={styles.paymentHeader}>
          {/* User Section - WEB FEATURE */}
          <TouchableOpacity 
            style={styles.userSection}
            onPress={() => profile.id && navigateToUserProfile(profile.id)}
          >
            {renderUserAvatar(payment)}
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{profile.name || "Unknown User"}</Text>
              <Text style={styles.userEmail}>
                {profile.user?.email || payment.user?.email || "N/A"}
              </Text>
            </View>
            <ExternalLink size={16} color="#6B7280" />
          </TouchableOpacity>

          {/* Amount & Status */}
          <View style={styles.paymentMeta}>
            <Text style={styles.paymentAmount}>
              {formatCurrency(payment.amount, payment.currency)}
            </Text>
            <View style={styles.badgeContainer}>
              {renderStatusBadge(payment.status)}
              {renderMethodBadge(payment.payment_method)}
            </View>
          </View>
        </View>

        {/* Date Row - WEB FEATURE (with paid date) */}
        <View style={styles.dateRow}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Created:</Text>
            <Text style={styles.dateValue}>{formatDate(payment.created_at)}</Text>
          </View>
          {payment.paid_at && (
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Paid:</Text>
              <Text style={styles.dateValue}>{formatDate(payment.paid_at)}</Text>
            </View>
          )}
        </View>

        {isExpanded && (
          <View style={styles.paymentDetails}>
            {/* Subscription Info - WEB FEATURE */}
            {subscription && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Subscription</Text>
                {renderSubscriptionCell(subscription)}
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

              {payment.status === "refunded" && payment.approved_at && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.detailsButton]}
                  onPress={() => 
                    Alert.alert("Refund Details", `Refunded on: ${formatDate(payment.approved_at)}`)
                  }
                >
                  <Info size={16} color="#FFF" />
                  <Text style={styles.actionButtonText}>Details</Text>
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
                    ? formatDateWithoutTime(filters.start_date.toISOString())
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
                    ? formatDateWithoutTime(filters.end_date.toISOString())
                    : "End Date"
                  }
                </Text>
              </TouchableOpacity>

              {showDatePicker.start && (
                <DateTimePicker
                  value={filters.start_date || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? "spinner" : "default"}
                  onChange={(event, date) => handleDateChange(event, date, 'start')}
                />
              )}

              {showDatePicker.end && (
                <DateTimePicker
                  value={filters.end_date || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? "spinner" : "default"}
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
                // fetchPayments will be triggered by useEffect
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
          
          <ScrollView style={styles.receiptImageContainer}>
            <Image
              source={{ uri: selectedReceipt }}
              style={styles.receiptImage}
              resizeMode="contain"
            />
          </ScrollView>

          <View style={styles.receiptModalFooter}>
            <TouchableOpacity
              style={[styles.receiptButton, styles.downloadButton]}
              onPress={() => {
                // For mobile, we can use Linking to open the URL
                if (selectedReceipt) {
                  Linking.openURL(selectedReceipt);
                }
              }}
            >
              <Download size={20} color="#FFF" />
              <Text style={styles.receiptButtonText}>Open/Download</Text>
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

  // Render pagination (WEB FEATURE - enhanced pagination)
  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    const pageNumbers = getPageNumbers();
    
    return (
      <View style={styles.paginationContainer}>
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

          <View style={styles.pageNumbers}>
            {pageNumbers.map((pageNum) => (
              <TouchableOpacity
                key={pageNum}
                style={[
                  styles.pageButton,
                  pagination.page === pageNum && styles.pageButtonActive
                ]}
                onPress={() => goToPage(pageNum)}
              >
                <Text style={[
                  styles.pageButtonText,
                  pagination.page === pageNum && styles.pageButtonTextActive
                ]}>
                  {pageNum}
                </Text>
              </TouchableOpacity>
            ))}
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
        
        <Text style={styles.pageInfo}>
          Page {pagination.page} of {pagination.pages} ({pagination.total} Total Payments)
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Main ScrollView - Everything scrolls */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
          />
        }
      >
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
              placeholder="Search by user name, email, or reference..."
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
        ) : payments.length === 0 ? (
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
        ) : (
          <>
            {/* Payments List */}
            <View style={styles.paymentsList}>
              {payments.map(payment => (
                <View key={payment.id}>
                  {renderPaymentItem({ item: payment })}
                </View>
              ))}
            </View>
            
            {/* Pagination */}
            {renderPagination()}
          </>
        )}

        {/* Bottom padding for scroll */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Modals (outside the scroll) */}
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
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    minWidth: 150,
    // shadowColor: "#000",
    // shadowOpacity: 0.05,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 8,
    // elevation: 3,
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
    fontSize: 14,
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
  // Payment card with status-based backgrounds (WEB FEATURE)
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
  pendingCard: {
    backgroundColor: "#fffbeb",
  },
  completedCard: {
    backgroundColor: "#f0fdf4",
  },
  failedCard: {
    backgroundColor: "#fef2f2",
  },
  refundedCard: {
    backgroundColor: "#faf5ff",
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  // User section (WEB FEATURE)
  userSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  avatarText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: "#6B7280",
  },
  paymentMeta: {
    alignItems: "flex-end",
  },
  paymentAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#059669",
    marginBottom: 8,
  },
  badgeContainer: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 4,
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
  // Date row (WEB FEATURE)
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
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
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: "#111827",
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  // Subscription cell (WEB FEATURE)
  subscriptionCell: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  subPlan: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  subStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  subStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subStatusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  subExpires: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  noSubscription: {
    fontSize: 14,
    color: "#9CA3AF",
    fontStyle: "italic",
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
  detailsButton: {
    backgroundColor: "#6B7280",
  },
  viewButton: {
    backgroundColor: "#3B82F6",
  },
  // Filter modal styles
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
  // Receipt modal
  receiptModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  receiptModalContainer: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    width: "100%",
    maxHeight: "90%",
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
    maxHeight: 400,
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
  // Enhanced pagination (WEB FEATURE)
  paginationContainer: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
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
  pageNumbers: {
    flexDirection: "row",
    gap: 8,
  },
  pageButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  pageButtonActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  pageButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  pageButtonTextActive: {
    color: "#FFF",
  },
  pageInfo: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
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
   scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30, // Extra padding at bottom
  },
  paymentsList: {
    marginBottom: 20,
  },
  bottomPadding: {
    height: 30,
  },
  
  // Also UPDATE this existing style:
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    backgroundColor: "#FFF", // Add background
    borderRadius: 16, // Add borderRadius
    padding: 30, // Add padding
    marginTop: 20, // Add marginTop
    shadowColor: "#000", // Add shadow
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  
  // Also UPDATE this existing style:
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300, // Add minHeight
    backgroundColor: "#FFF", // Add background
    borderRadius: 16, // Add borderRadius
    padding: 30, // Add padding
    marginTop: 20, // Add marginTop
    shadowColor: "#000", // Add shadow
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
});