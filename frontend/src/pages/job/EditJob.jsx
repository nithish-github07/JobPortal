import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FiX, FiPlusSquare, FiChevronDown, FiAlertCircle, FiSave } from 'react-icons/fi';
import { jobAPI } from '../../api/services';
import Loader from '../../components/common/Loader';

const editJobStyles = `
    .edit-job-overlay {
        position: fixed;
        inset: 0;
        background: rgba(17, 24, 39, 0.85);
        display: flex;
        justify-content: center;
        align-items: flex-start;
        z-index: 1100;
        overflow-y: auto;
        padding: 40px 20px;
    }

    .edit-job-modal {
        background: #FFFFFF;
        width: 100%;
        max-width: 850px;
        border-radius: 24px;
        position: relative;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
        animation: modalAppear 0.25s ease-out;
        padding: 48px;
    }

    @keyframes modalAppear {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
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

    .modal-header {
        margin-bottom: 32px;
    }

    .modal-title {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 2rem;
        font-weight: 800;
        color: #111827;
        margin: 0;
    }

    .title-icon {
        color: #2563EB;
    }

    .error-container {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #D92D20;
        background-color: #FEECEB;
        border: 1px solid #FECDCA;
        border-radius: 12px;
        padding: 12px 16px;
        font-size: 0.9rem;
        font-weight: 500;
        margin-bottom: 24px;
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 32px;
        row-gap: 24px;
    }

    .full-width {
        grid-column: span 2;
    }

    .input-group label {
        display: block;
        font-size: 0.9rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 8px;
    }

    .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .input-group input, 
    .input-group select, 
    .input-group textarea {
        width: 100%;
        padding: 12px 16px;
        font-size: 1rem;
        color: #111827;
        border: 1px solid #D1D5DB;
        border-radius: 12px;
        background-color: #FFFFFF;
        transition: all 0.15s ease;
        font-family: inherit;
    }

    .input-group textarea {
        resize: vertical;
        min-height: 120px;
    }

    .input-group input:focus, 
    .input-group select:focus, 
    .input-group textarea:focus {
        outline: none;
        border-color: #2563EB;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
    }

    .input-icon {
        position: absolute;
        right: 16px;
        color: #9CA3AF;
        pointer-events: none;
    }

    .input-group select {
        appearance: none;
        padding-right: 44px;
        cursor: pointer;
    }

    .footer-actions {
        margin-top: 40px;
        display: flex;
        justify-content: flex-end;
        gap: 16px;
    }

    .btn-cancel {
        padding: 12px 24px;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        color: #4B5563;
        background: #F3F4F6;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-cancel:hover {
        background: #E5E7EB;
    }

    .btn-save {
        padding: 12px 32px;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 700;
        color: #FFFFFF;
        background: #2563EB;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s;
    }

    .btn-save:hover {
        background: #1D4ED8;
        transform: translateY(-1px);
    }

    .btn-save:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        .form-grid {
            grid-template-columns: 1fr;
        }
        .full-width {
            grid-column: span 1;
        }
        .edit-job-modal {
            padding: 32px 24px;
        }
    }
`;

const EditJob = React.memo(() => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        jobType: 'Full Time',
        salary: '',
        experience: '',
        location: '',
        skills: '',
        description: '',
    });

    useEffect(() => {
        const fetchJobData = async () => {
            try {
                const stateJob = location.state?.jobData;
                let jobData;

                if (stateJob && stateJob._id === id) {
                    jobData = stateJob;
                } else {
                    const res = await jobAPI.getById(id);
                    jobData = res.data;
                }

                const displayJobType = jobData.jobType
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                setFormData({
                    title: jobData.title || '',
                    company: jobData.company || '',
                    jobType: displayJobType || 'Full Time',
                    salary: jobData.salary || '',
                    experience: jobData.experience || '',
                    location: jobData.location || '',
                    skills: Array.isArray(jobData.skills) ? jobData.skills.join(', ') : '',
                    description: jobData.description || '',
                });
            } catch (err) {
                console.error(err);
                setError('Failed to load job details');
            } finally {
                setLoading(false);
            }
        };

        fetchJobData();
    }, [id, location.state]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleClose = () => {
        if (location.state?.background) {
            navigate(location.state.background);
        } else {
            navigate('/jobs');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        const skillsArray = formData.skills
            .split(',')
            .map((skill) => skill.trim())
            .filter((skill) => skill.length > 0);

        const submissionData = {
            title: formData.title,
            company: formData.company || 'Not Specified',
            jobType: formData.jobType.toLowerCase().replace(' ', '-'),
            location: formData.location,
            description: formData.description,
            salary: Number(formData.salary) || undefined,
            experience: Number(formData.experience) || undefined,
            skills: skillsArray,
        };

        try {
            await jobAPI.update(id, submissionData);
            handleClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Error updating job details');
        } finally {
            setSaving(false);
        }
    };

    const memoizedStyles = useMemo(() => <style>{editJobStyles}</style>, []);

    return (
        <div className="edit-job-overlay" onClick={handleClose}>
            {memoizedStyles}
            <div className="edit-job-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={handleClose}>
                    <FiX size={20} />
                </button>

                <header className="modal-header">
                    <h1 className="modal-title">
                        <FiPlusSquare className="title-icon" />
                        Edit Job Details
                    </h1>
                </header>

                {loading ? (
                    <div style={{ padding: '60px 0' }}>
                        <Loader message="Fetching job details..." />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="error-container">
                                <FiAlertCircle />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-grid">
                            <div className="input-group full-width">
                                <label>Job Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Senior Frontend Engineer"
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Company</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="Company Name"
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Job Type</label>
                                <div className="input-wrapper">
                                    <select name="jobType" value={formData.jobType} onChange={handleChange}>
                                        <option value="Full Time">Full Time</option>
                                        <option value="Part Time">Part Time</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                    <FiChevronDown className="input-icon" />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Expected Salary (Per Year)</label>
                                <input
                                    type="number"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    placeholder="Amount in Rs."
                                    min={0}
                                />
                            </div>

                            <div className="input-group">
                                <label>Experience Required (Years)</label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    placeholder="Years of experience"
                                    min={0}
                                />
                            </div>

                            <div className="input-group full-width">
                                <label>Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="City, Country or Remote"
                                    required
                                />
                            </div>

                            <div className="input-group full-width">
                                <label>Skills (Comma separated)</label>
                                <input
                                    type="text"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="React, Node.js, TypeScript..."
                                />
                            </div>

                            <div className="input-group full-width">
                                <label>Job Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Full job description and requirements..."
                                    required
                                />
                            </div>
                        </div>

                        <div className="footer-actions">
                            <button type="button" className="btn-cancel" onClick={handleClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-save" disabled={saving}>
                                {saving ? (
                                    'Saving Changes...'
                                ) : (
                                    <>
                                        <FiSave /> Update Job
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
});

export default EditJob;