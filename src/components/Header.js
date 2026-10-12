import React from 'react';

function Header({ currentPage, setCurrentPage, leadCount, followUpCount }) {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'space_dashboard' },
        { id: 'map', label: 'Prospectar', icon: 'travel_explore' },
        { id: 'leads', label: 'Leads', icon: 'groups' }
    ];

    return (
        <header className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-mark">
                    <span className="radar-dot" />
                    <span className="material-icons">shield</span>
                </div>
                <div className="brand-text">
                    <h1>Prospect SF</h1>
                    <span className="brand-sub">{leadCount} leads na base</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`nav-btn ${currentPage === item.id ? 'active' : ''}`}
                        onClick={() => setCurrentPage(item.id)}
                    >
                        <span className="material-icons">{item.icon}</span>
                        {item.label}
                        {item.id === 'leads' && followUpCount > 0 && (
                            <span className="header-followup-badge">{followUpCount}</span>
                        )}
                    </button>
                ))}
            </nav>
        </header>
    );
}

export default Header;
