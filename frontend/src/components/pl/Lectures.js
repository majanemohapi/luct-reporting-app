import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Lectures = () => {
  const [form, setForm] = useState({ course_id: '', lecturer_id: '' });
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('/api/courses', { headers }).then(res => setCourses(res.data));
    axios.get('/api/users?role=lecturer', { headers }).then(res => setLecturers(res.data));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.course_id || !form.lecturer_id) {
      alert('All fields required');
      return;
    }
    try {
      await axios.put(`/api/courses/${form.course_id}/assign`, { lecturer_id: form.lecturer_id }, { headers });
      alert('Lecturer assigned');
      axios.get('/api/courses', { headers }).then(res => setCourses(res.data));
      setForm({ course_id: '', lecturer_id: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign lecturer');
    }
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(`/api/search/courses?query=${searchQuery}`, { headers });
      setCourses(res.data);
    } catch (err) {
      alert('Search failed');
    }
  };

  return (
    <div className="container mt-5">
      {/* Assign Lecturer Form */}
      <h3>Assign Lecturer</h3>
      <form onSubmit={handleSubmit}>
        {/* Course */}
        <div className="form-group">
          <label>Course</label>
          <select name="course_id" className="form-control" value={form.course_id} onChange={handleChange}>
            <option value="">Select Course</option>
            {courses.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
          </select>
        </div>
        {/* Lecturer */}
        <div className="form-group">
          <label>Lecturer</label>
          <select name="lecturer_id" className="form-control" value={form.lecturer_id} onChange={handleChange}>
            <option value="">Select Lecturer</option>
            {lecturers.map(lecturer => <option key={lecturer.id} value={lecturer.id}>{lecturer.username}</option>)}
          </select>
        </div>
        {/* Submit */}
        <button type="submit" className="btn btn-primary mt-3">Assign</button>
      </form>

      {/* List Courses */}
      <h3 className="mt-5">Courses</h3>
      <input
        type="text"
        placeholder="Search courses..."
        className="form-control mb-3"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch} className="btn btn-secondary mb-3">Search</button>
      <table className="table">
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
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.id}</td>
              <td>{course.name}</td>
              <td>{course.code}</td>
              <td>{course.semester}</td>
              <td>{course.lecturer_name || 'Unassigned'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Lectures;