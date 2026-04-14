import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiMail, FiFileText } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const getAuthToken = () => {
    return localStorage.getItem('token');
};

const API_BASE_URL = 'http://localhost:5000/api/user';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token && token !== 'your_jwt_token_here') {
        config.headers['Authorization'] = `Bearer ${token}`;
    } else if (token === 'your_jwt_token_here') {
        console.warn("Using a placeholder JWT token. Please replace `getAuthToken` with your actual token retrieval logic.");
    }
    return config;
});

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', bio: '', skills: '' });
    const [resumeFile, setResumeFile] = useState(null);
    const [message, setMessage] = useState({ type: '', content: '' });
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/profile');
            setUser(data);
            setFormData({
                name: data.name,
                bio: data.bio || '',
                skills: Array.isArray(data.skills) ? data.skills.join(', ') : '',
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage({ type: 'error', content: 'Failed to fetch profile. Please make sure you are logged in.' });
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditToggle = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (isEditing) {
            setFormData({
                name: user.name,
                bio: user.bio || '',
                skills: Array.isArray(user.skills) ? user.skills.join(', ') : '',
            });
        }
        setIsEditing(!isEditing);
        setMessage({ type: '', content: '' });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
        try {
            const { data } = await api.put('/profile', { ...formData, skills: skillsArray });
            setUser(data);
            setIsEditing(false);
            setMessage({ type: 'success', content: 'Profile updated successfully!' });
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', content: 'Failed to update profile.' });
        }
    };

    const handleFileChange = (e) => {
        setResumeFile(e.target.files[0]);
    };

    const handleResumeUpload = async () => {
        if (!resumeFile) {
            setMessage({ type: 'error', content: 'Please select a resume file to upload.' });
            return;
        }
        const resumeFormData = new FormData();
        resumeFormData.append('resume', resumeFile);

        try {
            const { data } = await axios.post(`${API_BASE_URL}/resume`, resumeFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            fetchProfile(); 
            setResumeFile(null);
            if(fileInputRef.current) fileInputRef.current.value = "";
            setMessage({ type: 'success', content: data.message });
        } catch (error) {
            console.error('Error uploading resume:', error);
            setMessage({ type: 'error', content: 'Failed to upload resume.' });
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
            try {
                await api.delete('/account');
                setMessage({ type: 'success', content: 'Account deleted successfully.' });
                setUser(null); 
                navigate('/login');
            } catch (error) {
                console.error('Error deleting account:', error);
                setMessage({ type: 'error', content: 'Failed to delete account.' });
            }
        }
    };

    if (!user) {
        return <div className="profile-container"><p>{message.content || 'Loading profile...'}</p></div>;
    }

    return (
        <>
            <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

            .profile-container {
                font-family: 'Inter', sans-serif;
                background-color: transparent; 
                padding: 40px;
                display: flex;
                justify-content: center;
                width: 100%;
                box-sizing: border-box;
            }

            .profile-card {
                background-color: #ffffff;
                width: 100%;
                max-width: 900px;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
                overflow: hidden;
            }

            .profile-cover {
                height: 140px;
                background: linear-gradient(120deg, #cce4fc 0%, #fae8eb 50%, #fef3c7 100%);
            }

            .profile-header-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 40px;
                margin-bottom: 40px;
            }

            .profile-user-info {
                display: flex;
                align-items: center;
                gap: 24px;
            }

            .profile-avatar {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                border: 4px solid #ffffff;
                margin-top: -50px;
                object-fit: cover;
                background-color: #f3f4f6;
            }

            .profile-text-info {
                padding-top: 10px;
            }

            .profile-name {
                font-size: 1.25rem;
                font-weight: 600;
                color: #111827;
                margin-bottom: 4px;
            }

            .profile-email {
                font-size: 0.9rem;
                color: #6b7280;
            }

            .btn-edit {
                background-color: #3b82f6;
                color: #ffffff;
                font-size: 0.9rem;
                font-weight: 500;
                padding: 10px 24px;
                border-radius: 6px;
                border: none;
                cursor: pointer;
                transition: background-color 0.2s;
            }

            .btn-edit:hover {
                background-color: #2563eb;
            }

            .profile-form {
                padding: 0 40px 20px 40px;
            }

            .form-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 24px;
            }

            .form-group {
                display: flex;
                flex-direction: column;
            }

            .form-group.full-width {
                grid-column: 1 / -1;
            }

            .form-group label {
                font-size: 0.85rem;
                font-weight: 500;
                color: #4b5563;
                margin-bottom: 8px;
            }

            .form-group input, 
            .form-group textarea {
                background-color: #f8fafc;
                border: 1px solid transparent;
                border-radius: 8px;
                padding: 14px 16px;
                font-size: 0.95rem;
                color: #1f2937;
                font-family: inherit;
                outline: none;
                transition: border-color 0.2s;
            }

            .form-group input:focus, 
            .form-group textarea:focus {
                border-color: #3b82f6;
            }

            .form-group input:disabled, 
            .form-group textarea:disabled {
                color: #9ca3af;
                background-color: #f1f5f9;
            }

            .form-group textarea {
                min-height: 100px;
                resize: vertical;
            }

            .hints-text {
                margin-top: 6px;
                font-size: 0.8rem;
                color: #6b7280;
            }

            .btn-save {
                background-color: #10b981;
                color: white;
                font-size: 0.9rem;
                font-weight: 500;
                padding: 12px 24px;
                border-radius: 8px;
                border: none;
                cursor: pointer;
                margin-top: 24px;
                transition: background-color 0.2s;
            }

            .btn-save:hover {
                background-color: #059669;
            }

            .divider {
                height: 1px;
                background-color: #f3f4f6;
                margin: 20px 40px 40px 40px;
            }

            .custom-section {
                padding: 0 40px 40px 40px;
            }

            .custom-section-heading {
                font-size: 1rem;
                font-weight: 600;
                color: #111827;
                margin-bottom: 20px;
            }

            .info-row {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-bottom: 24px;
            }

            .icon-circle {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background-color: #eff6ff;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #3b82f6;
                font-size: 1.25rem;
                flex-shrink: 0;
            }

            .info-text-main {
                display: flex;
                flex-direction: column;
            }

            .info-text-title {
                font-size: 0.95rem;
                font-weight: 500;
                color: #111827;
                margin-bottom: 4px;
            }

            .info-text-sub {
                font-size: 0.85rem;
                color: #6b7280;
                text-decoration: none;
            }

            .info-text-sub.link {
                color: #3b82f6;
            }

            .info-text-sub.link:hover {
                text-decoration: underline;
            }

            .btn-light {
                background-color: #eff6ff;
                color: #3b82f6;
                font-size: 0.85rem;
                font-weight: 600;
                padding: 10px 20px;
                border-radius: 6px;
                border: none;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                transition: background-color 0.2s;
            }

            .btn-light:hover {
                background-color: #dbeafe;
            }

            .btn-light:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .file-upload-row {
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .file-upload-input {
                font-size: 0.85rem;
                color: #6b7280;
            }

            .file-upload-input::file-selector-button {
                background-color: #f1f5f9;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                padding: 6px 12px;
                cursor: pointer;
                color: #475569;
                margin-right: 12px;
                font-weight: 500;
            }

            .btn-delete {
                background-color: #fef2f2;
                color: #ef4444;
                border: 1px solid #fecaca;
                font-size: 0.85rem;
                font-weight: 600;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .btn-delete:hover {
                background-color: #fee2e2;
                border-color: #fca5a5;
            }
            .global-message {
                margin: 0 40px 20px 40px;
                padding: 12px;
                border-radius: 8px;
                font-size: 0.9rem;
            }
            .global-message.success {
                background-color: #d1fae5;
                color: #065f46;
            }
            .global-message.error {
                background-color: #fee2e2;
                color: #991b1b;
            }
            `}</style>

            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-cover"></div>
                    
                    <div className="profile-header-content">
                        <div className="profile-user-info">
                            <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=2563eb&color=fff&size=128`} alt="Avatar" className="profile-avatar" />
                            <div className="profile-text-info">
                                <div className="profile-name">{user.name}</div>
                                <div className="profile-email">{user.email}</div>
                            </div>
                        </div>
                        <button onClick={handleEditToggle} className="btn-edit" type="button">
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                    </div>

                    {message.content && (
                        <div className={`global-message ${message.type}`}>
                            {message.content}
                        </div>
                    )}

                    <form onSubmit={handleFormSubmit} className="profile-form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleInputChange} 
                                    disabled={!isEditing} 
                                    placeholder="Your Full Name"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Skills</label>
                                <input 
                                    type="text" 
                                    name="skills" 
                                    value={formData.skills} 
                                    onChange={handleInputChange} 
                                    disabled={!isEditing} 
                                    placeholder="e.g., React, Node.js"
                                />
                                {!isEditing && user.skills && user.skills.length > 0 && (
                                    <div className="hints-text">Current: {user.skills.join(', ')}</div>
                                )}
                            </div>

                            <div className="form-group full-width">
                                <label>Bio</label>
                                <textarea 
                                    name="bio" 
                                    value={formData.bio} 
                                    onChange={handleInputChange} 
                                    disabled={!isEditing} 
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                        </div>
                        
                        {isEditing && (
                            <button type="submit" className="btn-save">Save Changes</button>
                        )}
                    </form>

                    <div className="divider"></div>

                    <div className="custom-section">
                        <h3 className="custom-section-heading">Manage Resume</h3>
                        <div className="info-row">
                            <div className="icon-circle">
                                <FiFileText />
                            </div>
                            <div className="info-text-main">
                                <span className="info-text-title">Current Resume</span>
                                {user.resumeUrl ? (
                                    <a href={user.resumeUrl} target="_blank" rel="noopener noreferrer" className="info-text-sub link">
                                        View Resume
                                    </a>
                                ) : (
                                    <span className="info-text-sub">No resume uploaded yet</span>
                                )}
                            </div>
                        </div>
                        
                        <div className="file-upload-row">
                            <input 
                                type="file" 
                                onChange={handleFileChange} 
                                ref={fileInputRef} 
                                accept=".pdf,.doc,.docx"
                                className="file-upload-input"
                            />
                            <button 
                                onClick={handleResumeUpload} 
                                className="btn-light" 
                                disabled={!resumeFile}
                                type="button"
                            >
                                + Upload new
                            </button>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="custom-section">
                        <h3 className="custom-section-heading">Account Management</h3>
                        <div className="info-row">
                            <div className="icon-circle" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
                                <FiMail />
                            </div>
                            <div className="info-text-main">
                                <span className="info-text-title">{user.email}</span>
                                <span className="info-text-sub">Registered Account</span>
                            </div>
                        </div>
                        <button onClick={handleDeleteAccount} className="btn-delete" type="button">
                            Delete Account
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Profile;