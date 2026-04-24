import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    FiGrid, FiBriefcase, FiFileText, FiBookmark, FiLogOut, FiUser, FiPlusSquare 
} from 'react-icons/fi';
import logo from '../../assets/applyo-logo.png';

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
                { path: "/my-applications", icon: <FiFileText />, name: "Job Applications", roles: ["jobSeeker"] },
                { path: "/saved-jobs", icon: <FiBookmark />, name: "Saved Jobs", roles: ["jobSeeker"] },
            ]
        },
        {
            title: "Management",
            role: "recruiter",
            items: [
                { path: "/jobs/create", icon: <FiPlusSquare />, name: "Post Job", roles: ["recruiter"] },
            ]
        },
        {
            title: "Account",
            items: [
                { path: "/profile", icon: <FiUser />, name: "Profile", roles: ["jobSeeker", "recruiter"] },
                { 
                    type: "button", 
                    onClick: handleLogout, 
                    icon: <FiLogOut />, 
                    name: "Logout", 
                    roles: ["jobSeeker", "recruiter"],
                    className: "logout-btn-nav"
                },
            ]
        }
    ];

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

        .sidebar {
            width: 280px;
            min-height: 100vh;
            background-color: #FFFFFF;
            border-right: 1px solid #EAECF0;
            display: flex;
            flex-direction: column;
            padding: 32px 20px;
            font-family: 'Inter', sans-serif;
            color: #344054;
            box-sizing: border-box;
            position: sticky;
            top: 0;
            height: 100vh;
        }

        .sidebar-header {
            margin-bottom: 40px;
            padding: 0 8px;
        }

        .sidebar-logo {
            height: 50px;
            width: auto;
            object-fit: contain;
        }

        .sidebar-user {
            display: flex;
            align-items: center;
            padding: 16px;
            background: #F9FAFB;
            border-radius: 16px;
            margin-bottom: 32px;
            gap: 12px;
        }

        .user-profile-avatar {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            object-fit: cover;
            border: 2px solid #FFFFFF;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .user-info {
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .user-name {
            font-size: 0.95rem;
            font-weight: 600;
            color: #101828;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .user-role {
            font-size: 0.8rem;
            color: #667085;
            text-transform: capitalize;
        }

        .sidebar-nav {
            flex-grow: 1;
        }

        .nav-section {
            margin-bottom: 28px;
        }

        .nav-title {
            font-size: 0.75rem;
            font-weight: 700;
            color: #98A2B3;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 0 12px;
            margin-bottom: 12px;
        }

        .nav-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 14px;
            border-radius: 10px;
            text-decoration: none;
            font-size: 0.9375rem;
            font-weight: 500;
            color: #475467;
            transition: all 0.2s;
            margin-bottom: 4px;
            border: 1px solid transparent;
        }

        .nav-link:hover {
            background-color: #F9FAFB;
            color: #101828;
        }

        .nav-link.active {
            background-color: #EFF6FF;
            color: #2563EB;
            font-weight: 600;
            border-color: #DBEAFE;
        }

        .nav-link svg {
            width: 20px;
            height: 20px;
            color: #667085;
            transition: color 0.2s;
        }

        .nav-link.active svg {
            color: #2563EB;
        }

        .logout-btn-nav {
            width: 100%;
            background: none;
            border: 1px solid transparent;
            cursor: pointer;
            font-family: inherit;
            text-align: left;
        }

        .logout-btn-nav:hover {
            background-color: #FFF1F0 !important;
            color: #D92D20 !important;
        }

        .logout-btn-nav:hover svg {
            color: #D92D20 !important;
        }

        /* Hide scrollbar */
        .sidebar-nav::-webkit-scrollbar {
            display: none;
        }
    `;

    return (
        <>
            <style>{styles}</style>
            <aside className="sidebar">
                <div className="sidebar-header">
                    <img src={logo} alt="Applyo Logo" className="sidebar-logo" />
                </div>

                <div className="sidebar-user">
                    <img 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=2563eb&color=fff&size=128`} 
                        alt="Avatar" 
                        className="user-profile-avatar" 
                    />
                    <div className="user-info">
                        <span className="user-name">{user.name}</span>
                        <span className="user-role">{user.role}</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((section, index) => (
                        (section.role === user.role || !section.role) && (
                            <div className="nav-section" key={index}>
                                <h3 className="nav-title">{section.title}</h3>
                                {section.items.map((item, idx) => (
                                    item.roles.includes(user.role) && (
                                        item.type === "button" ? (
                                            <button 
                                                key={idx}
                                                onClick={item.onClick} 
                                                className={`nav-link ${item.className || ''}`}
                                            >
                                                {item.icon}
                                                <span>{item.name}</span>
                                            </button>
                                        ) : (
                                            <Link 
                                                to={item.path} 
                                                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`} 
                                                key={item.path}
                                            >
                                                {item.icon}
                                                <span>{item.name}</span>
                                            </Link>
                                        )
                                    )
                                ))}
                            </div>
                        )
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;