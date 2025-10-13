import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Rating = () => {
  const [reports, setReports] = useState([]);
  const [ratings, setRatings] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('/api/reports', { headers })
      .then(res => setReports(res.data))
      .catch(err => alert('Failed to fetch reports'));
  }, []);

  const handleRatingChange = (reportId, field, value) => {
    setRatings({ ...ratings, [reportId]: { ...ratings[reportId], [field]: value } });
  };

  const handleAddRating = async (reportId) => {
    const ratingData = ratings[reportId] || { rating: 0, comments: '' };
    if (!ratingData.rating || ratingData.rating < 1 || ratingData.rating > 5) {
      alert('Rating must be between 1 and 5');
      return;
    }
    try {
      await axios.post('/api/ratings', { report_id: reportId, ...ratingData }, { headers });
      alert('Rating added');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add rating');
    }
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(`/api/search/reports?query=${searchQuery}`, { headers });
      setReports(res.data);
    } catch (err) {
      alert('Search failed');
    }
  };

  return (
    <div className="container mt-5">
      <h3>Rate Reports</h3>
      <input
        type="text"
        placeholder="Search reports..."
        className="form-control mb-3"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch} className="btn btn-secondary mb-3">Search</button>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Lecturer</th>
            <th>Topic</th>
            <th>Rating (1-5)</th>
            <th>Comments</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr key={report.id}>
              <td>{report.id}</td>
              <td>{report.lecturer_name}</td>
              <td>{report.topic_taught}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  max="5"
                  className="form-control"
                  value={ratings[report.id]?.rating || ''}
                  onChange={(e) => handleRatingChange(report.id, 'rating', e.target.value)}
                />
              </td>
              <td>
                <textarea
                  className="form-control"
                  value={ratings[report.id]?.comments || ''}
                  onChange={(e) => handleRatingChange(report.id, 'comments', e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => handleAddRating(report.id)} className="btn btn-sm btn-primary">Rate</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Rating;