/**
 * @file web/src/components/layout/Sidebar.jsx
 * @description Collapsible sidebar navigation with Dashboard / Settings / Analytics links + theme toggle.
 */
import { IconBolt, IconLayoutDashboard, IconSettings, IconActivity, IconGlobe, IconMoon, IconSun } from '@tabler/icons-react'
import styles from './Sidebar.module.css'

export default function Sidebar({ currentView, onNavigate, onToggleTheme, theme }) {
  const navItems = [
    { id: 'dashboard', icon: <IconLayoutDashboard size={20} stroke={1.5} />, label: 'Dashboard' },
    { id: 'settings', icon: <IconSettings size={20} stroke={1.5} />, label: 'Settings' },
    { id: 'analytics', icon: <IconActivity size={20} stroke={1.5} />, label: 'Analytics' },
    { id: 'map', icon: <IconGlobe size={20} stroke={1.5} />, label: 'Map' },
  ]

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>&gt;</span>
        <span className={styles.logoText}>
          <span className={styles.logoTextHighlight}>F</span>
          <span>CM</span>
          <span className={styles.logoTextHighlight}>_</span>
        </span>
      </div>
      <nav className={styles.nav}>
        {navItems.map(({ id, icon, label }) => (
          <button
            key={id}
            className={`${styles.navItem} ${currentView === id ? styles.active : ''}`}
            onClick={() => onNavigate(id)}
            title={label}
          >
            <span className={styles.navIcon}>{icon}</span>
            <span className={styles.navLabel}>{label}</span>
          </button>
        ))}
      </nav>
      <div className={styles.bottom}>
        <button className={styles.navItem} onClick={onToggleTheme} title="Toggle Theme">
          <span className={styles.navIcon}>
            {theme === 'light' ? <IconMoon size={20} stroke={1.5} /> : <IconSun size={20} stroke={1.5} />}
          </span>
          <span className={styles.navLabel}>Theme</span>
        </button>
      </div>
    </aside>
  )
}

