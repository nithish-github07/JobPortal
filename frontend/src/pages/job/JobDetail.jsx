import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  FiMapPin,
  FiBriefcase,
  FiDollarSign,
  FiClock,
  FiHeart,
  FiX,
  FiChevronRight,
  FiCheckCircle,
  FiStar
} from 'react-icons/fi';
import { jobAPI, savedJobAPI, applicationAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';

const jobDetailStyles = `
    .job-detail-overlay {
        position: fixed;
        inset: 0;
        background: rgba(17, 24, 39, 0.75);
        display: flex;
        justify-content: center;
        align-items: flex-start;
        z-index: 1000;
        overflow-y: auto;
        padding: 40px 20px;
        will-change: opacity;
    }

    .job-detail-modal {
        background: #FFFFFF;
        width: 100%;
        max-width: 1100px;
        min-height: 400px;
        border-radius: 24px;
        position: relative;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
        display: grid;
        grid-template-columns: 1fr 350px;
        overflow: hidden;
        animation: modalAppear 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        will-change: transform, opacity;
    }

    @keyframes modalAppear {
        from { opacity: 0; transform: scale(0.95) translateY(10px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .modal-loader-container {
        grid-column: 1 / -1;
        padding: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .close-btn {
        position: absolute;
        top: 24px;
        right: 24px;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background: #F3F4F6;
        color: #6B7280;
        transition: all 0.2s;
    }

    .close-btn:hover {
        background: #FEE2E2;
        color: #EF4444;
        transform: rotate(90deg);
    }

    .main-content {
        padding: 48px;
        border-right: 1px solid #F3F4F6;
        max-height: 90vh;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    .header-section {
        margin-bottom: 40px;
    }

    .job-title-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;
        gap: 20px;
    }

    .job-title-detail {
        font-size: 2.25rem;
        font-weight: 800;
        color: #111827;
        font-family: 'Plus Jakarta Sans', sans-serif;
        line-height: 1.2;
    }

    .action-buttons {
        display: flex;
        gap: 12px;
        flex-shrink: 0;
    }

    .btn-apply {
        background: #2563EB;
        color: #FFFFFF;
        padding: 12px 32px;
        border-radius: 12px;
        font-weight: 700;
        border: none;
        cursor: pointer;
        transition: transform 0.2s, background 0.2s;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1rem;
    }

    .btn-apply:hover {
        background: #1D4ED8;
        transform: translateY(-1px);
    }

    .btn-apply:active {
        transform: translateY(0);
    }

    .btn-withdraw {
        background: #FEE2E2;
        color: #EF4444;
        padding: 12px 32px;
        border-radius: 12px;
        font-weight: 700;
        border: 1px solid #FECACA;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1rem;
    }

    .btn-withdraw:hover {
        background: #EF4444;
        color: #FFFFFF;
        border-color: #EF4444;
        transform: translateY(-1px);
    }

    .btn-save-detail {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        border: 1px solid #E5E7EB;
        background: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #9CA3AF;
        transition: all 0.2s;
        font-size: 1.25rem;
    }

    .btn-save-detail:hover {
        border-color: #EF4444;
        color: #EF4444;
        background: #FEF2F2;
    }

    .btn-save-detail.saved {
        background: #FEF2F2;
        border-color: #EF4444;
        color: #EF4444;
    }

    .job-subtitle {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 24px;
        flex-wrap: wrap;
    }

    .subtitle-item {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #4B5563;
        font-weight: 600;
        font-size: 1rem;
    }

    .company-tag {
        color: #2563EB;
        background: #EFF6FF;
        padding: 4px 12px;
        border-radius: 6px;
    }

    .tags-row {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }

    .tag-detail {
        padding: 8px 16px;
        background: #F3F4F6;
        border-radius: 10px;
        color: #4B5563;
        font-size: 0.875rem;
        font-weight: 600;
        text-transform: capitalize;
    }

    .detail-section {
        margin-bottom: 32px;
    }

    .detail-section h3 {
        font-size: 1.25rem;
        font-weight: 700;
        color: #111827;
        margin-bottom: 16px;
    }

    .detail-text {
        color: #4B5563;
        line-height: 1.8;
        font-size: 1rem;
        white-space: pre-line;
    }

    .skills-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .skill-pill {
        background: #F9FAFB;
        border: 1px solid #E5E7EB;
        color: #374151;
        padding: 8px 16px;
        border-radius: 100px;
        font-size: 0.875rem;
        font-weight: 500;
    }

    .salary-value {
        font-size: 1.2rem;
        font-weight: 700;
        color: #2563EB;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .sidebar-detail {
        background: #F9FAFB;
        padding: 48px 32px;
        max-height: 90vh;
        overflow-y: auto;
    }

    .sidebar-title {
        font-size: 1.125rem;
        font-weight: 700;
        color: #111827;
        margin-bottom: 24px;
    }

    .other-jobs-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .other-job-card {
        background: #FFFFFF;
        padding: 20px;
        border-radius: 16px;
        border: 1px solid #E5E7EB;
        cursor: pointer;
        transition: all 0.2s;
    }

    .other-job-card:hover {
        border-color: #2563EB;
        transform: translateX(4px);
    }

    .oj-title {
        font-weight: 700;
        color: #111827;
        margin-bottom: 4px;
        font-size: 1rem;
    }

    .oj-company {
        font-size: 0.875rem;
        color: #2563EB;
        font-weight: 600;
        margin-bottom: 8px;
    }

    .oj-location {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.8125rem;
        color: #6B7280;
    }

    .error-state {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-size: 1.25rem;
        color: #EF4444;
    }

    @media (max-width: 900px) {
        .job-detail-modal {
            grid-template-columns: 1fr;
        }
        .sidebar-detail {
            display: none;
        }
    }
`;

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [otherJobs, setOtherJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedApp, setAppliedApp] = useState(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    const stateData = location.state || {};
    const jobFromState = stateData.jobData && stateData.jobData._id === id ? stateData.jobData : null;

    if (jobFromState) {
      setJob(jobFromState);
      setLoading(false);
      if (stateData.allJobs) {
        setOtherJobs(stateData.allJobs.filter(j => j._id !== id).slice(0, 5));
      }
    } else {
      setLoading(true);
      setJob(null);
    }

    const fetchJobData = async () => {
      try {
        setLoading(true);
        setError(null);


        let currentJob = jobFromState;
        if (!currentJob) {
          try {
            const jobRes = await jobAPI.getById(id);
            currentJob = jobRes.data;
          } catch (jobErr) {
            console.error('Failed to fetch job details:', jobErr);
            return; 
          }
        }
        setJob(currentJob);

        if (user && user.role?.toLowerCase() === 'jobseeker') {
            savedJobAPI.getSaved()
              .then(res => {
                  const savedIds = new Set(res.data.map(item => item.job?._id || item._id));
                  setIsSaved(savedIds.has(id));
              })
              .catch(err => console.warn('Could not fetch saved status:', err));

            applicationAPI.myApplications()
              .then(res => {
                  const currentApp = res.data.find(app => (app.job?._id === id || app.job === id));
                  setAppliedApp(currentApp || null);
                  
                  const appliedJobIdsSet = new Set(res.data.map(app => app.job?._id || app.job));
                  jobAPI.getAll()
                    .then(allRes => {
                        setOtherJobs(allRes.data.filter(j => j._id !== id && !appliedJobIdsSet.has(j._id)).slice(0, 5));
                    })
                    .catch(err => console.warn('Could not fetch other jobs:', err));
              })
              .catch(err => {
                  console.warn('Could not fetch applications:', err);
                  jobAPI.getAll()
                    .then(allRes => setOtherJobs(allRes.data.filter(j => j._id !== id).slice(0, 5)))
                    .catch(e => console.warn('Could not fetch other jobs fallback:', e));
              });
        } else {
            jobAPI.getAll()
              .then(res => setOtherJobs(res.data.filter(j => j._id !== id).slice(0, 5)))
              .catch(err => console.warn('Could not fetch other jobs guest:', err));
        }

      } catch (err) {
        console.error('Unexpected error in JobDetail fetch:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [id, user, location.state]);

  const handleToggleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isSaved) {
        await savedJobAPI.remove(id);
        setIsSaved(false);
      } else {
        await savedJobAPI.save(id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role?.toLowerCase() === 'recruiter') {
      alert('Recruiters cannot apply for jobs.');
      return;
    }

    try {
      setIsApplying(true);
      const res = await applicationAPI.apply(id);
      setAppliedApp(res.data);
      const allJobsRes = await jobAPI.getAll();
      const appsRes = await applicationAPI.myApplications();
      const appliedJobIdsSet = new Set(appsRes.data.map(app => app.job?._id || app.job));
      setOtherJobs(allJobsRes.data.filter(j => j._id !== id && !appliedJobIdsSet.has(j._id)).slice(0, 5));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleWithdraw = async () => {
    if (!appliedApp) return;
    if (!window.confirm('Are you sure you want to withdraw your application?')) return;

    try {
      setIsWithdrawing(true);
      await applicationAPI.withdraw(appliedApp._id);
      setAppliedApp(null);
      const allJobsRes = await jobAPI.getAll();
      const appsRes = await applicationAPI.myApplications();
      const appliedJobIdsSet = new Set(appsRes.data.map(app => app.job?._id || app.job));
      setOtherJobs(allJobsRes.data.filter(j => j._id !== id && !appliedJobIdsSet.has(j._id)).slice(0, 5));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw application.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleClose = () => {
    if (location.state?.background) {
      navigate(location.state.background);
    } else {
      navigate('/jobs');
    }
  };

  const renderLoading = () => (
    <div className="modal-loader-container">
      <Loader message="Loading details..." />
    </div>
  );

  if (!loading && error) return (
    <div className="job-detail-overlay" onClick={handleClose}>
        <style>{jobDetailStyles}</style>
        <div className="job-detail-modal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', minHeight: '300px' }} onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={handleClose}>
                <FiX size={20} />
            </button>
            <FiX size={48} style={{ color: '#EF4444', marginBottom: '20px' }} />
            <h2 style={{ color: '#111827', marginBottom: '8px', fontSize: '1.5rem' }}>Failed to load details</h2>
            <p style={{ color: '#6B7280', marginBottom: '24px', textAlign: 'center' }}>We couldn't reach the server. Please check your connection and try again.</p>
            <button className="btn-apply" onClick={() => window.location.reload()}>Retry</button>
        </div>
    </div>
  );

  if (!loading && !job) return <div className="error-state">Job not found</div>;

  return (
    <div className="job-detail-overlay" onClick={handleClose}>
      <style>{jobDetailStyles}</style>

      <div className="job-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>
          <FiX size={20} />
        </button>

        {loading && !job ? renderLoading() : (
          <>
            <main className="main-content">
              <div className="header-section">
                <div className="job-title-row">
                  <h1 className="job-title-detail">{job.title}</h1>
                  <div className="action-buttons">
                    {user?.role?.toLowerCase() !== 'recruiter' && (
                      appliedApp ? (
                        <button
                          className="btn-withdraw"
                          onClick={handleWithdraw}
                          disabled={isWithdrawing}
                        >
                          {isWithdrawing ? 'Withdrawing...' : 'Withdraw Application'}
                        </button>
                      ) : (
                        <button
                          className="btn-apply"
                          onClick={handleApply}
                          disabled={isApplying}
                        >
                          {isApplying ? 'Applying...' : 'Apply Now'}
                        </button>
                      )
                    )}
                    {user?.role?.toLowerCase() !== 'recruiter' && (
                      <button
                        className={`btn-save-detail ${isSaved ? 'saved' : ''}`}
                        onClick={handleToggleSave}
                      >
                        <FiHeart fill={isSaved ? "currentColor" : "none"} />
                      </button>
                    )}

                  </div>
                </div>

                <div className="job-subtitle">
                  <span className="subtitle-item company-tag">{job.company}</span>
                  <span className="subtitle-item">
                    <FiMapPin /> {job.location}
                  </span>
                </div>

                <div className="tags-row">
                  <span className="tag-detail">{job?.jobType?.replace('-', ' ')}</span>
                  <span className="tag-detail">{job?.experience ? `${job.experience}+ Years` : 'Fresh Graduate'}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>About this role</h3>
                <p className="detail-text">{job.description}</p>
              </div>

              <div className="detail-section">
                <h3>Skills Required</h3>
                <div className="skills-container">
                  {job.skills && job.skills.map((skill, index) => (
                    <span key={index} className="skill-pill">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Expected Salary</h3>
                <div className="salary-value">
                  <FiDollarSign />
                  {job.salary ? `${job.salary.toLocaleString()} / year` : 'Negotiable'}
                </div>
              </div>
            </main>

            <aside className="sidebar-detail">
              <h2 className="sidebar-title">Other Jobs</h2>
              <div className="other-jobs-list">
                {otherJobs.map(oj => (
                  <div
                    key={oj._id}
                    className="other-job-card"
                    onClick={() => navigate(`/jobs/${oj._id}`, {
                      state: {
                        background: location.state?.background,
                        jobData: oj,
                        allJobs: (location.state && location.state.allJobs) || []
                      }
                    })}
                  >
                    <div className="oj-title">{oj.title}</div>
                    <div className="oj-company">{oj.company}</div>
                    <div className="oj-location">
                      <FiMapPin size={12} />
                      {oj.location}
                    </div>
                  </div>
                ))}
                {otherJobs.length === 0 && (
                  <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>No other jobs found</p>
                )}
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  );
};

export default JobDetail;