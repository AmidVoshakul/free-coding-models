/**
 * @file web/src/components/atoms/LastPingCell.jsx
 * @description Last ping latency in ms with color coding — matches CLI Last Ping column.
 * 📖 Color: <500ms green, <1500ms yellow, ≥1500ms red, null/dash dim.
 */
import styles from './LastPingCell.module.css'

function pingClass(ms) {
  if (ms == null || ms === Infinity) return styles.none
  if (ms < 500) return styles.fast
  if (ms < 1500) return styles.medium
  return styles.slow
}

export default function LastPingCell({ ms, isPinging }) {
  if (ms == null) return <span className={`${styles.cell} ${styles.none}`}>—</span>

  let display = `${ms}ms`
  if (isPinging) display += ' ⠴'  // braille spinner

  return <span className={`${styles.cell} ${pingClass(ms)}`}>{display}</span>
}