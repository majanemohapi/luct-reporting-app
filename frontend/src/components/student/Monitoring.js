import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Monitoring = () => {
  const [monitoring, setMonitoring] = useState([]);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('/api/monitoring', { headers })
      .then(res => setMonitoring(res.data))
      .catch(err => alert('Failed to fetch monitoring logs'));
  }, []);

  return (
    <div className="container mt-5">
      <h3>Monitoring Logs</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Action</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {monitoring.map(log => (
            <tr key={log.id}>
              <td>{log.action}</td>
              <td>{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Monitoring;