import React, { useEffect, useState } from "react";
import ProfileCard from "../components/ProfileCard/ProfileCard";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "../Style/Filtering.css";
//hello 
const Filtering = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const fetchUsers = async (searchQuery = "") => {
    try {
      const res = await fetch(`http://localhost:5050/api/users2?search=${searchQuery}`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => fetchUsers(search), 300);
    return () => clearTimeout(delay);
  }, [search]);

  return (
    <>
      <Header />
      <main className="filtering-page">
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search by name or role..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="search-button" onClick={() => fetchUsers(search)}>
            Search
          </button>
        </div>

        <div className="profile-cards-container">
          {users.length > 0 ? (
            users.map((user) => (
              <ProfileCard
                key={user.id}
                name={user.name}
                title={user.role}
                imageUrl={user.profile?.profile_pic_url || "https://via.placeholder.com/80"}
              />
            ))
          ) : (
            <p>No users found.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Filtering;
