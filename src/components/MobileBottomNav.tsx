import React from 'react';
import {
  LayoutDashboard,
  Map,
  Bell,
  Users,
  Settings
} from 'lucide-react';
import { useRailway } from '../context/RailwayContext';
import { useSettings } from '../context/SettingsContext';

export const MobileBottomNav: React.FC = () => {
  const { persona, setPersona, activeTab, setActiveTab, accidents, megaBlocks } = useRailway();
  const {
    notificationsDrawerOpen,
    setNotificationsDrawerOpen,
    settingsModalOpen,
    setSettingsModalOpen
  } = useSettings();

  const alertCount = accidents.filter(a => a.status !== 'resolved').length
    + megaBlocks.filter(b => b.status === 'active').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={22} />,
      isActive: persona === 'planner' && activeTab === 'dashboard',
      onClick: () => { setPersona('planner'); setActiveTab('dashboard'); }
    },
    {
      id: 'map',
      label: 'Track Map',
      icon: <Map size={22} />,
      isActive: persona === 'planner' && activeTab === 'map',
      onClick: () => { setPersona('planner'); setActiveTab('map'); }
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <Bell size={22} />,
      badge: alertCount > 0 ? alertCount : undefined,
      isActive: notificationsDrawerOpen,
      onClick: () => setNotificationsDrawerOpen(true)
    },
    {
      id: 'commuter',
      label: 'Commuter',
      icon: <Users size={22} />,
      isActive: persona === 'passenger',
      onClick: () => setPersona('passenger')
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={22} />,
      isActive: settingsModalOpen,
      onClick: () => setSettingsModalOpen(!settingsModalOpen)
    }
  ];

  return (
    <nav className="mobile-bottom-nav" role="navigation" aria-label="Main Navigation">
      <div className="mobile-bottom-nav-inner">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`mobile-nav-item ${item.isActive ? 'active' : ''}`}
            onClick={item.onClick}
            aria-label={item.label}
            aria-current={item.isActive ? 'page' : undefined}
          >
            <div className="nav-icon-wrap">
              {item.icon}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="mobile-nav-badge">{item.badge > 9 ? '9+' : item.badge}</span>
              )}
            </div>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
