import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FiHeart, 
    FiEdit2, 
    FiX, 
    FiMapPin, 
    FiClock, 
    FiBriefcase,
    FiSearch 
} from 'react-icons/fi';
import { jobAPI, savedJobAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';

const JobList = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [savedJobIds, setSavedJobIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all'); 
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [jobsRes, savedRes] = await Promise.all([
                    jobAPI.getAll(),
                    (user && user.role?.toLowerCase() === 'jobseeker') ? savedJobAPI.getSaved() : Promise.resolve({ data: [] })
                ]);
                
                setJobs(jobsRes.data);
                
                if (savedRes.data) {
                    const ids = new Set(savedRes.data.map(item => item.job?._id || item._id));
                    setSavedJobIds(ids);
                }
            } catch (err) {
                console.error('Error fetching jobs:', err);
                setError('Failed to load jobs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleToggleSave = async (e, jobId) => {
        e.stopPropagation();
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            if (savedJobIds.has(jobId)) {
                await savedJobAPI.remove(jobId);
                setSavedJobIds(prev => {
                    const next = new Set(prev);
                    next.delete(jobId);
                    return next;
                });
            } else {
                await savedJobAPI.save(jobId);
                setSavedJobIds(prev => new Set(prev).add(jobId));
            }
        } catch (err) {
            console.error('Error toggling save:', err);
        }
    };

    const handleDelete = async (e, jobId) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await jobAPI.delete(jobId);
                setJobs(jobs.filter(job => job._id !== jobId));
            } catch (err) {
                console.error('Error deleting job:', err);
                alert('Failed to delete job.');
            }
        }
    };

    const handleEdit = (e, jobId) => {
        e.stopPropagation();
        navigate(`/jobs/${jobId}/edit`);
    };

    const handleCardClick = (jobId) => {
        navigate(`/jobs/${jobId}`);
    };

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             job.company.toLowerCase().includes(searchTerm.toLowerCase());
        
        const role = user?.role?.toLowerCase();
        if (role === 'recruiter') {
            const postedById = String(job.postedBy?._id || job.postedBy?.id || job.postedBy);
            const isMyJob = postedById === String(user?.id || user?._id);
            
            if (activeTab === 'my') {
                return matchesSearch && isMyJob;
            } else {
                return matchesSearch && !isMyJob;
            }
        }

        return matchesSearch;
    });

    if (loading) return <Loader fullPage message="Finding the best jobs for you..." />;

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

                .title-icon{
                    color: #2563EB;
                }

                .page-title {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 1.875rem;
                    font-weight: 700;
                    color: #111827;
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

                /* Tabs for Recruiter */
                .tabs {
                    display: flex;
                    gap: 32px;
                    border-bottom: 1px solid #E5E7EB;
                    margin-bottom: 32px;
                }

                .tab {
                    padding: 12px 4px;
                    font-size: 1rem;
                    font-weight: 500;
                    color: #6B7280;
                    cursor: pointer;
                    position: relative;
                    transition: color 0.2s;
                }

                .tab:hover {
                    color: #111827;
                }

                .tab.active {
                    color: #2563EB;
                }

                .tab.active::after {
                    content: '';
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background-color: #2563EB;
                }

                /* Job Grid */
                .jobs-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
                    gap: 24px;
                }

                /* Job Card Styling - Premium Look */
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

                .action-icons {
                    display: flex;
                    gap: 12px;
                }

                .icon-btn {
                    background: none;
                    border: none;
                    padding: 4px;
                    cursor: pointer;
                    color: #9CA3AF;
                    transition: color 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                }

                .icon-btn:hover {
                    color: #111827;
                }

                .icon-btn.heart.saved {
                    color: #EF4444;
                }

                .icon-btn.delete:hover {
                    color: #EF4444;
                }

                .icon-btn.edit:hover {
                    color: #2563EB;
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
                    font-size: 1.5rem;
                    color: #111827;
                    margin-bottom: 8px;
                }
            `}</style>

            <header className="page-header">
                <div className="header-top">
                    <h1 className="page-title">
                        <FiBriefcase className="title-icon" />
                        {user?.role?.toLowerCase() === 'recruiter' ? 'Manage Jobs' : 'Discover Opportunities'}
                    </h1>
                    <div className="search-bar">
                        <FiSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search by title or company..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {user?.role?.toLowerCase() === 'recruiter' && (
                    <div className="tabs">
                        <div 
                            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            Other Jobs
                        </div>
                        <div 
                            className={`tab ${activeTab === 'my' ? 'active' : ''}`}
                            onClick={() => setActiveTab('my')}
                        >
                            My Jobs
                        </div>
                    </div>
                )}
            </header>

            <main className="jobs-grid">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map(job => (
                        <div 
                            key={job._id} 
                            className="job-card"
                            onClick={() => handleCardClick(job._id)}
                        >
                            <div className="card-header">
                                <div className="title-area">
                                    <h2 className="job-title">{job.title}</h2>
                                    <span className="company-name">{job.company}</span>
                                </div>
                                {user?.role?.toLowerCase() === 'recruiter' && String(job.postedBy?._id || job.postedBy?.id || job.postedBy) === String(user?.id || user?._id) && (
                                    <div className="action-icons">
                                        <button 
                                            className="icon-btn edit"
                                            onClick={(e) => handleEdit(e, job._id)}
                                            title="Edit Job"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button 
                                            className="icon-btn delete"
                                            onClick={(e) => handleDelete(e, job._id)}
                                            title="Delete Job"
                                        >
                                            <FiX />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="job-meta">
                                <div className="meta-item">
                                    <FiMapPin />
                                    <span>{job.location}</span>
                                </div>
                                <div className="meta-item">
                                    <FiBriefcase />
                                    <span style={{ textTransform: 'capitalize' }}>
                                        {job.jobType.replace('-', ' ')}
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
                                    {formatDate(job.createdAt)}
                                </div>
                                
                                <div className="action-icons">
                                    {user?.role?.toLowerCase() === 'jobseeker' && (
                                        <button 
                                            className={`icon-btn heart ${savedJobIds.has(job._id) ? 'saved' : ''}`}
                                            onClick={(e) => handleToggleSave(e, job._id)}
                                            title={savedJobIds.has(job._id) ? "Remove from Favorites" : "Save Job"}
                                        >
                                            <FiHeart fill={savedJobIds.has(job._id) ? "currentColor" : "none"} />
                                        </button>
                                    )}

                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <FiSearch size={64} style={{ marginBottom: '20px', opacity: 0.2, color: '#2563EB' }} />
                        <h3>{searchTerm ? 'No matches found' : 'No jobs available at the moment'}</h3>
                    </div>
                )}
            </main>
        </div>
    );
};

export default JobList;