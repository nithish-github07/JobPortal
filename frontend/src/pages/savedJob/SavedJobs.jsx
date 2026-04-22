import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FiX, 
    FiMapPin, 
    FiClock, 
    FiBriefcase,
    FiSearch,
    FiBookmark
} from 'react-icons/fi';
import { savedJobAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';

const SavedJobs = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                setLoading(true);
                const response = await savedJobAPI.getSaved();
                setSavedJobs(response.data.filter(item => item.job));
            } catch (err) {
                console.error('Error fetching saved jobs:', err);
                setError('Failed to load saved jobs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchSavedJobs();
        }
    }, [user]);

    const handleRemoveSave = async (e, jobId) => {
        e.stopPropagation();
        try {
            await savedJobAPI.remove(jobId);
            setSavedJobs(prev => prev.filter(item => item.job._id !== jobId));
        } catch (err) {
            console.error('Error removing job:', err);
            alert('Failed to remove job from saved list.');
        }
    };

    const handleCardClick = (jobId) => {
        navigate(`/jobs/${jobId}`);
    };

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const filteredJobs = savedJobs.filter(item => {
        const job = item.job;
        return job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
               job.company.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (loading) return <Loader fullPage message="Loading your saved jobs..." />;

    if (error) {
        return (
            <div className="empty-state">
                <p style={{ color: '#EF4444' }}>{error}</p>
                <button onClick={() => window.location.reload()} className="btn-save" style={{ marginTop: '16px' }}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="job-list-container">
            <style>{`
                .job-list-container {
                    padding: 24px 40px;
                    max-width: 1400px;
                    margin: 0 auto;
                    font-family: 'Inter', sans-serif;
                }

                .page-header {
                    margin-bottom: 32px;
                }

                .header-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }

                .page-title {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 1.875rem;
                    font-weight: 700;
                    color: #111827;
                }

                .title-icon {
                    color: #2563EB;
                }

                .search-bar {
                    position: relative;
                    width: 100%;
                    max-width: 400px;
                }

                .search-bar input {
                    width: 100%;
                    padding: 12px 16px 12px 44px;
                    border: 1px solid #E5E7EB;
                    border-radius: 12px;
                    font-size: 0.95rem;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    background-color: #FFFFFF;
                }

                .search-bar input:focus {
                    border-color: #2563EB;
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                }

                .search-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #9CA3AF;
                    font-size: 1.1rem;
                }

                .jobs-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
                    gap: 24px;
                }

                .job-card {
                    background: #FFFFFF;
                    border: 1px solid #F3F4F6;
                    border-radius: 16px;
                    padding: 24px;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }

                .job-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.08);
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 16px;
                }

                .title-area {
                    flex: 1;
                }

                .job-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 4px;
                }

                .company-name {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #4B5563;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .icon-btn {
                    background: none;
                    border: none;
                    padding: 8px;
                    cursor: pointer;
                    color: #9CA3AF;
                    border-radius: 50%;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                }

                .icon-btn:hover {
                    background-color: #FEE2E2;
                    color: #EF4444;
                }

                .job-meta {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    color: #6B7280;
                    font-size: 0.875rem;
                    margin-bottom: 16px;
                }

                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .job-description {
                    font-size: 0.95rem;
                    color: #4B5563;
                    line-height: 1.6;
                    margin-bottom: 20px;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .skills-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-bottom: 24px;
                    flex-grow: 1;
                }

                .skill-tag {
                    background-color: #F3F4F6;
                    color: #4B5563;
                    padding: 6px 14px;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    font-weight: 500;
                }

                .card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 20px;
                    border-top: 1px solid #F3F4F6;
                }

                .posted-time {
                    font-size: 0.875rem;
                    color: #9CA3AF;
                    font-weight: 500;
                }

                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 400px;
                    width: 100%;
                    grid-column: 1 / -1;
                    color: #6B7280;
                    text-align: center;
                }

                .empty-state h3 {
                    font-size: 1.5rem;
                    color: #111827;
                    margin-bottom: 8px;
                }

                .btn-explore {
                    margin-top: 24px;
                    padding: 12px 24px;
                    background-color: #2563EB;
                    color: white;
                    border-radius: 12px;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .btn-explore:hover {
                    background-color: #1D4ED8;
                }
            `}</style>

            <header className="page-header">
                <div className="header-top">
                    <h1 className="page-title">
                        <FiBookmark className="title-icon" />
                        Saved Jobs
                    </h1>
                    <div className="search-bar">
                        <FiSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search in saved jobs..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <main className="jobs-grid">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map(item => {
                        const job = item.job;
                        return (
                            <div 
                                key={item._id} 
                                className="job-card"
                                onClick={() => handleCardClick(job._id)}
                            >
                                <div className="card-header">
                                    <div className="title-area">
                                        <h2 className="job-title">{job.title}</h2>
                                        <span className="company-name">{job.company}</span>
                                    </div>
                                    <button 
                                        className="icon-btn"
                                        onClick={(e) => handleRemoveSave(e, job._id)}
                                        title="Remove from Saved"
                                    >
                                        <FiX />
                                    </button>
                                </div>

                                <div className="job-meta">
                                    <div className="meta-item">
                                        <FiMapPin />
                                        <span>{job.location}</span>
                                    </div>
                                    <div className="meta-item">
                                        <FiBriefcase />
                                        <span style={{ textTransform: 'capitalize' }}>
                                            {job.jobType?.replace('-', ' ')}
                                        </span>
                                    </div>
                                </div>

                                <p className="job-description">
                                    {job.description}
                                </p>

                                <div className="skills-tags">
                                    {job.skills?.slice(0, 3).map((skill, index) => (
                                        <span key={index} className="skill-tag">{skill}</span>
                                    ))}
                                    {job.skills?.length > 3 && (
                                        <span className="skill-tag" style={{ background: 'none', paddingLeft: '4px' }}>
                                            +{job.skills.length - 3} more
                                        </span>
                                    )}
                                </div>

                                <div className="card-footer">
                                    <div className="posted-time">
                                        Saved on {formatDate(item.createdAt)}
                                    </div>
                                    <div className="meta-item" style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
                                        <FiClock />
                                        <span>Posted {formatDate(job.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="empty-state">
                        <FiBookmark size={64} style={{ marginBottom: '20px', opacity: 0.2, color: '#2563EB' }} />
                        <h3>{searchTerm ? 'No matches found' : 'No saved jobs yet'}</h3>
                        <p>
                            {searchTerm 
                                ? 'Try searching for something else in your saved items.' 
                                : 'Jobs you save will appear here for easy access.'}
                        </p>
                        {!searchTerm && (
                            <button className="btn-explore" onClick={() => navigate('/jobs')}>
                                Explore Jobs
                            </button>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default SavedJobs;