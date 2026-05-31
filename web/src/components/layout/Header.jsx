/**
 * @file web/src/components/layout/Header.jsx
 * @description Top header bar with search, export button, settings shortcut, and theme toggle.
 */
import { IconBolt, IconSearch, IconDownload, IconSettings, IconMoon, IconSun } from '@tabler/icons-react'
import styles from './Header.module.css'

export default function Header({ searchQuery, onSearchChange, onToggleTheme, onOpenSettings, onOpenExport, theme }) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>&gt;</span>
          <span className={styles.logoText}>
            <span className={styles.logoTextHighlight}>free</span>
            <span>-coding-models</span>
            <span className={styles.logoTextHighlight}>_</span>
          </span>
        </div>
        <span className={styles.version}>v{__APP_VERSION__}</span>
      </div>
      <div className={styles.center}>
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}><IconSearch size={16} stroke={1.5} /></span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search models, providers, tiers..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            autoComplete="off"
          />
          <kbd className={styles.kbd}>Ctrl+K</kbd>
        </div>
      </div>
      <div className={styles.right}>
        <button className={styles.iconBtn} onClick={onToggleTheme} title="Toggle theme">
          {theme === 'light' ? <IconMoon size={16} stroke={1.5} /> : <IconSun size={16} stroke={1.5} />}
        </button>
        <button className={styles.iconBtn} onClick={onOpenExport} title="Export Data">
          <IconDownload size={16} stroke={1.5} />
        </button>
        <button className={styles.primaryBtn} onClick={onOpenSettings}>
          <IconSettings size={16} stroke={1.5} /> Settings
        </button>
      </div>
    </header>
  )
}

