import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const backgroundImages = [
    '/images/l.jpeg', // Replace with your actual image filenames inside public/images
    '/images/bg2.jpg',
    '/images/ll.jpeg',
    // Add more images as needed
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const styles = {
    container: {
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#fff',
      color: '#111',
      overflowX: 'hidden',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 999,
    },
    logo: {
      height: '50px',
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
    },
    rightNav: {
      display: 'flex',
      gap: '20px',
    },
    rightLink: {
      textDecoration: 'none',
      fontWeight: 'bold',
      color: '#111',
      fontSize: '16px',
    },
    searchIcon: {
      width: '20px',
      height: '20px',
      backgroundColor: '#000',
      borderRadius: '50%',
      display: 'inline-block',
      margin: '0 10px',
    },
    icon: {
      width: '20px',
      height: '20px',
      backgroundColor: '#ccc',
      borderRadius: '50%',
      display: 'inline-block',
    },

    // Hero with animated background
    hero: {
      position: 'relative',
      backgroundImage: `url(${backgroundImages[currentBgIndex]})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'repeat-x',
      color: 'white',
      textAlign: 'center',
      padding: '150px 20px 200px',
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'scrollBackground 60s linear infinite',
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    heroContent: {
      position: 'relative',
      zIndex: 1,
    },
    heroLogo: {
      height: '120px',
      width: 'auto',
    },
    heroSubtitle1: {
      fontSize: '1.5rem',
      marginTop: '20px',
      opacity: 0.9,
    },
    heroSubtitle2: {
      fontSize: '1.2rem',
      marginTop: '10px',
      opacity: 0.8,
    },

    features: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      padding: '60px 20px',
      backgroundColor: '#f5f5f5',
    },
    featureBox: {
      width: '250px',
      margin: '20px',
      background: '#fff',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
    },
    featureImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
    },
    featureContent: {
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
    },
    featureTitle: {
      fontSize: '1.2rem',
      marginBottom: '10px',
    },
    featureText: {
      fontSize: '0.95rem',
      marginBottom: '15px',
    },
    featureButton: {
      padding: '12px',
      backgroundColor: '#111',
      color: '#fff',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      fontWeight: 'bold',
      textAlign: 'center',
    },

    footer: {
      backgroundColor: '#111',
      color: '#fff',
      padding: '30px',
      textAlign: 'center',
    },
    footerLinks: {
      marginTop: '10px',
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
    },
    footerLink: {
      color: '#fff',
      textDecoration: 'underline',
      fontSize: '14px',
    },

    // Keyframes for background scroll
    '@keyframes scrollBackground': {
      '0%': { backgroundPosition: '0 0' },
      '100%': { backgroundPosition: '-10000px 0' },
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <img src="/images/aaaq.jpeg" alt="LUCT Logo" style={styles.logo} />
        <nav style={styles.centerNav}>
          <Link to="/student" style={styles.centerLink}>HOME</Link>
          <Link to="/lecturer" style={styles.centerLink}>RATE</Link>
          <Link to="/prl" style={styles.centerLink}>CTRATIVITY</Link>
          <Link to="/pl" style={styles.centerLink}>INNOVATION</Link>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={styles.searchIcon}></div>
          <div style={styles.icon}></div>
          <div style={styles.icon}></div>
        </div>
        <div style={styles.rightNav}>
          <Link to="/find-store" style={styles.rightLink}>Find a Store</Link>
          <Link to="/help" style={styles.rightLink}>Help</Link>
          <Link to="/register" style={styles.rightLink}>Join Us</Link>
          <Link to="/login" style={styles.rightLink}>Sign In</Link>
        </div>
      </header>

      {/* Hero Banner with animated background */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <img src="/images/aaa.jpeg" alt="LUCT Reporting System Logo" style={styles.heroLogo} />
          <p style={styles.heroSubtitle1}>Faculty of Information Communication Technology</p>
          <p style={styles.heroSubtitle2}>WHATT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</p>
        </div>
      </section>

      {/* Features grid */}
      <section style={styles.features}>
        {/* Feature 1 */}
        <div style={styles.featureBox}>
          <img src="/images/q.jpeg" alt="Join the LUCT Team" style={styles.featureImage} />
          <div style={styles.featureContent}>
            <h3 style={styles.featureTitle}>Join the LUCT Team</h3>
            <p style={styles.featureText}>Become part of our faculty and contribute to innovative teaching.</p>
            <button style={styles.featureButton} onClick={() => alert('Register')}>Join Now</button>
          </div>
        </div>
        {/* Feature 2 */}
        <div style={styles.featureBox}>
          <img src="/images/s.jpeg" alt="Submit Lecture Reports" style={styles.featureImage} />
          <div style={styles.featureContent}>
            <h3 style={styles.featureTitle}>Submit Lecture Reports</h3>
            <p style={styles.featureText}>Track attendance, topics, and outcomes for your classes.</p>
            <button style={styles.featureButton} onClick={() => alert('Start Reporting')}>Start Reporting</button>
          </div>
        </div>
        {/* Feature 3 */}
        <div style={styles.featureBox}>
          <img src="/images/a.jpeg" alt="Monitor Progress" style={styles.featureImage} />
          <div style={styles.featureContent}>
            <h3 style={styles.featureTitle}>Monitor Progress</h3>
            <p style={styles.featureText}>View real-time monitoring and feedback for all courses.</p>
            <button style={styles.featureButton} onClick={() => alert('View Dashboard')}>View Dashboard</button>
          </div>
        </div>
        {/* Feature 4 */}
        <div style={styles.featureBox}>
          <img src="/images/aa.jpeg" alt="Use Rating System" style={styles.featureImage} />
          <div style={styles.featureContent}>
            <h3 style={styles.featureTitle}>Use Rating System</h3>
            <p style={styles.featureText}>Rate lectures and provide feedback to improve teaching quality.</p>
            <button style={styles.featureButton} onClick={() => alert('Rate Now')}>Rate Now</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>&copy; 2025 LUCT Reporting System. All rights reserved.</p>
        <div style={styles.footerLinks}>
          <Link to="/privacy" style={styles.footerLink}>Privacy Policy</Link>
          <Link to="/terms" style={styles.footerLink}>Terms of Service</Link>
        </div>
      </footer>

      {/* Add style tag for keyframes */}
      <style>
        {`@keyframes scrollBackground {
          0% { background-position: 0 0; }
          100% { background-position: -10000px 0; }
        }`}
      </style>
    </div>
  );
};

export default Welcome;