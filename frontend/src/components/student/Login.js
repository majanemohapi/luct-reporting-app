
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/login', form);
      localStorage.setItem('token', res.data.token);
      // Redirect based on role
      const role = res.data.role;
      navigate(`/${role}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', 
      backgroundColor: '#ccc' 
    }}>
      <div style={{ textAlign: 'center', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '20px' }}>
          <span role="img" aria-label="user" style={{ fontSize: '60px', color: '#24313eff' }}>👤</span>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ marginBottom: '15px', width: '100%', maxWidth: '300px' }}>
            <label style={{ display: 'block', textAlign: 'left', color: '#181f27ff', marginBottom: '5px' }}>Username</label>
            <input
              type="text"
              name="username"
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #1d2a38ff',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box',
                background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23007bff\'%3E%3Cpath d=\'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z\'/%3E%3C/svg%3E") no-repeat 10px center',
                paddingLeft: '40px',
              }}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ marginBottom: '15px', width: '100%', maxWidth: '300px' }}>
            <label style={{ display: 'block', textAlign: 'left', color: '#212e3dff', marginBottom: '5px' }}>Password</label>
            <input
              type="password"
              name="password"
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #17202bff',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box',
                background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23007bff\'%3E%3Cpath d=\'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z\'/%3E%3C/svg%3E") no-repeat 10px center',
                paddingLeft: '40px',
              }}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ marginBottom: '15px', color: '#1e252cff' }}>
            <input type="checkbox" id="remember" style={{ marginRight: '5px' }} /> <label htmlFor="remember">Remember me</label>
            <a href="/forgot-password" style={{ marginLeft: '20px', color: '#007bff', textDecoration: 'none' }}>Forgot password?</a>
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#1f2934ff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              width: '100%',
              maxWidth: '300px',
            }}
          >
            LOGIN
          </button>
          <p style={{ marginTop: '15px', color: '#1c2733ff' }}>
            Don't have an account? <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;