import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    FiMapPin, 
    FiBriefcase, 
    FiClock, 
    FiChevronRight,
    FiSearch,
    FiFileText
} from 'react-icons/fi';
import { applicationAPI } from '../../api/services';
import Loader from '../../components/common/Loader';

const myApplicationsStyles = `
    .applications-container {
        padding: 40px;
        max-width: 1200px;
        margin: 0 auto;
        font-family: 'Inter', sans-serif;
    }

    .page-header {
        margin-bottom: 40px;
    }

    .title-icon{
      color: #2563EB;
    }
    .page-title {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 2rem;
        font-weight: 800;
        color: #111827;
        margin-bottom: 8px;
    }

    .page-subtitle {
        color: #6B7280;
        font-size: 1rem;
    }

    .applications-list {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .app-card {
        background: #FFFFFF;
        border: 1px solid #E5E7EB;
        border-radius: 16px;
        padding: 24px;
        display: flex;
        align-items: center;
        gap: 24px;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
    }

    .app-card:hover {
        border-color: #2563EB;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        transform: translateY(-2px);
    }

    .app-info {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 24px;
    }

    .job-main-info {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .job-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #111827;
        letter-spacing: -0.01em;
    }

    .company-row {
        display: flex;
        align-items: center;
        gap: 12px;
        color: #6B7280;
        font-size: 0.875rem;
        font-weight: 600;
        text-transform: uppercase;
    }

    .dot {
        width: 4px;
        height: 4px;
        background: #D1D5DB;
        border-radius: 50%;
    }

    .job-type-badge {
        padding: 4px 12px;
        border-radius: 8px;
        font-size: 0.85rem;
        font-weight: 600;
        background: #FEF3C7;
        color: #B45309;
        text-transform: capitalize;
    }

    .right-metadata {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
        min-width: 150px;
        margin-right: 20px;
    }

    .posted-info {
        color: #9CA3AF;
        font-size: 0.825rem;
        font-weight: 500;
        letter-spacing: 0.02em;
    }

    .status-badge {
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 0.75rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        display: inline-block;
    }

    .status-pending { background: #FEF3C7; color: #92400E; }
    .status-accepted { background: #D1FAE5; color: #065F46; }
    .status-rejected { background: #FEE2E2; color: #991B1B; }

    .empty-state {
        text-align: center;
        padding: 80px 0;
        background: #F9FAFB;
        border-radius: 20px;
        border: 2px dashed #E5E7EB;
    }

    .empty-icon {
        font-size: 4rem;
        color: #D1D5DB;
        margin-bottom: 24px;
    }

    .btn-browse {
        margin-top: 24px;
        padding: 12px 24px;
        background: #2563EB;
        color: #FFFFFF;
        border-radius: 10px;
        font-weight: 600;
        border: none;
        cursor: pointer;
        transition: background 0.2s;
    }

    .btn-browse:hover { background: #1D4ED8; }

    @media (max-width: 900px) {
        .app-info {
            grid-template-columns: 1fr;
            gap: 12px;
        }
        .posted-info {
            align-items: flex-start;
            text-align: left;
        }
        .app-card {
            flex-direction: column;
            align-items: flex-start;
        }
    }
`;

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await applicationAPI.myApplications();
                setApplications(res.data);
            } catch (err) {
                console.error('Error fetching applications:', err);
                setError('Failed to load your applications. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const handleCardClick = (job) => {
        navigate(`/jobs/${job._id}`, { 
            state: { 
                background: location,
                jobData: job,
                isApplied: true 
            } 
        });
    };

    if (loading) return <Loader fullPage message="Fetching your applications..." />;

    return (
        <div className="applications-container">
            <style>{myApplicationsStyles}</style>

            <header className="page-header">
                <h1 className="page-title">
                  <FiFileText className = "title-icon"/>
                  Job Applications
                </h1>
                <p className="page-subtitle">Track the status of your recent applications</p>
            </header>

            {error && (
                <div className="empty-state" style={{ borderColor: '#FEE2E2', background: '#FEF2F2' }}>
                    <p style={{ color: '#DC2626', fontWeight: 600 }}>{error}</p>
                    <button className="btn-browse" onClick={() => window.location.reload()}>Retry</button>
                </div>
            )}

            {!error && applications.length > 0 ? (
                <div className="applications-list">
                    {applications.map((app) => {
                        const job = app.job;
                        if (!job) return null;
                        return (
                            <div 
                                key={app._id} 
                                className="app-card"
                                onClick={() => handleCardClick(job)}
                            >


                                <div className="app-info">
                                    <div className="job-main-info">
                                        <h2 className="job-title">{job.title}</h2>
                                        <div className="company-row">
                                            <span>{job.company}</span>
                                            <span className="dot"></span>
                                            <span className="job-type-badge">{job.jobType.replace('-', ' ')}</span>
                                            <span className="dot"></span>
                                            <span style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '4px',
                                                color: '#4B5563', 
                                                textTransform: 'none', 
                                                fontWeight: 500 
                                            }}>
                                                <FiMapPin size={14} style={{ color: '#9CA3AF' }} />
                                                {job.location}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="right-metadata">
                                        <div className={`status-badge status-${app.status.toLowerCase()}`}>
                                            {app.status}
                                        </div>
                                        <div className="posted-info">
                                            Applied {formatDate(app.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : !error && (
                <div className="empty-state">
                    <FiSearch className="empty-icon" />
                    <h2>No applications found</h2>
                    <p>Start your career journey by applying to some jobs!</p>
                    <button className="btn-browse" onClick={() => navigate('/jobs')}>
                        Browse Jobs
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyApplications;