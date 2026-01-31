import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', { email, password });
      setMessage('User registered! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data || 'Error registering user.');
    }
  };

  return (
    <div className="container">
       <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <h2>Register</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                  <label>Email</label>
                  <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                  <label>Password</label>
                  <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button className="btn btn-success w-100" type="submit">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
