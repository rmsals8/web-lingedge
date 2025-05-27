import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { FaLock } from 'react-icons/fa';
import '../../ChangePassword.css';

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await api.post('/api/users/change-password', { newPassword });
      navigate('/profile');
    } catch (error) {
      setError('Failed to change password: ' + (error.response?.data || error.message));
    }
  };

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <h2 className="change-password-title">
          <FaLock className="lock-icon" /> Change Password
        </h2>
        <form onSubmit={handleSubmit} className="change-password-form">
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="password-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              className="password-input"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="change-password-button">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;