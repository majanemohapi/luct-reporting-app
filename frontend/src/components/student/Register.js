import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'student',
    faculty: 'Faculty of Information Communication Technology'
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debugging: Log form data before submitting
    console.log('Submitting form:', form);

    try {
      // Make sure to use the full URL to your backend
      const response = await axios.post('http://localhost:5000/api/register', form);
      alert(response.data.message || 'Registration successful');
      navigate('/login');
    } catch (err) {
      console.error('Error during registration:', err.response || err);
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', 
      backgroundColor: '#ccc', padding: '20px' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>Register</h2>
        <form 
          onSubmit={handleSubmit} 
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '300px' }}
        >
          {/* Username */}
          <div style={{ marginBottom: '15px', width: '100%' }}>
            <label style={{ display: 'block', textAlign: 'left', color: '#000', marginBottom: '5px' }}>Username</label>
            <input
              type="text"
              name="username"
              style={{ width: '100%', padding: '10px', border: '2px solid #0000ff', borderRadius: '5px', boxSizing: 'border-box' }}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '15px', width: '100%' }}>
            <label style={{ display: 'block', textAlign: 'left', color: '#000', marginBottom: '5px' }}>Password</label>
            <input
              type="password"
              name="password"
              style={{ width: '100%', padding: '10px', border: '2px solid #0000ff', borderRadius: '5px', boxSizing: 'border-box' }}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role */}
          <div style={{ marginBottom: '15px', width: '100%' }}>
            <label style={{ display: 'block', textAlign: 'left', color: '#000', marginBottom: '5px' }}>Role</label>
            <select
              name="role"
              style={{ width: '100%', padding: '10px', border: '2px solid #0000ff', borderRadius: '5px', boxSizing: 'border-box' }}
              value={form.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
              <option value="prl">Principal Lecturer</option>
              <option value="pl">Program Leader</option>
            </select>
          </div>

          {/* Faculty */}
          <div style={{ marginBottom: '15px', width: '100%' }}>
            <label style={{ display: 'block', textAlign: 'left', color: '#000', marginBottom: '5px' }}>Faculty</label>
            <input
              type="text"
              name="faculty"
              style={{ width: '100%', padding: '10px', border: '2px solid #0000ff', borderRadius: '5px', boxSizing: 'border-box' }}
              value={form.faculty}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{ width: '100%', padding: '10px', backgroundColor: '#16162b', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}
          >
            Register
          </button>

          {/* Link to Login */}
          <p style={{ marginTop: '10px' }}>
            Already have an account? <Link to="/login" style={{ color: '#101028' }}>Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
