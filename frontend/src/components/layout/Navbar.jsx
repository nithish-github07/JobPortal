import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    FiGrid, FiBriefcase, FiFileText, FiBookmark, FiLogOut, FiUser, FiPlusSquare 
} from 'react-icons/fi';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    
    const hideOn = ["/login", "/register"];
    if (!user || hideOn.includes(location.pathname)) {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const menuItems = [
        {
            title: "Main",
            items: [
                { path: "/dashboard", icon: <FiGrid />, name: "Dashboard", roles: ["jobSeeker", "recruiter"] },
                { path: "/jobs", icon: <FiBriefcase />, name: "Browse Jobs", roles: ["jobSeeker", "recruiter"] },
            ]
        },
        {
            title: "Manage",
            role: "jobSeeker",
            items: [
                { path: "/my-applications", icon: <FiFileText />, name: "My Applications", roles: ["jobSeeker"] },
                { path: "/saved-jobs", icon: <FiBookmark />, name: "Saved Jobs", roles: ["jobSeeker"] },
            ]
        },
        {
            title: "Manage",
            role: "recruiter",
            items: [
                { path: "/jobs/create", icon: <FiPlusSquare />, name: "Post Job", roles: ["recruiter"] },
            ]
        },
    ];

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        .sidebar {
            width: 260px;
            min-height: 100vh;
            background-color: #FFFFFF;
            border-right: 1px solid #EAECF0;
            display: flex;
            flex-direction: column;
            padding: 24px 16px;
            font-family: 'Inter', sans-serif;
            color: #344054;
            box-sizing: border-box;
        }

        .sidebar-user {
            display: flex;
            align-items: center;
            padding: 8px;
            margin-bottom: 24px;
            border-radius: 8px;
        }

        .user-info {
            display: flex;
            flex-direction: column;
        }

        .user-profile-avatar {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            border: 4px solid #ffffff;
            margin-left: -6px;
            margin-bottom: 15px;
            margin-top: -15px;
            object-fit: cover;
            background-color: #f3f4f6;
            border: 3px solid #000000ff;
        }

        .user-name {
            font-size: 1.1rem;
            font-weight: 600;
            color: #101828;
        }

        .user-role {
            font-size: 0.875rem;
            color: #667085;
            text-transform: capitalize;
        }

        .sidebar-nav {
            flex-grow: 1;
        }

        .nav-section {
            margin-bottom: 24px;
        }

        .nav-title {
            font-size: 0.75rem;
            font-weight: 600;
            color: #667085;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 0 12px;
            margin-bottom: 8px;
        }

        .nav-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 12px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 1rem;
            font-weight: 500;
            color: #344054;
            transition: background-color 0.2s;
            margin-bottom: 4px;
        }

        .nav-link:hover {
            background-color: #F9FAFB;
        }

        .nav-link.active {
            background-color: #F0F6FE;
            color: #1570EF;
            font-weight: 600;
        }

        .nav-link svg {
            width: 20px;
            height: 20px;
        }

        .sidebar-footer {
            margin-top: auto;
            border-top: 1px solid #EAECF0;
            padding-top: 16px;
        }

        .logout-btn {
            width: 100%;
            background: none;
            border: none;
            cursor: pointer;
            font-family: 'Inter', sans-serif;
            color: #FF0000;
        }
    `;

    return (
        <>
            <style>{styles}</style>
            <aside className="sidebar">
                <div className="sidebar-user">
                    <div className="user-info">
                         <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=2563eb&color=fff&size=128`} alt="Avatar" className="user-profile-avatar" />
                        <span className="user-name">{user.name}</span>
                        <span className="user-role">{user.role}</span>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    {menuItems.map((section, index) => (
                        (section.role === user.role || !section.role) && (
                            <div className="nav-section" key={index}>
                                <h3 className="nav-title">{section.title}</h3>
                                {section.items.map(item => (
                                    item.roles.includes(user.role) && (
                                        <Link 
                                            to={item.path} 
                                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`} 
                                            key={item.path}
                                        >
                                            {item.icon}
                                            <span>{item.name}</span>
                                        </Link>
                                    )
                                ))}
                            </div>
                        )
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
                        <FiUser />
                        <span>Profile</span>
                    </Link>
                    <button onClick={handleLogout} className="nav-link logout-btn">
                        <FiLogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;