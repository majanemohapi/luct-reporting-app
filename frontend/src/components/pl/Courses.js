import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Courses = () => {
  const [courseForm, setCourseForm] = useState({ name: '', code: '', semester: '', total_registered_students: '' });
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [assignForm, setAssignForm] = useState({ course_id: '', lecturer_id: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('/api/courses', { headers }).then(res => setCourses(res.data));
    axios.get('/api/users?role=lecturer', { headers }).then(res => setLecturers(res.data));
  }, []);

  const handleCourseChange = (e) => setCourseForm({ ...courseForm, [e.target.name]: e.target.value });
  const handleAssignChange = (e) => setAssignForm({ ...assignForm, [e.target.name]: e.target.value });

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.name || !courseForm.code || !courseForm.semester || !courseForm.total_registered_students) {
      alert('All fields required');
      return;
    }
    try {
      await axios.post('/api/courses', courseForm, { headers });
      alert('Course added');
      axios.get('/api/courses', { headers }).then(res => setCourses(res.data));
      setCourseForm({ name: '', code: '', semester: '', total_registered_students: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add course');
    }
  };

  const handleAssignLecturer = async (e) => {
    e.preventDefault();
    if (!assignForm.course_id || !assignForm.lecturer_id) {
      alert('All fields required');
      return;
    }
    try {
      await axios.put(`/api/courses/${assignForm.course_id}/assign`, { lecturer_id: assignForm.lecturer_id }, { headers });
      alert('Lecturer assigned');
      axios.get('/api/courses', { headers }).then(res => setCourses(res.data));
      setAssignForm({ course_id: '', lecturer_id: '' });
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
      {/* Add Course Form */}
      <h3>Add Course</h3>
      <form onSubmit={handleAddCourse}>
        {/* Name */}
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" className="form-control" value={courseForm.name} onChange={handleCourseChange} />
        </div>
        {/* Code */}
        <div className="form-group">
          <label>Code</label>
          <input type="text" name="code" className="form-control" value={courseForm.code} onChange={handleCourseChange} />
        </div>
        {/* Semester */}
        <div className="form-group">
          <label>Semester</label>
          <input type="number" name="semester" className="form-control" value={courseForm.semester} onChange={handleCourseChange} />
        </div>
        {/* Total Registered Students */}
        <div className="form-group">
          <label>Total Registered Students</label>
          <input type="number" name="total_registered_students" className="form-control" value={courseForm.total_registered_students} onChange={handleCourseChange} />
        </div>
        {/* Submit Button */}
        <button type="submit" className="btn btn-primary mt-3">Add Course</button>
      </form>

      {/* Assign Lecturer */}
      <h3 className="mt-5">Assign Lecturer</h3>
      <form onSubmit={handleAssignLecturer}>
        {/* Course */}
        <div className="form-group">
          <label>Course</label>
          <select name="course_id" className="form-control" value={assignForm.course_id} onChange={handleAssignChange}>
            <option value="">Select Course</option>
            {courses.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
          </select>
        </div>
        {/* Lecturer */}
        <div className="form-group">
          <label>Lecturer</label>
          <select name="lecturer_id" className="form-control" value={assignForm.lecturer_id} onChange={handleAssignChange}>
            <option value="">Select Lecturer</option>
            {lecturers.map(lecturer => <option key={lecturer.id} value={lecturer.id}>{lecturer.username}</option>)}
          </select>
        </div>
        {/* Submit */}
        <button type="submit" className="btn btn-primary mt-3">Assign</button>
      </form>

      {/* Search and List Courses */}
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

export default Courses;