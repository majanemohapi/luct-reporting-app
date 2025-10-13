import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Monitoring = () => {
  const [monitoring, setMonitoring] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('/api/monitoring', { headers })
      .then(res => setMonitoring(res.data))
      .catch(err => alert('Failed to fetch monitoring logs'));
  }, []);

  const handleEdit = (log) => {
    setEditingId(log.id);
    setEditData({ action: log.action });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`/api/monitoring/${id}`, editData, { headers });
      alert('Log updated');
      const res = await axios.get('/api/monitoring', { headers });
      setMonitoring(res.data);
      setEditingId(null);
    } catch (err) {
      alert('Failed to update log');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this log?')) return;
    try {
      await axios.delete(`/api/monitoring/${id}`, { headers });
      alert('Log deleted');
      setMonitoring(monitoring.filter(log => log.id !== id));
    } catch (err) {
      alert('Failed to delete log');
    }
  };

  return (
    <div className="container mt-5">
      <h3>Monitoring Logs</h3>
      <table className="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Action</th>
            <th>Timestamp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {monitoring.map(log => (
            <tr key={log.id}>
              <td>{log.username}</td>
              <td>
                {editingId === log.id ? (
                  <input
                    type="text"
                    name="action"
                    className="form-control"
                    value={editData.action}
                    onChange={handleEditChange}
                  />
                ) : (
                  log.action
                )}
              </td>
              <td>{log.timestamp}</td>
              <td>
                {editingId === log.id ? (
                  <button
                    onClick={() => handleSave(log.id)}
                    style={{
                      backgroundColor: '#28a745',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      marginRight: '5px'
                    }}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(log)}
                    style={{
                      backgroundColor: '#007bff',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      marginRight: '5px'
                    }}
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(log.id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Monitoring;
