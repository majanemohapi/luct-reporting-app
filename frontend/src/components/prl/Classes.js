import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
 
  const token = localStorage.getItem('token');

  const headers = { Authorization: `Bearer ${token}` }; 

  useEffect(() => {
    axios.get('/api/classes', { headers })
      .then(res => setClasses(res.data))
      .catch(err => alert('Failed to fetch classes'));
  }, []);

  const handleSearch = async () => {
    try {
      // Corrected URL string with backticks and template placeholder
      const res = await axios.get(`/api/search/classes?query=${searchQuery}`, { headers });
      setClasses(res.data);
    } catch (err) {
      alert('Search failed');
    }
  };

  return (
    <div className="container mt-5">
      <h3>View Classes</h3>
      <input
        type="text"
        placeholder="Search classes..."
        className="form-control mb-3"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch} className="btn btn-secondary mb-3">Search</button>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Course</th>
            <th>Class Name</th>
            <th>Venue</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {classes.length > 0 ? (
            classes.map((cls) => (
              <tr key={cls.id}>
                <td>{cls.id}</td>
                <td>{cls.course_name}</td>
                <td>{cls.class_name}</td>
                <td>{cls.venue}</td>
                <td>{cls.scheduled_time}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No classes found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Classes;