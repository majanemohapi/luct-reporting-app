import React, { useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import StudentMonitoring from './Monitoring';
import StudentRating from './Rating';

const StudentDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const userRole = 'Student'; // Replace with dynamic role from auth context or props
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search logic for ratings and monitoring
    alert(`Searching for: ${searchQuery} in Ratings and Monitoring`);
  };

  const handleLogout = () => {
    // Clear token or any auth info if needed
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
      backgroundColor: '#3f0071',
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
          <Link to="/student/dashboard/rating" style={styles.centerLink}>Rating</Link>
          <Link to="/student/dashboard/monitoring" style={styles.centerLink}>Monitoring</Link>
        </nav>
        <form onSubmit={handleSearch} style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search Ratings and Monitoring"
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
          {/* Updated logout button to call handleLogout */}
          <button onClick={handleLogout} style={styles.logoutBtn}>LOGOUT</button>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.mainContent}>
        <div style={styles.dashboardHeader}>
          <h2 style={styles.title}>Dashboard</h2>
          <div style={styles.actionButtons}>
            <button style={styles.actionBtn}>CONTACT</button>
            <button style={styles.actionBtn}>HOW ARE YOU</button>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <Routes>
            <Route path="monitoring" element={<StudentMonitoring />} />
            <Route path="rating" element={<StudentRating />} />
            <Route path="/" element={<StudentMonitoring />} /> {/* Default to Monitoring */}
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;