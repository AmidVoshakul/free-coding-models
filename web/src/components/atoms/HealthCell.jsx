/**
 * @file web/src/components/atoms/HealthCell.jsx
 * @description Detailed health/status column — matches CLI Health column.
 * 📖 Shows: ✅ UP, 🔑 NO KEY, 🔐 AUTH FAIL, ⏳ wait, ⏳ TIMEOUT, 
 * 🔥 429 TRY LATER, 🚫 404, 💥 500, 🔌 502, 🔒 503, ⏰ 504, ❌ ERROR.
 */
import styles from './HealthCell.module.css'

const ERROR_LABELS = {
  '404': '404 NOT FOUND',
  '410': '410 GONE',
  '429': '429 TRY LATER',
  '500': '500 ERROR',
  '502': '502 ERROR',
  '503': '503 ERROR',
  '504': '504 TIMEOUT',
}

const STATUS_EMOJI = {
  up:          '✅',
  timeout:     '⏳',
  down:        '❌',
  pending:     '⏳',
  noauth:      '🔑',
  auth_error:  '🔐',
}

function statusLabel(status, httpCode) {
  const emoji = STATUS_EMOJI[status] || '?'
  if (status === 'noauth') return `${emoji} NO KEY`
  if (status === 'auth_error') return `${emoji} AUTH FAIL`
  if (status === 'pending') return `${emoji} wait`
  if (status === 'timeout') return `${emoji} TIMEOUT`
  if (status === 'down') {
    const label = ERROR_LABELS[httpCode] || (httpCode || 'ERR')
    const errEmoji = { '429': '🔥', '404': '🚫', '500': '💥', '502': '🔌', '503': '🔒', '504': '⏰' }[httpCode] || '❌'
    return `${errEmoji} ${label}`
  }
  if (status === 'up') return `${emoji} UP`
  return `${emoji} ?`
}

export default function HealthCell({ status, httpCode }) {
  const text = statusLabel(status, httpCode)
  const cls = status === 'up' ? styles.up
    : status === 'down' ? styles.error
    : status === 'timeout' ? styles.warning
    : status === 'noauth' ? styles.dim
    : status === 'auth_error' ? styles.errorBold
    : status === 'pending' ? styles.warning
    : styles.dim
  return <span className={`${styles.cell} ${cls}`}>{text}</span>
}