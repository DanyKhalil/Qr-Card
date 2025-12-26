import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Style/AdminPayments.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    payment_method: "",
    start_date: "",
    end_date: ""
  });
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch payments and stats
  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, [currentPage, filters]);

  // Filter payments based on search
  useEffect(() => {
    if (!search.trim()) {
      setFilteredPayments(payments);
      return;
    }

    const filtered = payments.filter(payment => {
      const searchLower = search.toLowerCase();
      return (
        payment.profile?.user?.name?.toLowerCase().includes(searchLower) ||
        payment.profile?.user?.email?.toLowerCase().includes(searchLower) ||
        payment.transaction_reference?.toLowerCase().includes(searchLower) ||
        payment.id.toLowerCase().includes(searchLower)
      );
    });

    setFilteredPayments(filtered);
  }, [search, payments]);

  // Fetch payments with filters and pagination
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: pagination.limit,
        ...filters,
        search: search
      });

      const res = await axios.get(
        `http://localhost:5050/api/subscription/payments?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPayments(res.data.payments);
      setFilteredPayments(res.data.payments);
      setPagination(res.data.pagination);
      setTotalPages(res.data.pagination.pages);
    } catch (err) {
      console.error("Error fetching payments:", err);
      if (err.response?.status === 403) {
        alert("You are not authorized to view payments");
        navigate("/");
      } else {
        alert("Failed to load payments");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch payment statistics
  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5050/api/subscription/payments/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(res.data.stats);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // Update payment status
  const handleUpdateStatus = async (paymentId, newStatus) => {
    if (!window.confirm(`Change payment status to ${newStatus}?`)) return;

    try {
      await axios.patch(
        `http://localhost:5050/api/subscription/payments/${paymentId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Payment status updated successfully");
      fetchPayments();
      fetchStats();
    } catch (err) {
      console.error("Error updating payment:", err);
      alert(err.response?.data?.error || "Failed to update payment");
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: "",
      payment_method: "",
      start_date: "",
      end_date: ""
    });
    setSearch("");
    setCurrentPage(1);
  };

  // View receipt image
  const viewReceipt = (receiptUrl) => {
    if (!receiptUrl) {
      alert("No receipt available for this payment");
      return;
    }
    setSelectedReceipt(`http://localhost:5050${receiptUrl}`);
  };

  // Close receipt viewer
  const closeReceipt = () => setSelectedReceipt(null);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
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
      currency
    }).format(amount);
  };

  // Status badge style
  const getStatusStyle = (status) => {
    const styles = {
      pending: { backgroundColor: "#fef3c7", color: "#92400e" },
      completed: { backgroundColor: "#d1fae5", color: "#065f46" },
      failed: { backgroundColor: "#fee2e2", color: "#991b1b" },
      refunded: { backgroundColor: "#f3e8ff", color: "#6b21a8" }
    };
    return styles[status] || { backgroundColor: "#f3f4f6", color: "#374151" };
  };

  // Method badge style
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

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading && payments.length === 0) {
    return (
      <div className="admin-payments-page">
        <Header activeIndex={-2} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading payments...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-payments-page">
      <Header activeIndex={-2} />

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="receipt-modal-overlay" onClick={closeReceipt}>
          <div className="receipt-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={closeReceipt}>×</button>
            <h3>Payment Receipt</h3>
            <img src={selectedReceipt} alt="Payment Receipt" className="receipt-image" />
            <div className="receipt-actions">
              <a href={selectedReceipt} download className="download-btn">Download Receipt</a>
              <button className="close-btn" onClick={closeReceipt}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-payments-container">
        <div className="payments-header">
          <h1>Payment Management</h1>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-label">Total Revenue</span>
              <span className="stat-value">{stats ? formatCurrency(stats.total_revenue) : "$0.00"}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Pending</span>
              <span className="stat-value">{stats?.pending_payments || 0}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Active Subs</span>
              <span className="stat-value">{stats?.active_subscriptions || 0}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-row">
            <div className="filter-group">
              <label>Status</label>
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Payment Method</label>
              <select name="payment_method" value={filters.payment_method} onChange={handleFilterChange}>
                <option value="">All Methods</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="paypal">PayPal</option>
                <option value="stripe">Stripe</option>
                <option value="crypto">Crypto</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            <div className="filter-group">
              <label>From Date</label>
              <input type="date" name="start_date" value={filters.start_date} onChange={handleFilterChange} />
            </div>

            <div className="filter-group">
              <label>To Date</label>
              <input type="date" name="end_date" value={filters.end_date} onChange={handleFilterChange} />
            </div>
          </div>

          <div className="search-clear-row">
            <input
              type="text"
              placeholder="Search by user name, email, or reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="payments-search"
            />
            <button className="clear-filters-btn" onClick={clearFilters}>Clear Filters</button>
          </div>
        </div>

        {/* Payments Table */}
        <div className="table-container">
          <table className="admin-payments-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Receipt</th>
                <th>Subscription</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">No payments found</td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className={payment.status}>
                    <td>
                      <div className="date-cell">
                        <div className="date-main">{formatDate(payment.created_at)}</div>
                        {payment.paid_at && <div className="date-sub">Paid: {formatDate(payment.paid_at)}</div>}
                      </div>
                    </td>

                    <td>
                      <div className="user-cell">
                        {payment.profile?.profile_pic_url ? (
                          <img 
                            src={payment.profile.profile_pic_url} 
                            alt={payment.profile?.user?.name || "User"} 
                            className="user-avatar" 
                          />
                        ) : (
                          <div className="avatar-placeholder">
                            {payment.profile?.user?.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <div className="user-info">
                          <div className="user-name">{payment.profile?.user?.name || "N/A"}</div>
                          <div className="user-email">{payment.profile?.user?.email || "N/A"}</div>
                        </div>
                      </div>
                    </td>

                    <td className="amount-cell">{formatCurrency(payment.amount, payment.currency)}</td>
                    <td><span className="method-badge" style={getMethodStyle(payment.payment_method)}>{payment.payment_method || "N/A"}</span></td>
                    <td><span className="status-badge" style={getStatusStyle(payment.status)}>{payment.status || "N/A"}</span></td>

                    <td>
                      {payment.receipt_url ? (
                        <button className="view-receipt-btn" onClick={() => viewReceipt(payment.receipt_url)} title="View receipt">View</button>
                      ) : (
                        <span className="no-receipt">No receipt</span>
                      )}
                    </td>

                    <td>
                      {payment.subscription ? (
                        <div className="subscription-cell">
                          <div className="sub-plan">{payment.subscription.plan?.name || "N/A"}</div>
                          <div className="sub-status">{payment.subscription.status}</div>
                        </div>
                      ) : "No subscription"}
                    </td>

                    <td>
                      <div className="action-buttons">
                        {payment.status === "pending" && (
                          <>
                            <button className="activate-btn" onClick={() => handleUpdateStatus(payment.id, "completed")} title="Approve payment">Approve</button>
                            <button className="reject-btn" onClick={() => handleUpdateStatus(payment.id, "failed")} title="Reject payment">Reject</button>
                          </>
                        )}
                        {payment.status === "completed" && (
                          <button className="refund-btn" onClick={() => handleUpdateStatus(payment.id, "refunded")} title="Mark as refunded">Refund</button>
                        )}
                        {payment.status === "failed" && (
                          <button className="retry-btn" onClick={() => handleUpdateStatus(payment.id, "pending")} title="Mark for retry">Retry</button>
                        )}
                        {payment.status === "refunded" && (
                          <button className="view-details-btn" onClick={() => alert(`Refunded on: ${formatDate(payment.approved_at)}`)} title="View refund details">Details</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button className="pagination-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>← Previous</button>
            <div className="page-numbers">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;

                return (
                  <button key={pageNum} className={`page-btn ${currentPage === pageNum ? 'active' : ''}`} onClick={() => goToPage(pageNum)}>{pageNum}</button>
                );
              })}
            </div>
            <button className="pagination-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Next →</button>
            <span className="page-info">Page {currentPage} of {totalPages} ({pagination.total} total payments)</span>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminPayments;
