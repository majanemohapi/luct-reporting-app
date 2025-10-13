import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';

// Make sure to install chart.js and react-chartjs-2:
// npm install chart.js react-chartjs-2

const Reports = () => {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const [form, setForm] = useState({
    faculty_name: 'Faculty of Information Communication Technology',
    class_id: '',
    week: '',
    date: '',
    course_id: '',
    actual_students_present: '',
    venue: '',
    scheduled_time: '',
    topic_taught: '',
    learning_outcomes: '',
    recommendations: ''
  });
  const [errors, setErrors] = useState({});
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [reports, setReports] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [editTopic, setEditTopic] = useState('');
  const [editingReportId, setEditingReportId] = useState(null);

  // For line chart
  const [chartData, setChartData] = useState({});

  // Inline style for form elements
  const formStyle = {
    backgroundColor: '#f0f8ff', // Light azure background
    padding: '20px',
    borderRadius: '15px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    maxWidth: '800px',
    margin: '20px auto'
  };

  const labelStyle = {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px',
    display: 'block'
  };

  useEffect(() => {
    // Load courses and classes
    axios.get('/api/courses', { headers }).then(res => setCourses(res.data));
    axios.get('/api/classes', { headers }).then(res => setClasses(res.data));
    // Load reports
    axios.get('/api/reports', { headers }).then(res => {
      setReports(res.data);
      prepareChartData(res.data);
    });
  }, []);

  const prepareChartData = (reportsData) => {
    // Example: count reports per week
    const weeksCount = {};
    reportsData.forEach(r => {
      weeksCount[r.week] = (weeksCount[r.week] || 0) + 1;
    });
    const labels = Object.keys(weeksCount).sort((a, b) => a - b);
    const data = Object.values(weeksCount);
    setChartData({
      labels,
      datasets: [
        {
          label: 'Number of Reports per Week',
          data,
          fill: false,
          backgroundColor: 'blue',
          borderColor: 'lightblue'
        }
      ]
    });
  };

  const validateForm = () => {
    const errs = {};
    if (!form.faculty_name) errs.faculty_name = 'Required';
    if (!form.class_id) errs.class_id = 'Required';
    if (!form.week || form.week < 1) errs.week = 'Must be positive';
    if (!form.date) errs.date = 'Required';
    if (!form.course_id) errs.course_id = 'Required';
    if (
      form.actual_students_present === '' ||
      form.actual_students_present < 0
    )
      errs.actual_students_present = 'Must be non-negative';
    if (!form.venue) errs.venue = 'Required';
    if (!form.scheduled_time) errs.scheduled_time = 'Required';
    if (!form.topic_taught) errs.topic_taught = 'Required';
    if (!form.learning_outcomes) errs.learning_outcomes = 'Required';
    if (!form.recommendations) errs.recommendations = 'Required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setForm({ ...form, course_id: courseId });
    const selectedCourse = courses.find((c) => c.id === courseId);
    if (selectedCourse) {
      setTotalStudents(selectedCourse.total_registered_students);
    } else {
      setTotalStudents(0);
    }
  };

  const handleClassChange = (e) => {
    setForm({ ...form, class_id: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await axios.post('/api/reports', form, { headers });
      alert('Report submitted');
      // Reload reports
      const res = await axios.get('/api/reports', { headers });
      setReports(res.data);
      prepareChartData(res.data);
      // Reset form
      setForm({
        faculty_name: 'Faculty of Information Communication Technology',
        class_id: '',
        week: '',
        date: '',
        course_id: '',
        actual_students_present: '',
        venue: '',
        scheduled_time: '',
        topic_taught: '',
        learning_outcomes: '',
        recommendations: ''
      });
      setTotalStudents(0);
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    }
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(`/api/search/reports?query=${searchQuery}`, { headers });
      setReports(res.data);
      prepareChartData(res.data);
    } catch {
      alert('Search failed');
    }
  };

  const handleEdit = (report) => {
    setEditingReportId(report.id);
    setEditTopic(report.topic_taught);
  };

  const handleSaveEdit = async (reportId) => {
    try {
      await axios.put(`/api/reports/${reportId}`, { topic_taught: editTopic }, { headers });
      alert('Updated');
      // Refresh reports
      const res = await axios.get('/api/reports', { headers });
      setReports(res.data);
      prepareChartData(res.data);
      setEditingReportId(null);
    } catch {
      alert('Update failed');
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('Delete this report?')) return;
    try {
      await axios.delete(`/api/reports/${reportId}`, { headers });
      alert('Deleted');
      const res = await axios.get('/api/reports', { headers });
      setReports(res.data);
      prepareChartData(res.data);
    } catch {
      alert('Delete failed');
    }
  };

  return (
    <div className="container mt-4">
      <h4>Data Entry (Lecture)</h4>
      <form onSubmit={handleSubmit} style={formStyle}>
        {/* Faculty Name */}
        <div className="mb-3">
          <label style={labelStyle}>Faculty Name</label>
          <input
            type="text"
            className="form-control"
            value={form.faculty_name}
            readOnly
            style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}
          />
        </div>

        {/* Class Name dropdown */}
        <div className="mb-3">
          <label style={labelStyle}>Class Name</label>
          <select
            className="form-select"
            name="class_id"
            value={form.class_id}
            onChange={handleClassChange}
            style={{
              backgroundColor: '#fff3e0',
              borderRadius: '8px',
              borderColor: '#ff9800',
              fontSize: '16px'
            }}
          >
            <option value="">Select Class</option>
            {classes.map((cl) => (
              <option key={cl.id} value={cl.id}>{cl.class_name}</option>
            ))}
          </select>
          {errors.class_id && <div className="text-danger">{errors.class_id}</div>}
        </div>

        {/* Week of Reporting */}
        <div className="mb-3">
          <label style={labelStyle}>Week of Reporting</label>
          <input
            type="number"
            className="form-control"
            name="week"
            value={form.week}
            onChange={handleChange}
            min={1}
            style={{
              borderRadius: '8px',
              borderColor: '#ff5722',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          />
          {errors.week && <div className="text-danger">{errors.week}</div>}
        </div>

        {/* Date of Lecture */}
        <div className="mb-3">
          <label style={labelStyle}>Date of Lecture</label>
          <input
            type="date"
            className="form-control"
            name="date"
            value={form.date}
            onChange={handleChange}
            style={{
              borderRadius: '8px',
              borderColor: '#4caf50',
              fontSize: '16px'
            }}
          />
          {errors.date && <div className="text-danger">{errors.date}</div>}
        </div>

        {/* Course Name dropdown */}
        <div className="mb-3">
          <label style={labelStyle}>Course Name</label>
          <select
            className="form-select"
            name="course_id"
            value={form.course_id}
            onChange={handleCourseChange}
            style={{
              backgroundColor: '#e1bee7',
              borderRadius: '8px',
              borderColor: '#9c27b0',
              fontSize: '16px'
            }}
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.course_id && <div className="text-danger">{errors.course_id}</div>}
        </div>

        {/* Total Registered Students (display only) */}
        <div className="mb-3">
          <label style={labelStyle}>Total Registered Students</label>
          <input
            type="number"
            className="form-control"
            value={totalStudents}
            readOnly
            style={{
              backgroundColor: '#ffe0b2',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          />
        </div>

        {/* Actual Students Present */}
        <div className="mb-3">
          <label style={labelStyle}>Actual Number of Students Present</label>
          <input
            type="number"
            className="form-control"
            name="actual_students_present"
            value={form.actual_students_present}
            onChange={handleChange}
            min={0}
            style={{
              borderRadius: '8px',
              borderColor: '#03a9f4',
              fontSize: '16px'
            }}
          />
          {errors.actual_students_present && (
            <div className="text-danger">{errors.actual_students_present}</div>
          )}
        </div>

        {/* Venue */}
        <div className="mb-3">
          <label style={labelStyle}>Venue of the Class</label>
          <input
            type="text"
            className="form-control"
            name="venue"
            value={form.venue}
            onChange={handleChange}
            style={{
              borderRadius: '8px',
              borderColor: '#8bc34a',
              fontSize: '16px'
            }}
          />
          {errors.venue && <div className="text-danger">{errors.venue}</div>}
        </div>

        {/* Scheduled Lecture Time */}
        <div className="mb-3">
          <label style={labelStyle}>Scheduled Lecture Time</label>
          <input
            type="time"
            className="form-control"
            name="scheduled_time"
            value={form.scheduled_time}
            onChange={handleChange}
            style={{
              borderRadius: '8px',
              borderColor: '#ff9800',
              fontSize: '16px'
            }}
          />
          {errors.scheduled_time && (
            <div className="text-danger">{errors.scheduled_time}</div>
          )}
        </div>

        {/* Topic Taught */}
        <div className="mb-3">
          <label style={labelStyle}>Topic Taught</label>
          <input
            type="text"
            className="form-control"
            name="topic_taught"
            value={form.topic_taught}
            onChange={handleChange}
            style={{
              borderRadius: '8px',
              borderColor: '#9c27b0',
              fontSize: '16px'
            }}
          />
          {errors.topic_taught && (
            <div className="text-danger">{errors.topic_taught}</div>
          )}
        </div>

        {/* Learning Outcomes */}
        <div className="mb-3">
          <label style={labelStyle}>Learning Outcomes of the Topic</label>
          <textarea
            className="form-control"
            name="learning_outcomes"
            value={form.learning_outcomes}
            onChange={handleChange}
            rows={3}
            style={{
              borderRadius: '8px',
              borderColor: '#607d8b',
              fontSize: '16px'
            }}
          />
          {errors.learning_outcomes && (
            <div className="text-danger">{errors.learning_outcomes}</div>
          )}
        </div>

        {/* Lecturer's Recommendations */}
        <div className="mb-3">
          <label style={labelStyle}>Lecturer's Recommendations</label>
          <textarea
            className="form-control"
            name="recommendations"
            value={form.recommendations}
            onChange={handleChange}
            rows={3}
            style={{
              borderRadius: '8px',
              borderColor: '#ff5722',
              fontSize: '16px'
            }}
          />
          {errors.recommendations && (
            <div className="text-danger">{errors.recommendations}</div>
          )}
        </div>

        <button className="btn btn-primary" type="submit" style={{
          backgroundColor: '#4caf50',
          border: 'none',
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          transition: 'background-color 0.3s'
        }}>
          Submit Report
        </button>
      </form>

      {/* Reports List */}
      <h4 className="mt-5">My Reports</h4>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search reports..."
          className="form-control"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn btn-secondary mt-2" onClick={handleSearch}>Search</button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Week</th>
            <th>Date</th>
            <th>Lecturer</th>
            <th>Topic</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.week}</td>
              <td>{r.date}</td>
              <td>{r.lecturer_name}</td>
              <td>
                {editingReportId === r.id ? (
                  <input
                    value={editTopic}
                    onChange={(e) => setEditTopic(e.target.value)}
                    className="form-control"
                  />
                ) : (
                  r.topic_taught
                )}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-info me-2"
                  onClick={() => handleEdit(r)}
                >
                  Edit
                </button>
                {editingReportId === r.id && (
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleSaveEdit(r.id)}
                  >
                    Save
                  </button>
                )}
                <button
                  className="btn btn-sm btn-danger ms-2"
                  onClick={() => handleDelete(r.id)}
                >
                  Delete
                </button>
                {/* Download link */}
                <a
                  href={`/api/reports/${r.id}/excel`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-secondary ms-2"
                >
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Line Chart */}
      <h4>Reports over Weeks</h4>
      {chartData.labels ? (
        <Line data={chartData} />
      ) : (
        <p>No </p>
      )}
    </div>
  );
};

export default Reports;