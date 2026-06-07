<script setup lang="ts">
import { onMounted } from 'vue'
import {
  NCard,
  NGrid,
  NGridItem,
  NNumberAnimation,
  NProgress,
  NSpin,
  NStatistic,
  NTag,
} from 'naive-ui'
import { useStats } from '../../composables/useStats'

const stats = useStats()

onMounted(() => {
  stats.loadStats()
})
</script>

<template>
  <div class="stats-container">
    <!-- Hero -->
    <section class="stats-hero">
      <div>
        <span class="hero-kicker">数据报表</span>
        <h1>查看投稿趋势、时段分布和审核效率。</h1>
        <p>用于了解整体运营状态和团队处理效率。</p>
      </div>
      <div class="hero-side">
        <n-tag v-if="stats.leadStage.value" round :bordered="false" type="warning">
          占比最高：{{ stats.leadStage.value.label }} {{ stats.leadStage.value.percentage }}%
        </n-tag>
        <button class="refresh-btn" @click="stats.loadStats()">刷新数据</button>
      </div>
    </section>

    <!-- Loading -->
    <div v-if="stats.loading.value && !stats.stats.value" class="loading-wrap">
      <n-spin size="large" />
    </div>

    <!-- Dashboard -->
    <div v-else-if="stats.stats.value" class="dashboard">
      <!-- Metric cards -->
      <n-grid x-gap="14" y-gap="14" cols="1 s:2 m:3" responsive="screen">
        <n-grid-item v-for="metric in stats.cardMetrics.value" :key="metric.label">
          <n-card class="stat-card" :bordered="false">
            <span class="stat-label">{{ metric.label }}</span>
            <n-statistic>
              <n-number-animation :from="0" :to="metric.value" />
            </n-statistic>
            <p>{{ metric.hint }}</p>
          </n-card>
        </n-grid-item>
      </n-grid>

      <!-- Stage breakdown -->
      <section class="distribution-panel">
        <div class="panel-head">
          <div>
            <span class="panel-kicker">阶段结构</span>
            <h2>各阶段分布</h2>
          </div>
          <span class="panel-note">总稿件 {{ stats.stats.value.total_count }} 条</span>
        </div>

        <div class="progress-list">
          <div v-for="entry in stats.stageEntries.value" :key="entry.stage" class="progress-item">
            <div class="label-block">
              <strong>{{ entry.label }}</strong>
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

      <!-- Daily Trend -->
      <section v-if="stats.stats.value.daily_trend?.length" class="distribution-panel">
        <div class="panel-head">
          <div>
            <span class="panel-kicker">投稿趋势</span>
            <h2>近7天投稿趋势</h2>
          </div>
          <span class="panel-note">提交 · 通过 · 拒绝 · 删除</span>
        </div>
        <div class="trend-chart">
          <div class="trend-bars">
            <div v-for="item in stats.stats.value.daily_trend" :key="item.date" class="trend-bar-group">
              <div class="trend-bar-label">{{ item.date.slice(5) }}</div>
              <div class="trend-bar-stack">
                <div
                  class="trend-bar submitted"
                  :style="{ height: stats.trendBarHeight(item.submitted) + 'px' }"
                  :title="'提交: ' + item.submitted"
                ></div>
                <div
                  class="trend-bar approved"
                  :style="{ height: stats.trendBarHeight(item.approved) + 'px' }"
                  :title="'通过: ' + item.approved"
                ></div>
                <div
                  class="trend-bar rejected"
                  :style="{ height: stats.trendBarHeight(item.rejected) + 'px' }"
                  :title="'拒绝: ' + item.rejected"
                ></div>
                <div
                  class="trend-bar deleted"
                  :style="{ height: stats.trendBarHeight(item.deleted) + 'px' }"
                  :title="'删除: ' + item.deleted"
                ></div>
              </div>
              <div class="trend-bar-value">{{ item.submitted }}</div>
            </div>
          </div>
          <div class="trend-legend">
            <span class="legend-dot submitted"></span> 提交
            <span class="legend-dot approved"></span> 通过
            <span class="legend-dot rejected"></span> 拒绝
            <span class="legend-dot deleted"></span> 删除
          </div>
        </div>
      </section>

      <!-- Hourly Distribution -->
      <section v-if="stats.stats.value.hourly_distribution?.length" class="distribution-panel">
        <div class="panel-head">
          <div>
            <span class="panel-kicker">时段分布</span>
            <h2>24小时提交分布</h2>
          </div>
        </div>
        <div class="hourly-grid">
          <div
            v-for="item in stats.stats.value.hourly_distribution"
            :key="item.hour"
            class="hourly-cell"
            :class="{ peak: item.count >= stats.hourlyMaxCount.value * 0.7 }"
          >
            <div class="hourly-bar" :style="{ height: stats.hourlyBarHeight(item.count) + 'px' }"></div>
            <span class="hourly-label">{{ String(item.hour).padStart(2, '0') }}</span>
            <span class="hourly-count">{{ item.count }}</span>
          </div>
        </div>
      </section>

      <!-- Review Efficiency -->
      <section v-if="stats.stats.value.avg_review_time_ms" class="distribution-panel">
        <div class="panel-head">
          <div>
            <span class="panel-kicker">审核效率</span>
            <h2>平均审核时长</h2>
          </div>
        </div>
        <div class="efficiency-card">
          <div class="efficiency-value">
            {{ stats.formatDuration(stats.stats.value.avg_review_time_ms) }}
          </div>
          <span class="efficiency-hint">从投稿提交到审核完成的平均耗时</span>
        </div>
      </section>

      <!-- No data fallback -->
      <section v-if="!stats.stats.value.daily_trend?.length && !stats.stats.value.hourly_distribution?.length" class="distribution-panel">
        <p style="color: rgba(30,41,59,0.54); text-align: center; padding: 24px 0;">
          暂无趋势数据。当有更多稿件时，这里将展示投稿趋势、时段分布和审核效率。
        </p>
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

.trend-bar.deleted {
  background: linear-gradient(0deg, rgba(239, 68, 68, 0.5), rgba(239, 68, 68, 0.2));
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

.legend-dot.submitted { background: rgba(59, 130, 246, 0.6); }
.legend-dot.approved { background: rgba(99, 102, 241, 0.7); }
.legend-dot.rejected { background: rgba(245, 158, 11, 0.6); }
.legend-dot.deleted { background: rgba(239, 68, 68, 0.6); }

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
