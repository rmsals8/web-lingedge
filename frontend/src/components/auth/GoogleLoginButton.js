import React, { useContext, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // 추가된 부분

const GoogleLoginButton = () => {
  const { login } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // 추가된 부분

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      console.log('구글 로그인 응답:', credentialResponse);
      
      const response = await axios.post('/api/users/google-login', {
        token: credentialResponse.credential
      });
      
      console.log('백엔드 응답:', response.data);
      
      // 응답에서 토큰 확인
      if (response.data && response.data.accessToken) {
        login(response.data.accessToken);
        navigate('/'); // 홈 페이지로 리다이렉트
      } else {
        setError('구글 로그인 응답이 유효하지 않습니다.');
      }
    } catch (error) {
      console.error('구글 로그인 오류:', error);
      setError('구글 로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login with Google</h2>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => {
            console.log('Google Login Failed');
            setError('Google login failed. Please try again.');
          }}
          useOneTap
          shape="rectangular"
          theme="filled_blue"
        />
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleLoginButton;