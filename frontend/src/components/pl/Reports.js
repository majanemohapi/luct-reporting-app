import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [chartData, setChartData] = useState({});
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get('/api/reports', { headers });
      setReports(res.data);
      prepareChartData(res.data);
    } catch (err) {
      alert('Failed to fetch reports');
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

  const prepareChartData = (data) => {
    // Example: count reports per week
    const weekCounts = {};
    data.forEach(r => {
      weekCounts[r.week] = (weekCounts[r.week] || 0) + 1;
    });
    const labels = Object.keys(weekCounts).sort((a, b) => a - b);
    const counts = Object.values(weekCounts);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Number of Reports per Week',
          data: counts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    });
  };

  return (
    <div className="container mt-5">
      <h3>Reports</h3>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search reports..."
          className="form-control"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch} className="btn btn-secondary mt-2">Search</button>
      </div>

      {/* Reports Table */}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Week</th>
            <th>Date</th>
            <th>Lecturer</th>
            <th>Topic</th>
            <th>PRL Feedback</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr key={report.id}>
              <td>{report.id}</td>
              <td>{report.week}</td>
              <td>{report.date}</td>
              <td>{report.lecturer_name}</td>
              <td>{report.topic_taught}</td>
              <td>{report.prl_feedback || 'None'}</td>
              <td>
                <a
                  href={`/api/reports/${report.id}/excel`}
                  className="btn btn-sm btn-info"
                >
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bar Chart */}
      <h4 className="mt-5">Reports per Week</h4>
      {chartData.labels ? (
        <Bar data={chartData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
      ) : (
        <p>No data to display</p>
      )}
    </div>
  );
};

export default Reports;