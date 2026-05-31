/**
 * @file web/src/components/atoms/TPSCell.jsx
 * @description Benchmark tokens-per-second column — matches CLI TPS column.
 * 📖 Shows: 13, 45, —. Retry badge ↻N in blue.
 */
import styles from './TPSCell.module.css'

const BENCHMARK_FRAMES = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏']

function formatTps(result, isRunning, frame) {
  if (isRunning) return { text: BENCHMARK_FRAMES[frame % BENCHMARK_FRAMES.length], badge: '' }
  if (!result || !result.ok) return { text: '—', badge: '' }
  const badge = result.retries > 0 ? `↻${result.retries}` : ''
  return { text: String(Math.round(result.tokensPerSecond ?? 0)), badge }
}

export default function TPSCell({ result, isRunning, frame = 0 }) {
  const { text, badge } = formatTps(result, isRunning, frame)
  const ok = result?.ok
  const colorCls = ok ? styles.fast : (result ? styles.slow : styles.dim)
  return (
    <span className={styles.cell}>
      <span className={`${styles.value} ${colorCls}`}>{text}</span>
      {badge && <span className={styles.badge}>{badge}</span>}
    </span>
  )
}