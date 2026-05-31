/**
 * @file web/src/components/dashboard/ModelTable.jsx
 * @description Main data table with ALL CLI columns — verdict indicator, rank, last ping, health, AI latency, TPS + clickable headers for sorting.
 * 📖 Full CLI column parity: ❔(mood) | Rank | Tier | SWE% | Ctx | Model | Provider | Last Ping | Avg | Health | Verdict | Stability | Up% | AI Latency | TPS | Trend
 */
import { useMemo } from 'react'
import MoodCell from '../atoms/MoodCell.jsx'
import RankCell from '../atoms/RankCell.jsx'
import TierBadge from '../atoms/TierBadge.jsx'
import StatusDot from '../atoms/StatusDot.jsx'
import LastPingCell from '../atoms/LastPingCell.jsx'
import HealthCell from '../atoms/HealthCell.jsx'
import StabilityCell from '../atoms/StabilityCell.jsx'
import Sparkline from '../atoms/Sparkline.jsx'
import AILatencyCell from '../atoms/AILatencyCell.jsx'
import TPSCell from '../atoms/TPSCell.jsx'
import VerdictBadge from '../atoms/VerdictBadge.jsx'
import { pingClass } from '../../utils/format.js'
import { sweClass } from '../../utils/ranks.js'
import styles from './ModelTable.module.css'

// 📖 CLI column order for sort (matches key-handler COLUMN_SORT_MAP)
export const SORT_COLUMNS = [
  { key: 'verdict',    label: '❔',  title: 'Verdict (❔)' },
  { key: 'idx',        label: '#',   title: 'Rank (#)' },
  { key: 'tier',       label: 'Tier', title: 'Tier' },
  { key: 'sweScore',   label: 'SWE %', title: 'SWE %' },
  { key: 'ctx',        label: 'CTX', title: 'Context Window' },
  { key: 'label',      label: 'Model', title: 'Model' },
  { key: 'origin',     label: 'Provider', title: 'Provider' },
  { key: 'latestPing', label: 'Last Ping', title: 'Last Ping' },
  { key: 'avg',        label: 'Avg Ping', title: 'Average Ping' },
  { key: 'condition',  label: 'Health', title: 'Health' },
  { key: 'verdict',    label: 'Verdict', title: 'Verdict' },
  { key: 'stability',  label: 'Stability', title: 'Stability' },
  { key: 'uptime',     label: 'Up%', title: 'Uptime %' },
  { key: 'aiLatency',  label: 'AI Lat.', title: 'AI Latency' },
  { key: 'tps',        label: 'TPS', title: 'Tokens/sec' },
]

export default function ModelTable({ filtered, onSelectModel, sortColumn, sortDirection, onSort }) {
  const top3Arr = useMemo(() => {
    const online = filtered.filter(m => m.status === 'up' && m.avg !== Infinity && m.avg < 99999)
    return new Set([...online].sort((a, b) => a.avg - b.avg).slice(0, 3).map(m => m.modelId))
  }, [filtered])

  const handleHeaderClick = (col) => {
    onSort(col)
  }

  const SortIcon = ({ col }) => {
    if (sortColumn !== col) return <span className={styles.sortIcon}>⇅</span>
    return <span className={styles.sortIconActive}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
  }

  if (filtered.length === 0) {
    return <div className={styles.empty}>No models match your filters</div>
  }

  return (
    <div className={styles.container}>
      <table className={styles.table} style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th className={styles.th} onClick={() => handleHeaderClick('verdict')} title="Verdict">
              ❔ <SortIcon col="verdict" />
            </th>
            <th className={styles.th} onClick={() => handleHeaderClick('idx')} title="Rank">
              # <SortIcon col="idx" />
            </th>
            <th className={styles.th} onClick={() => handleHeaderClick('tier')} title="Tier">
              Tier <SortIcon col="tier" />
            </th>
            <th className={styles.th} onClick={() => handleHeaderClick('sweScore')} title="SWE %">
              SWE% <SortIcon col="sweScore" />
            </th>
            <th className={styles.th} onClick={() => handleHeaderClick('ctx')} title="Context Window">
              CTX <SortIcon col="ctx" />
            </th>
            <th className={`${styles.th} ${styles.thModel}`} onClick={() => handleHeaderClick('label')} title="Model">
              Model <SortIcon col="label" />
            </th>
            <th className={styles.th} onClick={() => handleHeaderClick('origin')} title="Provider">
              Provider <SortIcon col="origin" />
            </th>
            <th className={styles.th} onClick={() => handleHeaderClick('latestPing')} title="Last Ping">
              Last Ping <SortIcon col="latestPing" />
            </th>
            <th className={styles.th} onClick={() => handleHeaderClick('avg')} title="Average Ping">
              Avg <SortIcon col="avg" />
            </th>
            <th className={styles.th} onClick={() => handleHeaderClick('condition')} title="Health">
              Health <SortIcon col="condition" />
            </th>
            <th className={styles.th} onClick={() => handleHeaderClick('verdict')} title="Verdict">
              Verdict <SortIcon col="verdict" />
            </th>
            <th className={styles.th} onClick={() => handleHeaderClick('stability')} title="Stability">
              Stability <SortIcon col="stability" />
            </th>
            <th className={styles.th} onClick={() => handleHeaderClick('uptime')} title="Uptime">
              Up% <SortIcon col="uptime" />
            </th>
            <th className={styles.th} onClick={() => handleHeaderClick('aiLatency')} title="AI Latency">
              AI Lat. <SortIcon col="aiLatency" />
            </th>
            <th className={styles.th} onClick={() => handleHeaderClick('tps')} title="Tokens per second">
              TPS <SortIcon col="tps" />
            </th>
            <th className={styles.th} title="Trend">Trend</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((m, i) => {
            const rankIdx = [...top3Arr].indexOf(m.modelId)
            const rowCls = rankIdx >= 0 ? styles[`rank${rankIdx + 1}`] : ''

            // 📖 Benchmark data — in real app this would come from SSE state
            // 📖 Using the model's benchmark field if present, null otherwise
            const benchmarkResult = m.benchmark || null
            const isBenchmarkRunning = false
            const benchmarkFrame = 0

            // 📖 Latest ping from ping history
            const pingHist = m.pingHistory || m.pings || []
            const latestPing = pingHist.length > 0 ? pingHist[pingHist.length - 1] : null

            return (
              <tr key={m.modelId} className={rowCls} onClick={() => onSelectModel(m)}>
                <td className={styles.tdMood}><MoodCell verdict={m.verdict} /></td>
                <td className={styles.tdRank}><RankCell index={m.idx || i + 1} /></td>
                <td><TierBadge tier={m.tier} /></td>
                <td className={`${styles.swe} ${styles[sweClass(m.sweScore)]}`}>{m.sweScore || '—'}</td>
                <td className={styles.ctx}>{m.ctx || '—'}</td>
                <td className={styles.tdModel}>
                  <div className={styles.modelCell}>
                    <StatusDot status={m.status} />
                    <div className={styles.modelMeta}>
                      <div className={styles.modelHeader}>
                        <span className={styles.modelName}>{m.label}</span>
                        {!m.hasApiKey && !m.cliOnly && <span className={styles.noKey}>NO KEY</span>}
                      </div>
                      <div className={styles.modelId}>{m.modelId}</div>
                    </div>
                  </div>
                </td>
                <td><span className={styles.providerPill}>{m.origin}</span></td>
                <td className={styles.tdPing}>
                  <LastPingCell
                    ms={latestPing?.ms ?? null}
                    isPinging={m.isPinging || false}
                  />
                </td>
                <td className={`${styles.ping} ${styles[pingClass(m.avg)]}`}>
                  {m.avg == null || m.avg === Infinity || m.avg > 99000 ? '—' : `${m.avg}ms`}
                </td>
                <td className={styles.tdHealth}>
                  <HealthCell status={m.status} httpCode={m.httpCode} />
                </td>
                <td><VerdictBadge verdict={m.verdict} httpCode={m.httpCode} /></td>
                <td><StabilityCell score={m.stability} /></td>
                <td className={styles.uptime}>{m.uptime > 0 ? `${m.uptime}%` : '—'}</td>
                <td className={styles.tdAi}>
                  <AILatencyCell result={benchmarkResult} isRunning={isBenchmarkRunning} frame={benchmarkFrame} />
                </td>
                <td className={styles.tdTps}>
                  <TPSCell result={benchmarkResult} isRunning={isBenchmarkRunning} frame={benchmarkFrame} />
                </td>
                <td><Sparkline history={m.pingHistory} /></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}