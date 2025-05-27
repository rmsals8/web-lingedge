import React, { useState } from 'react';
import api from '../../utils/api';

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPasswordRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/api/users/request-reset-password', { email });
      setMessage(response.data);
    } catch (error) {
      setMessage(error.response?.data || 'An error occurred');
    }
    setIsLoading(false);
  };

  return (
    <div className="reset-password-request">
      <h2>Reset Password</h2>
      <form onSubmit={handleResetPasswordRequest}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Reset Password'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ResetPasswordRequest;