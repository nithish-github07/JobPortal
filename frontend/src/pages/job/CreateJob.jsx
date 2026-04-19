import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { FiImage, FiUser, FiChevronDown, FiCalendar } from 'react-icons/fi';
import {jobAPI} from '../../api/services';

export default function CreateJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    company: '', 
    jobType: '',
    salary: '',
    experience: '',
    location: '',
    skills: '',
    description: '',
  }); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      salary: Number(formData.salary) ? Number(formData.salary) : undefined,
      experience: Number(formData.experience) ? Number(formData.experience) : undefined,
      skills: skillsArray,
    };

    if (!["full-time", "part-time", "internship", "remote", "hybrid"].includes(submissionData.jobType)) {
        submissionData.jobType = "full-time";
    }

    try {
      await jobAPI.create(submissionData);
      navigate('/dashboard'); 
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error saving job details');
    } finally {
      setLoading(false);
    }
  };

  const styles = `
    .create-job-container {
        min-height: 100vh;
        background-color: #FFFFFF;
        font-family: 'Inter', sans-serif;
        padding: 40px 20px;
        display: flex;
        justify-content: center;
    }

    .form-wrapper {
        max-width: 850px;
        width: 100%;
    }

    .page-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #15284A;
        margin: 0 0 32px 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .header-image-box {
        width: 50%;
        max-width: 400px;
        height: 64px;
        background-color: #F9FAFB;
        border-radius: 8px;
        display: flex;
        align-items: center;
        padding: 0 20px;
        margin-bottom: 40px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .header-image-box:hover {
        background-color: #F2F4F7;
    }

    .header-image-box span {
        color: #D0D5DD;
        font-size: 0.875rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .header-image-box .img-icon {
        font-size: 1.25rem;
    }

    .error-message {
        color: #D92D20;
        background-color: #FEECEB;
        border: 1px solid #FECDCA;
        border-radius: 8px;
        padding: 10px;
        text-align: center;
        font-size: 0.875rem;
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

    .input-group {
        display: flex;
        flex-direction: column;
    }

    .input-group label {
        display: block;
        font-size: 0.875rem;
        font-weight: 600;
        color: #344054;
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
        padding: 10px 14px;
        font-size: 1rem;
        color: #101828;
        border: 1px solid #D0D5DD;
        border-radius: 8px;
        box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
        box-sizing: border-box;
        font-family: 'Inter', sans-serif;
        background-color: #FFFFFF;
        transition: border-color 0.2s, box-shadow 0.2s;
    }

    .input-group textarea {
        resize: vertical;
        min-height: 120px;
    }

    .input-group input::placeholder, 
    .input-group select::placeholder, 
    .input-group textarea::placeholder {
        color: #D0D5DD;
    }

    .input-group input:focus, 
    .input-group select:focus, 
    .input-group textarea:focus {
        outline: none;
        border-color: #1570EF;
        box-shadow: 0 0 0 4px rgba(21, 112, 239, 0.1);
    }

    .input-icon {
        position: absolute;
        right: 14px;
        color: #D0D5DD;
        pointer-events: none;
        font-size: 1.125rem;
    }

    .input-group select {
        appearance: none;
        padding-right: 40px;
        cursor: pointer;
    }
    
    /* specifically padding inputs with icons */
    .has-icon {
        padding-right: 40px !important;
    }

    .submit-section {
        margin-top: 16px;
        padding-bottom: 40px;
    }

    .btn-submit {
        background-color: #1570EF;
        color: white;
        padding: 10px 24px;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        border: none;
        cursor: pointer;
        box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
        transition: background-color 0.2s;
        display: inline-block;
    }

    .btn-submit:hover {
        background-color: #125BCE;
    }

    .btn-submit:disabled {
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
        .header-image-box {
            width: 100%;
            max-width: 100%;
        }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="create-job-container">
        <div className="form-wrapper">
          <h1 className="page-title">JOB DETAILS</h1>

          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-grid">
              {/* Row 1 */}
              <div className="input-group full-width">
                <label>Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter Title"
                  required
                />
              </div>

              {/* Row 2 */}
              <div className="input-group">
                <label>Company</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Company"
                    className="has-icon"
                    required
                  />
                  <FiChevronDown className="input-icon" />
                </div>
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

              {/* Row 4 */}
              <div className="input-group">
                <label>Expected Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Enter Amount in Rs."
                  min={0}
                  required
                />
              </div>

              <div className="input-group">
                <label>Experience in Years</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Enter Experience"
                  min = {0}
                  required
                />
              </div>

              {/* Row 5 */}
              <div className="input-group">
                <label>Location</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter Location"
                    className="has-icon"
                    required
                  />
                  <FiChevronDown className="input-icon" />
                </div>
              </div>

              {/* Row 6 */}
              <div className="input-group full-width">
                <label>Skill Sets</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Add Skills"
                />
              </div>

              {/* Row 7 */}
              <div className="input-group full-width">
                <label>Job Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  required
                />
              </div>

              {/* Submit */}
              <div className="submit-section full-width">
                <button type="submit" disabled={loading} className="btn-submit">
                  {loading ? 'Submitting...' : 'Save & Publish Job'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}