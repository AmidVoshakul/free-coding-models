/**
 * @file web/src/hooks/useFilter.js
 * @description React hook for model filtering and tri-state sorting state.
 *
 * 📖 Manages tier/status/provider/text filters plus table sorting. Every visible
 * dashboard column can cycle through: ascending → descending → reset. Reset
 * returns the filtered list to catalog/rank order, which is the least surprising
 * neutral state after users have explored a sorted column.
 *
 * Supports all CLI/Web columns: mood, idx, tier, sweScore, ctx, label, origin,
 * latestPing, avg, condition, verdict, stability, uptime, aiLatency, tps, trend.
 *
 * @functions
 *   → useFilter(models) — filter + sort state for the dashboard table
 * @exports useFilter
 */
import { useState, useMemo, useCallback } from 'react'
import { tierRank, verdictRank, parseSwe } from '../utils/ranks.js'
import { formatCtx } from '../utils/format.js'

function rankOrder(model) {
  return model.idx ?? 9999
}

function pingHistory(model) {
  return model.pingHistory || model.pings || []
}

function latestPingMs(model) {
  const hist = pingHistory(model)
  const latest = hist.length > 0 ? hist[hist.length - 1] : null
  return latest?.ms ?? null
}

function trendDelta(model) {
  const points = pingHistory(model)
    .map((point) => point?.ms)
    .filter((ms) => typeof ms === 'number' && Number.isFinite(ms))
  if (points.length < 2) return null
  return points[points.length - 1] - points[0]
}

function numericOrNull(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function compareNullableNumber(aValue, bValue, direction) {
  const aMissing = aValue == null
  const bMissing = bValue == null
  if (aMissing && bMissing) return 0
  if (aMissing) return 1
  if (bMissing) return -1
  return (aValue - bValue) * direction
}

function compareNullableString(aValue, bValue, direction) {
  const aText = typeof aValue === 'string' ? aValue : ''
  const bText = typeof bValue === 'string' ? bValue : ''
  const aMissing = aText.length === 0
  const bMissing = bText.length === 0
  if (aMissing && bMissing) return 0
  if (aMissing) return 1
  if (bMissing) return -1
  return aText.localeCompare(bText) * direction
}

export function useFilter(models) {
  const [filterTier, setFilterTier] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterProvider, setFilterProvider] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortColumn, setSortColumn] = useState('avg')
  const [sortDirection, setSortDirection] = useState('asc')

  const toggleSort = useCallback((col) => {
    if (sortColumn !== col) {
      setSortColumn(col)
      setSortDirection('asc')
      return
    }

    if (sortDirection === 'asc') {
      setSortDirection('desc')
      return
    }

    // 📖 Third click resets the column: no active sort, catalog/rank order.
    setSortColumn(null)
    setSortDirection('asc')
  }, [sortColumn, sortDirection])

  const filtered = useMemo(() => {
    let result = [...models]

    if (filterTier !== 'all') result = result.filter((m) => m.tier === filterTier)
    if (filterStatus !== 'all') {
      result = result.filter((m) => {
        if (filterStatus === 'up') return m.status === 'up'
        if (filterStatus === 'down') return m.status === 'down' || m.status === 'timeout'
        if (filterStatus === 'pending') return m.status === 'pending'
        return true
      })
    }
    if (filterProvider !== 'all') result = result.filter((m) => m.providerKey === filterProvider)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (m) =>
          m.label.toLowerCase().includes(q) ||
          m.modelId.toLowerCase().includes(q) ||
          m.origin.toLowerCase().includes(q) ||
          m.tier.toLowerCase().includes(q) ||
          (m.verdict || '').toLowerCase().includes(q)
      )
    }

    result.sort((a, b) => {
      if (!sortColumn) return rankOrder(a) - rankOrder(b)

      const direction = sortDirection === 'desc' ? -1 : 1
      let cmp = 0

      if (sortColumn === 'mood') {
        cmp = compareNullableNumber(verdictRank(a.verdict), verdictRank(b.verdict), direction)
      } else if (sortColumn === 'idx') {
        cmp = compareNullableNumber(rankOrder(a), rankOrder(b), direction)
      } else if (sortColumn === 'tier') {
        cmp = compareNullableNumber(tierRank(a.tier), tierRank(b.tier), direction)
      } else if (sortColumn === 'label') {
        cmp = compareNullableString(a.label, b.label, direction)
      } else if (sortColumn === 'origin') {
        cmp = compareNullableString(a.origin, b.origin, direction)
      } else if (sortColumn === 'sweScore') {
        cmp = compareNullableNumber(parseSwe(a.sweScore), parseSwe(b.sweScore), direction)
      } else if (sortColumn === 'ctx') {
        cmp = compareNullableNumber(formatCtx(a.ctx), formatCtx(b.ctx), direction)
      } else if (sortColumn === 'latestPing') {
        cmp = compareNullableNumber(latestPingMs(a), latestPingMs(b), direction)
      } else if (sortColumn === 'avg') {
        const aAvg = a.avg == null || a.avg === Infinity || a.avg > 99000 ? null : a.avg
        const bAvg = b.avg == null || b.avg === Infinity || b.avg > 99000 ? null : b.avg
        cmp = compareNullableNumber(aAvg, bAvg, direction)
      } else if (sortColumn === 'condition') {
        const healthOrder = { up: 0, timeout: 1, down: 2, pending: 3, noauth: 4, auth_error: 5 }
        cmp = compareNullableNumber(healthOrder[a.status] ?? 9, healthOrder[b.status] ?? 9, direction)
      } else if (sortColumn === 'verdict') {
        cmp = compareNullableNumber(verdictRank(a.verdict), verdictRank(b.verdict), direction)
      } else if (sortColumn === 'stability') {
        cmp = compareNullableNumber(numericOrNull(a.stability), numericOrNull(b.stability), direction)
      } else if (sortColumn === 'uptime') {
        cmp = compareNullableNumber(numericOrNull(a.uptime), numericOrNull(b.uptime), direction)
      } else if (sortColumn === 'aiLatency') {
        cmp = compareNullableNumber(a.benchmark?.ok ? a.benchmark.totalMs : null, b.benchmark?.ok ? b.benchmark.totalMs : null, direction)
      } else if (sortColumn === 'tps') {
        cmp = compareNullableNumber(a.benchmark?.ok ? a.benchmark.tokensPerSecond ?? 0 : null, b.benchmark?.ok ? b.benchmark.tokensPerSecond ?? 0 : null, direction)
      } else if (sortColumn === 'trend') {
        // 📖 Negative delta means latency improved over the visible sparkline; positive means it got slower.
        cmp = compareNullableNumber(trendDelta(a), trendDelta(b), direction)
      }

      return cmp || (rankOrder(a) - rankOrder(b))
    })

    return result
  }, [models, filterTier, filterStatus, filterProvider, searchQuery, sortColumn, sortDirection])

  return {
    filtered,
    filterTier, setFilterTier,
    filterStatus, setFilterStatus,
    filterProvider, setFilterProvider,
    searchQuery, setSearchQuery,
    sortColumn, sortDirection, toggleSort,
  }
}
