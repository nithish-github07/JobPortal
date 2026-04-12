import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { FaGoogle } from 'react-icons/fa'; 
import axios from 'axios';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try{
        const response = await axios.post('http://localhost:5000/api/auth/login',{
            email,
            password
        });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user',JSON.stringify(response.data.user));

        navigate('/dashboard');

    } catch(err){
        if (err.response && err.response.data && err.response.data.message) {
            setError(err.response.data.message);
      } else {
            setError('Login failed. Please check your credentials.');
      }
      console.error('Login error:', err);
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .login-page-body {
        margin: 0;
        font-family: 'Inter', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .login-container {
        display: flex;
        min-height: 100vh;
        font-family: 'Inter', sans-serif;
    }

    /* Form Section */
    .login-form-section {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        background-color: #fff;
    }

    .login-form-wrapper {
        max-width: 360px;
        width: 100%;
    }

    .login-logo {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 48px;
    }

    .login-logo-text {
        font-size: 2rem;
        font-weight: 600;
        color: #101828;
    }

    .login-header h2 {
        font-size: 1.875rem;
        font-weight: 600;
        color: #101828;
        margin: 0 0 8px;
    }

    .login-header p {
        font-size: 1rem;
        color: #667085;
        margin: 0 0 32px;
    }

    .error-message {
        color: #D92D20;
        background-color: #FEECEB;
        border: 1px solid #FECDCA;
        border-radius: 8px;
        padding: 10px;
        text-align: center;
        font-size: 0.875rem;
        margin-bottom: 20px;
    }

    .input-group {
        margin-bottom: 20px;
    }

    .input-group label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: #344054;
        margin-bottom: 6px;
    }

    .input-group input {
        width: 100%;
        padding: 10px 14px;
        font-size: 1rem;
        border: 1px solid #D0D5DD;
        border-radius: 8px;
        box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
        box-sizing: border-box;
    }

    .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
    }

    .remember-me {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .remember-me label {
        font-size: 0.875rem;
        font-weight: 500;
        color: #344054;
    }

    .form-options a {
        font-size: 0.875rem;
        font-weight: 600;
        color: #1570EF;
        text-decoration: none;
    }

    .btn {
        width: 100%;
        padding: 10px;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        border: none;
        cursor: pointer;
        margin-bottom: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
    }

    .btn-primary {
        background-color: #1570EF;
        color: white;
        box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
    }

    .btn-google {
        background-color: #fff;
        color: #344054;
        border: 1px solid #D0D5DD;
        box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
    }

    .signup-link {
        text-align: center;
        font-size: 0.875rem;
        color: #667085;
    }

    .signup-link a {
        font-weight: 600;
        color: #1570EF;
        text-decoration: none;
    }

    /* Info Section */
    .info-section {
        flex: 1;
        background-color: #15284A;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 3rem;
        position: relative;
        overflow: hidden;
    }

    .info-section::before, .info-section::after {
        content: '';
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.05);
        filter: blur(50px);
    }

    .info-section::before {
        width: 400px;
        height: 400px;
        top: -100px;
        right: -100px;
    }

    .info-section::after {
        width: 300px;
        height: 300px;
        bottom: -150px;
        left: -150px;
    }


    .info-wrapper {
        max-width: 400px;
        z-index: 1;
    }

    .info-logo {
        margin-bottom: 100px;
    }

    .info-wrapper h2 {
        font-size: 1.875rem;
        font-weight: 600;
        margin: 0 0 16px;
    }

    .info-wrapper > p {
        font-size: 1rem;
        color: #E4E7EC;
        line-height: 1.5;
        margin-bottom: 48px;
    }

    .chat-mockup {
        position: relative;
    }

    .chat-bubble {
        padding: 16px;
        border-radius: 12px;
        margin-bottom: 16px;
        max-width: 90%;
    }

    .applyo-bubble {
        background: rgba(255, 255, 255, 0.9);
        color: #344054;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .applyo-bubble strong {
        display: block;
        margin-bottom: 4px;
        font-weight: 600;
    }

    .user-bubble {
        background-color: #1570EF;
        color: white;
        margin-left: auto;
        padding: 12px 16px;
    }

    .user-bubble strong {
        display: none;
    }

    /* Responsive */
    @media (max-width: 992px) {
        .info-section {
            display: none;
        }
        .login-form-section {
            flex-basis: 100%;
        }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="login-container login-page-body">
        <div className="login-form-section">
          <div className="login-form-wrapper">
            <div className="login-logo">
              <span className="login-logo-text">Applyo</span>
            </div>
            <div className="login-header">
              <h2>Log in</h2>
              <p>Welcome back! Please enter your details.</p>
            </div>
            <form onSubmit={handleLogin}>
                {error && <div className = "error-message">{error}</div>}
              <div className="input-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder = "olivia@untitledui.com"
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder = "••••••••"
                />
              </div>
              <button type="submit" className="btn btn-primary">Sign in</button>
            </form>
            <div className="signup-link">
              <p>Don't have an account? <Link to="/register">Sign up</Link></p>
            </div>
          </div>
        </div>
        <div className="info-section">
          <div className="info-wrapper">
              <h2>Welcome to Applyo</h2>
              <p><b>Applyo</b> helps you discover the right opportunities, apply with confidence, and stay on top of every application.</p>
              <div className="chat-mockup">
                  <div className="chat-bubble applyo-bubble">
                      <div className="chat-text">
                          <strong>Applyo</strong>
                          <p>Hi, this is Applyo! Your dream job is just a few clicks away. Shall we begin?</p>
                      </div>
                  </div>
                  <div className="chat-bubble user-bubble">
                      <strong>You</strong>
                      <p>Yes, I'm ready. Let's go</p>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;