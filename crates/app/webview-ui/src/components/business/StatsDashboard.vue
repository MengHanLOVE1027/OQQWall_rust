<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  NCard,
  NGrid,
  NGridItem,
  NNumberAnimation,
  NProgress,
  NSpin,
  NStatistic,
  NTag,
  useMessage,
} from 'naive-ui'
import { api } from '../../api/client'
import { STAGE_LABELS, type StatsResponse } from '../../api/types'

const message = useMessage()
const loading = ref(false)
const stats = ref<StatsResponse | null>(null)

const stageEntries = computed(() => {
  if (!stats.value) return []
  return Object.entries(stats.value.stage_breakdown)
    .map(([stage, count]) => ({
      stage,
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
    const total = item.submitted + item.approved + item.rejected
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

function maxBarHeight(value: number) {
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
    {
      label: '今日投稿',
      value: stats.value.today_count,
      hint: '自然日内新增入库稿件',
    },
    {
      label: '待审核',
      value: stats.value.pending_count,
      hint: '仍需人工确认的稿件',
    },
    {
      label: '累计总数',
      value: stats.value.total_count,
      hint: '当前状态视图中的总稿件数',
    },
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

onMounted(() => {
  loadStats()
})
</script>

<template>
  <div class="stats-container">
    <section class="stats-hero">
      <div>
        <span class="hero-kicker">数据统计</span>
        <h1>查看当前稿件总量、待审数量和阶段分布。</h1>
        <p>用于快速了解审核积压和整体处理进度。</p>
      </div>
      <div class="hero-side">
        <n-tag v-if="leadStage" round :bordered="false" type="warning">
          占比最高：{{ STAGE_LABELS[leadStage.stage] ?? leadStage.stage }} {{ leadStage.percentage }}%
        </n-tag>
        <button class="refresh-btn" @click="loadStats">刷新数据</button>
      </div>
    </section>

    <div v-if="loading && !stats" class="loading-wrap">
      <n-spin size="large" />
    </div>

    <div v-else-if="stats" class="dashboard">
      <n-grid x-gap="14" y-gap="14" cols="1 s:2 m:3" responsive="screen">
        <n-grid-item v-for="metric in cardMetrics" :key="metric.label">
          <n-card class="stat-card" :bordered="false">
            <span class="stat-label">{{ metric.label }}</span>
            <n-statistic>
              <n-number-animation :from="0" :to="metric.value" />
            </n-statistic>
            <p>{{ metric.hint }}</p>
          </n-card>
        </n-grid-item>
      </n-grid>

      <section class="distribution-panel">
        <div class="panel-head">
          <div>
            <span class="panel-kicker">阶段结构</span>
            <h2>各阶段分布</h2>
          </div>
          <span class="panel-note">总稿件 {{ stats.total_count }} 条</span>
        </div>

        <div class="progress-list">
          <div v-for="entry in stageEntries" :key="entry.stage" class="progress-item">
            <div class="label-block">
              <strong>{{ STAGE_LABELS[entry.stage] ?? entry.stage }}</strong>
              <span>{{ entry.count }} 条</span>
            </div>
            <div class="bar">
              <n-progress
                type="line"
                :percentage="entry.percentage"
                :height="18"
                :color="entry.stage === 'review_pending' ? '#f59e0b' : '#3b82f6'"
              >
                {{ entry.percentage }}%
              </n-progress>
            </div>
          </div>
        </div>
      </section>

      <!-- Daily Trend Chart -->
      <section v-if="stats.daily_trend && stats.daily_trend.length > 0" class="distribution-panel">
        <div class="panel-head">
          <div>
            <span class="panel-kicker">投稿趋势</span>
            <h2>近7天投稿趋势</h2>
          </div>
          <span class="panel-note">提交 · 通过 · 拒绝</span>
        </div>
        <div class="trend-chart">
          <div class="trend-bars">
            <div v-for="item in stats.daily_trend" :key="item.date" class="trend-bar-group">
              <div class="trend-bar-label">{{ item.date.slice(5) }}</div>
              <div class="trend-bar-stack">
                <div
                  class="trend-bar submitted"
                  :style="{ height: maxBarHeight(item.submitted) + 'px' }"
                  :title="'提交: ' + item.submitted"
                ></div>
                <div
                  class="trend-bar approved"
                  :style="{ height: maxBarHeight(item.approved) + 'px' }"
                  :title="'通过: ' + item.approved"
                ></div>
                <div
                  class="trend-bar rejected"
                  :style="{ height: maxBarHeight(item.rejected) + 'px' }"
                  :title="'拒绝: ' + item.rejected"
                ></div>
              </div>
              <div class="trend-bar-value">{{ item.submitted }}</div>
            </div>
          </div>
          <div class="trend-legend">
            <span class="legend-dot submitted"></span> 提交
            <span class="legend-dot approved"></span> 通过
            <span class="legend-dot rejected"></span> 拒绝
          </div>
        </div>
      </section>

      <!-- Hourly Distribution -->
      <section v-if="stats.hourly_distribution && stats.hourly_distribution.length > 0" class="distribution-panel">
        <div class="panel-head">
          <div>
            <span class="panel-kicker">时段分布</span>
            <h2>24小时提交分布</h2>
          </div>
        </div>
        <div class="hourly-grid">
          <div v-for="item in stats.hourly_distribution" :key="item.hour" class="hourly-cell" :class="{ peak: item.count >= hourlyMaxCount * 0.7 }">
            <div class="hourly-bar" :style="{ height: hourlyBarHeight(item.count) + 'px' }"></div>
            <span class="hourly-label">{{ String(item.hour).padStart(2, '0') }}</span>
            <span class="hourly-count">{{ item.count }}</span>
          </div>
        </div>
      </section>

      <!-- Review Efficiency -->
      <section v-if="stats.avg_review_time_ms" class="distribution-panel">
        <div class="panel-head">
          <div>
            <span class="panel-kicker">审核效率</span>
            <h2>平均审核时长</h2>
          </div>
        </div>
        <div class="efficiency-card">
          <div class="efficiency-value">
            {{ formatDuration(stats.avg_review_time_ms) }}
          </div>
          <span class="efficiency-hint">从投稿提交到审核完成的平均耗时</span>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.stats-container {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.stats-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 24px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid var(--app-border-strong);
  box-shadow: var(--app-shadow-soft);
}

.hero-kicker,
.panel-kicker {
  display: inline-block;
  margin-bottom: 10px;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(30, 41, 59, 0.46);
}

.stats-hero h1 {
  margin: 0;
  max-width: 16ch;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(28px, 3.4vw, 42px);
  line-height: 1.1;
  color: #1e293b;
}

.stats-hero p {
  max-width: 38rem;
  margin: 14px 0 0;
  color: rgba(30, 41, 59, 0.62);
  line-height: 1.7;
}

.hero-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.refresh-btn {
  border: 1px solid rgba(148, 163, 184, 0.12);
  background: rgba(255, 255, 255, 0.88);
  color: #1e293b;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
}

.loading-wrap {
  padding: 50px;
  display: flex;
  justify-content: center;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid var(--app-border-strong);
}

.dashboard {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.stat-card {
  height: 100%;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: var(--app-shadow-soft);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 34px rgba(15, 23, 42, 0.14);
}

.stat-label {
  display: block;
  margin-bottom: 10px;
  color: rgba(30, 41, 59, 0.62);
  font-size: 12px;
  letter-spacing: 0.08em;
}

.stat-card p {
  margin: 10px 0 0;
  color: rgba(30, 41, 59, 0.58);
  line-height: 1.7;
  font-size: 13px;
}

.distribution-panel {
  padding: 24px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid var(--app-border-strong);
  box-shadow: var(--app-shadow-soft);
}

.panel-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.panel-head h2 {
  margin: 0;
  font-size: 28px;
  color: #1e293b;
}

.panel-note {
  color: rgba(30, 41, 59, 0.58);
  font-size: 13px;
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.progress-item {
  display: grid;
  grid-template-columns: 170px 1fr;
  align-items: center;
  gap: 14px;
}

.label-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label-block strong {
  color: #1e293b;
}

.label-block span {
  font-size: 12px;
  color: rgba(30, 41, 59, 0.58);
}

.trend-chart {
  padding: 8px 0;
}

.trend-bars {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  height: 180px;
  padding: 8px 0 4px;
}

.trend-bar-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.trend-bar-label {
  font-size: 11px;
  color: rgba(30, 41, 59, 0.54);
}

.trend-bar-stack {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  width: 100%;
  max-width: 48px;
  height: 130px;
  border-radius: 6px 6px 0 0;
  overflow: hidden;
  background: rgba(30, 41, 59, 0.04);
}

.trend-bar {
  width: 100%;
  min-height: 2px;
  transition: height 0.3s ease;
}

.trend-bar.submitted {
  background: linear-gradient(0deg, rgba(59, 130, 246, 0.5), rgba(59, 130, 246, 0.2));
}

.trend-bar.approved {
  background: linear-gradient(0deg, rgba(99, 102, 241, 0.6), rgba(99, 102, 241, 0.3));
}

.trend-bar.rejected {
  background: linear-gradient(0deg, rgba(245, 158, 11, 0.5), rgba(245, 158, 11, 0.2));
}

.trend-bar-value {
  font-size: 12px;
  color: #1e293b;
  font-weight: 600;
}

.trend-legend {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  font-size: 12px;
  color: rgba(30, 41, 59, 0.62);
}

.legend-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.legend-dot.submitted {
  background: rgba(59, 130, 246, 0.6);
}

.legend-dot.approved {
  background: rgba(99, 102, 241, 0.7);
}

.legend-dot.rejected {
  background: rgba(245, 158, 11, 0.6);
}

.hourly-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 6px;
  padding: 8px 0;
}

.hourly-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 4px 2px;
  border-radius: 10px;
  background: rgba(30, 41, 59, 0.03);
  transition: background 0.2s ease;
}

.hourly-cell.peak {
  background: rgba(245, 158, 11, 0.1);
}

.hourly-bar {
  width: 100%;
  max-width: 28px;
  min-height: 2px;
  border-radius: 4px 4px 0 0;
  background: linear-gradient(0deg, #3b82f6, rgba(59, 130, 246, 0.4));
  transition: height 0.3s ease;
}

.hourly-label {
  font-size: 10px;
  color: rgba(30, 41, 59, 0.5);
}

.hourly-count {
  font-size: 11px;
  font-weight: 600;
  color: #1e293b;
}

.efficiency-card {
  padding: 20px 0;
  text-align: center;
}

.efficiency-value {
  font-size: 36px;
  font-weight: 700;
  color: #3b82f6;
  font-family: Georgia, "Times New Roman", serif;
  margin-bottom: 8px;
}

.efficiency-hint {
  color: rgba(30, 41, 59, 0.54);
  font-size: 13px;
}

@media (max-width: 760px) {
  .stats-hero,
  .panel-head,
  .hero-side {
    flex-direction: column;
    align-items: flex-start;
  }

  .progress-item {
    grid-template-columns: 1fr;
  }

  .trend-bars {
    gap: 8px;
  }

  .hourly-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
