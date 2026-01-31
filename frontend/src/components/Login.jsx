import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  // Placeholder login
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <h2 className="text-center mb-4">Login</h2>
            <form>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" />
              </div>
              <button type="button" className="btn btn-primary w-100 mb-3">Login</button>
            </form>
            <div className="text-center">
                <Link to="/forgot-password">Forgot Password?</Link>
            </div>
            <div className="text-center mt-2">
                 {/* For testing registration */}
                 <Link to="/register">Register (Test)</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
