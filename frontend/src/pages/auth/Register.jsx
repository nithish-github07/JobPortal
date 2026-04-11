import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('jobSeeker');

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Registering with:', { name, email, password, role });
  };

  const styles = `
    /* Using styles from the login page for consistency */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .register-page-body {
        margin: 0;
        font-family: 'Inter', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .register-container {
        display: flex;
        min-height: 100vh;
        font-family: 'Inter', sans-serif;
    }

    .register-form-section {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        background-color: #fff;
    }

    .register-form-wrapper {
        max-width: 360px;
        width: 100%;
    }

    .register-logo {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 24px;
    }

    .register-logo-text {
        font-size: 2rem;
        font-weight: 600;
        color: #101828;
    }

    .register-header h2 {
        font-size: 1.875rem;
        font-weight: 600;
        color: #101828;
        margin: 0 0 8px;
    }

    .register-header p {
        font-size: 1rem;
        color: #667085;
        margin: 0 0 32px;
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

    .role-selection {
        margin-bottom: 20px;
    }

    .role-selection label {
        font-size: 0.875rem;
        font-weight: 500;
        color: #344054;
        margin-bottom: 12px;
        display: block;
    }

    .role-options {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }

    .role-option {
        padding: 12px;
        border: 1px solid #D0D5DD;
        border-radius: 8px;
        cursor: pointer;
        text-align: center;
        font-size: 0.875rem;
        font-weight: 500;
        color: #344054;
        transition: all 0.2s;
    }
    
    .role-option.selected {
        border-color: #1570EF;
        background-color: #F0F6FE;
        color: #1570EF;
        box-shadow: 0 0 0 2px #D1E4FD;
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

    .login-link {
        text-align: center;
        font-size: 0.875rem;
        color: #667085;
    }

    .login-link a {
        font-weight: 600;
        color: #1570EF;
        text-decoration: none;
    }

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
    
    /* Re-using pseudo-elements from login for background effect */
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

    .info-wrapper h2 {
        font-size: 1.875rem;
        font-weight: 600;
        margin: 0 0 16px;
    }

    .info-wrapper > p {
        font-size: 1rem;
        color: #E4E7EC;
        line-height: 1.5;
    }

    @media (max-width: 992px) {
        .info-section {
            display: none;
        }
        .register-form-section {
            flex-basis: 100%;
        }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="register-container register-page-body">
        <div className="register-form-section">
          <div className="register-form-wrapper">
            <div className="register-logo">
              <span className="register-logo-text">Applyo</span>
            </div>
            <div className="register-header">
              <h2>Create an account</h2>
              <p>Start your journey with us today.</p>
            </div>
            <form onSubmit={handleRegister}>
              <div className="input-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text" id="name" value={name}
                  onChange={(e) => setName(e.target.value)}
                  required placeholder="Enter your name"
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email" id="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required placeholder="Enter your email"
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password" id="password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required placeholder="Create a password"
                />
              </div>
              <div className="role-selection">
                <label>You are a...</label>
                <div className="role-options">
                    <div 
                        className={`role-option ${role === 'jobSeeker' ? 'selected' : ''}`}
                        onClick={() => setRole('jobSeeker')}>
                        Job Seeker
                    </div>
                    <div 
                        className={`role-option ${role === 'recruiter' ? 'selected' : ''}`}
                        onClick={() => setRole('recruiter')}>
                        Recruiter
                    </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Create account</button>
            </form>
            <div className="login-link">
              <p>Already have an account? <Link to="/login">Log in</Link></p>
            </div>
          </div>
        </div>
        <div className="info-section">
          <div className="info-wrapper">
              <h2>Join our community.</h2>
              <p>Whether you're looking for your next big opportunity or searching for the perfect candidate, <b>Applyo</b> connects talent with ambition. Join us and take the next step in your professional journey.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;