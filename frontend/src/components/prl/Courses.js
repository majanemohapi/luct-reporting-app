import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Retrieve token once
  const token = localStorage.getItem('token');

  // Define headers with proper template literal
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch courses on component mount
  useEffect(() => {
    axios.get('/api/courses', { headers })
      .then((res) => {
        setCourses(res.data);
      })
      .catch(() => {
        alert('Failed to fetch courses');
      });
  }, []);

  // Handle search button click
  const handleSearch = async () => {
    try {
      const res = await axios.get(`/api/search/courses?query=${searchQuery}`, { headers });
      setCourses(res.data);
    } catch {
      alert('Search failed');
    }
  };

  return (
    <div className="container mt-5">
      <h3>Courses</h3>
      <div className="d-flex mb-3">
        <input
          type="text"
          placeholder="Search courses..."
          className="form-control me-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch} className="btn btn-secondary">
          Search
        </button>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Code</th>
            <th>Semester</th>
            <th>Lecturer</th>
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>{course.code}</td>
                <td>{course.semester}</td>
                <td>{course.lecturer_name || 'Unassigned'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No courses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Courses;