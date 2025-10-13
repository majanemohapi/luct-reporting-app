import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Classes = () => {
  const [form, setForm] = useState({ course_id: '', class_name: '', venue: '', scheduled_time: '' });
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('/api/courses', { headers }).then(res => setCourses(res.data));
    axios.get('/api/classes', { headers }).then(res => setClasses(res.data));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.course_id || !form.class_name || !form.venue || !form.scheduled_time) {
      alert('All fields required');
      return;
    }
    try {
      await axios.post('/api/classes', form, { headers });
      alert('Class added');
      axios.get('/api/classes', { headers }).then(res => setClasses(res.data));
      setForm({ course_id: '', class_name: '', venue: '', scheduled_time: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add class');
    }
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(`/api/search/classes?query=${searchQuery}`, { headers });
      setClasses(res.data);
    } catch (err) {
      alert('Search failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      await axios.delete(`/api/classes/${id}`, { headers });
      setClasses(classes.filter(cls => cls.id !== id));
      alert('Class deleted');
    } catch (err) {
      alert('Failed to delete class');
    }
  };

  const handleEdit = (cls) => {
    setEditingId(cls.id);
    setEditForm({
      course_id: cls.course_id,
      class_name: cls.class_name,
      venue: cls.venue,
      scheduled_time: cls.scheduled_time
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    try {
      await axios.put(`/api/classes/${id}`, editForm, { headers });
      alert('Class updated');
      const res = await axios.get('/api/classes', { headers });
      setClasses(res.data);
      setEditingId(null);
    } catch (err) {
      alert('Failed to update class');
    }
  };

  return (
    <div className="container mt-5">
      <h3>Add Class</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Course</label>
          <select name="course_id" className="form-control" value={form.course_id} onChange={handleChange}>
            <option value="">Select Course</option>
            {courses.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Class Name</label>
          <input type="text" name="class_name" className="form-control" value={form.class_name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Venue</label>
          <input type="text" name="venue" className="form-control" value={form.venue} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Scheduled Time</label>
          <input type="time" name="scheduled_time" className="form-control" value={form.scheduled_time} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Add Class</button>
      </form>

      <h3 className="mt-5">Classes</h3>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls.id}>
              <td>{cls.id}</td>
              <td>
                {editingId === cls.id ? (
                  <select name="course_id" value={editForm.course_id} onChange={handleEditChange} className="form-control">
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                  </select>
                ) : (
                  cls.course_name
                )}
              </td>
              <td>
                {editingId === cls.id ? (
                  <input type="text" name="class_name" value={editForm.class_name} onChange={handleEditChange} className="form-control" />
                ) : (
                  cls.class_name
                )}
              </td>
              <td>
                {editingId === cls.id ? (
                  <input type="text" name="venue" value={editForm.venue} onChange={handleEditChange} className="form-control" />
                ) : (
                  cls.venue
                )}
              </td>
              <td>
                {editingId === cls.id ? (
                  <input type="time" name="scheduled_time" value={editForm.scheduled_time} onChange={handleEditChange} className="form-control" />
                ) : (
                  cls.scheduled_time
                )}
              </td>
              <td>
                {editingId === cls.id ? (
                  <button
                    onClick={() => handleEditSave(cls.id)}
                    style={{
                      backgroundColor: '#28a745',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(cls)}
                      style={{
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 12px',
                        marginRight: '10px',
                        borderRadius: '4px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cls.id)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Classes;
