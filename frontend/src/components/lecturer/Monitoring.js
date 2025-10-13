import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Monitoring = () => {
  const [monitoring, setMonitoring] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editLog, setEditLog] = useState({});
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('/api/monitoring', { headers })
      .then(res => setMonitoring(res.data))
      .catch(err => alert('Failed to fetch monitoring logs'));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this log?')) return;
    try {
      await axios.delete(`/api/monitoring/${id}`, { headers });
      setMonitoring(monitoring.filter(log => log.id !== id));
      alert('Log deleted');
    } catch (err) {
      alert('Failed to delete log');
    }
  };

  const handleEdit = (log) => {
    setEditingId(log.id);
    setEditLog({ action: log.action, timestamp: log.timestamp });
  };

  const handleEditChange = (e) => {
    setEditLog({ ...editLog, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(`/api/monitoring/${id}`, editLog, { headers });
      const res = await axios.get('/api/monitoring', { headers });
      setMonitoring(res.data);
      setEditingId(null);
      alert('Log updated');
    } catch (err) {
      alert('Failed to update log');
    }
  };

  return (
    <div className="container mt-5">
      <h3>Monitoring Logs</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Action</th>
            <th>Timestamp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {monitoring.map((log) => (
            <tr key={log.id}>
              <td>
                {editingId === log.id ? (
                  <input
                    type="text"
                    name="action"
                    value={editLog.action}
                    onChange={handleEditChange}
                    className="form-control"
                  />
                ) : (
                  log.action
                )}
              </td>
              <td>
                {editingId === log.id ? (
                  <input
                    type="datetime-local"
                    name="timestamp"
                    value={editLog.timestamp}
                    onChange={handleEditChange}
                    className="form-control"
                  />
                ) : (
                  log.timestamp
                )}
              </td>
              <td>
                {editingId === log.id ? (
                  <button
                    onClick={() => handleSaveEdit(log.id)}
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
                      onClick={() => handleEdit(log)}
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
                      onClick={() => handleDelete(log.id)}
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

export default Monitoring;
