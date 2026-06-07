import { computed, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { api } from '../api/client'
import { STAGE_LABELS, type StatsResponse } from '../api/types'

export function useStats() {
  const message = useMessage()
  const loading = ref(false)
  const stats = ref<StatsResponse | null>(null)

  const stageEntries = computed(() => {
    if (!stats.value) return []
    return Object.entries(stats.value.stage_breakdown)
      .filter(([, count]) => count > 0)
      .map(([stage, count]) => ({
        stage,
        label: STAGE_LABELS[stage] ?? stage,
        count,
        percentage: stats.value && stats.value.total_count > 0
          ? Number(((count / stats.value.total_count) * 100).toFixed(1))
          : 0,
      }))
      .sort((a, b) => b.count - a.count)
  })

  const leadStage = computed(() => stageEntries.value[0] ?? null)

  const trendMaxValue = computed(() => {
    if (!stats.value?.daily_trend) return 1
    let max = 1
    for (const item of stats.value.daily_trend) {
      const total = item.submitted + item.approved + item.rejected + item.deleted
      if (total > max) max = total
    }
    return max
  })

  const hourlyMaxCount = computed(() => {
    if (!stats.value?.hourly_distribution) return 1
    let max = 1
    for (const item of stats.value.hourly_distribution) {
      if (item.count > max) max = item.count
    }
    return max
  })

  function trendBarHeight(value: number) {
    const maxH = 120
    return Math.max(2, Math.round((value / trendMaxValue.value) * maxH))
  }

  function hourlyBarHeight(value: number) {
    const maxH = 80
    return Math.max(2, Math.round((value / hourlyMaxCount.value) * maxH))
  }

  function formatDuration(ms: number) {
    if (ms < 60000) return Math.round(ms / 1000) + ' 秒'
    if (ms < 3600000) return (ms / 60000).toFixed(1) + ' 分钟'
    return (ms / 3600000).toFixed(2) + ' 小时'
  }

  const cardMetrics = computed(() => {
    if (!stats.value) return []
    return [
      { label: '今日投稿', value: stats.value.today_count, tone: 'default' as const, hint: '自然日内新增入库稿件' },
      { label: '待审核', value: stats.value.pending_count, tone: 'warning' as const, hint: '仍需人工确认的稿件' },
      { label: '累计总数', value: stats.value.total_count, tone: 'default' as const, hint: '当前状态视图中的总稿件数' },
    ]
  })

  async function loadStats() {
    loading.value = true
    try {
      stats.value = await api<StatsResponse>('/api/stats')
    } catch (e) {
      message.error((e as Error).message)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    stats,
    stageEntries,
    leadStage,
    trendMaxValue,
    hourlyMaxCount,
    trendBarHeight,
    hourlyBarHeight,
    formatDuration,
    cardMetrics,
    loadStats,
  }
}
