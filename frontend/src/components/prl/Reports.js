import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';


import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [feedback, setFeedback] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [chartData, setChartData] = useState({});
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = () => {
    axios.get('/api/reports', { headers })
      .then(res => {
        setReports(res.data);
        prepareChartData(res.data); 
      })
      .catch(err => alert('Failed to fetch reports'));
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

  // Prepare data for pie chart, e.g., by lecturer
  const prepareChartData = (reportsData) => {
    const categoryCounts = {};
    reportsData.forEach(r => {
      const category = r.lecturer_name;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    const labels = Object.keys(categoryCounts);
    const data = Object.values(categoryCounts);
    setChartData({
      labels,
      datasets: [
        {
          label: 'Reports by Lecturer',
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
          borderColor: 'rgba(255, 255, 255, 1)',
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
            <th>Feedback</th>
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
              <td>
                <input
                  type="text"
                  className="form-control"
                  value={feedback[report.id] || report.prl_feedback || ''}
                  onChange={(e) => handleFeedbackChange(report.id, e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => handleAddFeedback(report.id)} className="btn btn-sm btn-primary">Add Feedback</button>
                <a href={`/api/reports/${report.id}/excel`} className="btn btn-sm btn-info mx-2">Download</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pie Chart */}
      <h4 className="mt-5">Distribution of Reports by Lecturer</h4>
      {chartData.labels && chartData.labels.length > 0 ? (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <Pie data={chartData} options={{
            responsive: true,
            plugins: {
              legend: { position: 'bottom' },
              title: {
                display: true,
                text: 'Reports Distribution by Lecturer'
              }
            }
          }} />
        </div>
      ) : (
        <p>No chart data available.</p>
      )}
    </div>
  );
};

export default Reports;