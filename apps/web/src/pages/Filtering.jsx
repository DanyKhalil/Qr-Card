import React, { useEffect, useState } from "react";
import ProfileCard from "../components/ProfileCard/ProfileCard";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "../Style/Filtering.css";

const Filtering = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState([]); // followers / following
  const [roleFilter, setRoleFilter] = useState(""); // user / admin / company
  const [verifiedFilter, setVerifiedFilter] = useState(false);
  const [mutualFilter, setMutualFilter] = useState(false);
  const [hasVideosFilter, setHasVideosFilter] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc"); // asc | desc

  // Get current logged-in user
  const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  };
  const getCurrentUserProfileId = () => {
    const profileId = localStorage.getItem("profileId");
    return profileId;
  }

  // Fetch users from backend
  const fetchUsers = async (searchQuery = "") => {
    const profileId = getCurrentUserProfileId();
    if (!profileId) return;

    const filterQuery = filters.join(",");
    const roleQuery = roleFilter ? `&role=${roleFilter}` : "";
    const verifiedQuery = verifiedFilter ? "&verified=true" : "";
    const mutualQuery = mutualFilter ? "&mutual=true" : "";
    const hasVideosQuery = hasVideosFilter ? "&hasVideos=true" : "";
    const sortQuery = `&sort=${sortOrder}`;

    try {
      const res = await fetch(
        `http://localhost:5050/api/users2/follow?profileId=${profileId}&search=${searchQuery}&filter=${filterQuery}${roleQuery}${verifiedQuery}${mutualQuery}${hasVideosQuery}${sortQuery}`
      );
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch when filters, role, or sort change
  useEffect(() => {
    fetchUsers(search);
  }, [
    filters,
    roleFilter,
    verifiedFilter,
    mutualFilter,
    hasVideosFilter,
    sortOrder,
  ]);

  // Debounced search
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers(search);
    }, 300);
    return () => clearTimeout(delay);
  }, [search]);

  const toggleFilter = (type) => {
    setFilters((prev) =>
      prev.includes(type) ? prev.filter((f) => f !== type) : [...prev, type]
    );
  };

  return (
    <>
      <Header activeIndex={0} />
      <main className="filtering-page">
        <div className="filtering-layout">
          {/* LEFT FILTER SIDEBAR */}
          <aside className="filter-sidebar">
            <h4>Filters</h4>

            {/* Followers / Following checkboxes */}
            <label>
              <input
                type="checkbox"
                checked={filters.includes("following")}
                onChange={() => toggleFilter("following")}
              />
              Following
            </label>

            <label>
              <input
                type="checkbox"
                checked={filters.includes("followers")}
                onChange={() => toggleFilter("followers")}
              />
              Followers
            </label>

            {/* Role filter */}
            {/* <div className="role-filter">
              <label htmlFor="roleSelect">Role / Job Type</label>
              <select
                id="roleSelect"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="user">user</option>
                <option value="admin">admin</option>
                <option value="company">company</option>
              </select>
            </div> */}

            {/* Verified */}
            {/* <label>
              <input
                type="checkbox"
                checked={verifiedFilter}
                onChange={() => setVerifiedFilter(!verifiedFilter)}
              />
              Verified Only
            </label> */}

            {/* Mutual */}
            <label>
              <input
                type="checkbox"
                checked={mutualFilter}
                onChange={() => setMutualFilter(!mutualFilter)}
              />
              Mutual Followers Only
            </label>

            {/* Has Videos */}
            <label>
              <input
                type="checkbox"
                checked={hasVideosFilter}
                onChange={() => setHasVideosFilter(!hasVideosFilter)}
              />
              Has Videos
            </label>

            {/* Sort */}
            <div className="role-filter">
              <label htmlFor="sortSelect">Sort By Name</label>
              <select
                id="sortSelect"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">A – Z</option>
                <option value="desc">Z – A</option>
              </select>
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <section className="filter-content">
            {/* Search */}
            <div className="search-bar-container">
              <input
                type="text"
                placeholder="Search by name..."
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="search-button"
                onClick={() => fetchUsers(search)}
              >
                Search
              </button>
            </div>

            {/* Profile cards */}
            <div className="profile-cards-container">
              {users.length ? (
                users.map((user) => (
                  <ProfileCard
                    key={user.id}
                    id={user.id}
                    profileId={user.profile_id}
                    name={user.name}
                    title={
                      user.isFollower && user.isFollowing
                        ? "Mutual"
                        : user.isFollowing
                        ? "Following"
                        : "Follower"
                    }
                    imageUrl={user.profile_pic_url}
                  />
                ))
              ) : (
                <p>No users found.</p>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Filtering;
