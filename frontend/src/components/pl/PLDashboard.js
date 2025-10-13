import React, { useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Classes from './Classes';
import Courses from './Courses';
import Monitoring from './Monitoring';
import Rating from './Rating';
import Reports from './Reports';

const PLDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const userRole = 'PL'; // Replace with dynamic role from auth context or props
  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchQuery} in Classes, Courses, Monitoring, Rating, Reports`);
  };

  const handleLogout = () => {
    // Clear auth info if needed
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/login');
  };

  const styles = {
    container: {
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      backgroundColor: '#ccc',
      minHeight: '100vh',
      color: '#111',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px',
      backgroundColor: '#ccc',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 999,
    },
    logo: {
      height: '50px',
      width: 'auto',
    },
    centerNav: {
      display: 'flex',
      gap: '20px',
      flex: 1,
      justifyContent: 'center',
    },
    centerLink: {
      textDecoration: 'none',
      fontWeight: 'bold',
      color: '#111',
      fontSize: '16px',
      cursor: 'pointer',
    },
    searchContainer: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: '25px',
      padding: '5px 10px',
      margin: '0 20px',
    },
    searchInput: {
      border: 'none',
      outline: 'none',
      padding: '10px 15px',
      fontSize: '16px',
      width: '300px',
      background: 'transparent',
    },
    searchIcon: {
      width: '20px',
      height: '20px',
      backgroundColor: '#000',
      borderRadius: '50%',
      marginLeft: '10px',
    },
    icons: {
      display: 'flex',
      gap: '15px',
      margin: '0 20px',
    },
    icon: {
      width: '20px',
      height: '20px',
      backgroundColor: '#111',
      borderRadius: '50%',
      cursor: 'pointer',
    },
    rightNav: {
      display: 'flex',
      gap: '20px',
      alignItems: 'center',
    },
    rightLink: {
      textDecoration: 'none',
      fontWeight: 'bold',
      color: '#111',
      fontSize: '16px',
      cursor: 'pointer',
    },
    logoutBtn: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#111',
      fontWeight: 'bold',
      fontSize: '16px',
      cursor: 'pointer',
      textDecoration: 'underline',
    },
    mainContent: {
      padding: '60px 40px',
      backgroundColor: '#ccc',
    },
    dashboardHeader: {
      backgroundColor: '#fff',
      color: '#111',
      padding: '20px 30px',
      borderRadius: '10px',
      marginBottom: '30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      margin: 0,
      fontSize: '24px',
      fontWeight: 'bold',
    },
    actionButtons: {
      display: 'flex',
      gap: '10px',
    },
    actionBtn: {
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header - Top bar like Nike */}
      <header style={styles.header}>
        <img src="/images/log2.jpg" alt="LUCT Logo" style={styles.logo} />
        <nav style={styles.centerNav}>
          <Link to="/pl/dashboard/lectures" style={styles.centerLink}>Lectures</Link>
          <Link to="/pl/dashboard/classes" style={styles.centerLink}>Classes</Link>
          <Link to="/pl/dashboard/courses" style={styles.centerLink}>Courses</Link>
          <Link to="/pl/dashboard/monitoring" style={styles.centerLink}>Monitoring</Link>
          <Link to="/pl/dashboard/rating" style={styles.centerLink}>Rating</Link>
          <Link to="/pl/dashboard/reports" style={styles.centerLink}>Reports</Link>
        </nav>
        <form onSubmit={handleSearch} style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search Classes, Courses, Monitoring, Rating, Reports"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <div style={styles.searchIcon}></div>
        </form>
        <div style={styles.icons}>
          <div style={styles.icon}></div>
          <div style={styles.icon}></div>
        </div>
        <div style={styles.rightNav}>
          <Link to="/find-store" style={styles.rightLink}>Find a Store</Link>
          <Link to="/help" style={styles.rightLink}>Help</Link>
          <span style={styles.rightLink}>{userRole}</span>
          {/* Logout button now calls handleLogout */}
          <button onClick={handleLogout} style={styles.logoutBtn}>logout</button>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.mainContent}>
        <div style={styles.dashboardHeader}>
          <h2 style={styles.title}>program  Dashboard</h2>
          <div style={styles.actionButtons}>
            <button style={styles.actionBtn}>Home</button>
            <button style={styles.actionBtn}>wow</button>
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <Routes>
            <Route path="classes" element={<Classes />} />
            <Route path="courses" element={<Courses />} />
            <Route path="monitoring" element={<Monitoring />} />
            <Route path="rating" element={<Rating />} />
            <Route path="reports" element={<Reports />} />
            <Route path="/" element={<Classes />} /> {/* Default to Classes */}
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default PLDashboard;