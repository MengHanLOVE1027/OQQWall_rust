<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { NCard, NEmpty, NSpin, NTag } from 'naive-ui'
import { useReview } from '../../composables/useReview'
import { usePostActions } from '../../composables/usePostActions'
import FilterBar from './FilterBar.vue'
import BatchBar from './BatchBar.vue'
import PaginationBar from './PaginationBar.vue'
import PostCard from './PostCard.vue'
import DetailDrawer from './DetailDrawer.vue'

const review = useReview()
const actions = usePostActions()

const groupFilter = ref('all')
const sortMode = ref('newest')
const autoRefresh = ref(true)
const onlyError = ref(false)
const onlyActionable = ref(false)
const lastUpdatedAt = ref<number | null>(null)
const batchAction = ref('approve')

let refreshTimer: number | null = null

function formatTime(ms: number) {
  return new Date(ms).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const formattedUpdatedAt = computed(() => lastUpdatedAt.value ? formatTime(lastUpdatedAt.value) : '尚未刷新')

const groupOptions = computed(() => {
  const groups = [...new Set(review.posts.value.map(p => p.group_id))].sort()
  return [{ label: '全部分组', value: 'all' }, ...groups.map(g => ({ label: g, value: g }))]
})

const visiblePosts = computed(() => {
  let items = [...review.posts.value]
  if (groupFilter.value !== 'all') items = items.filter(p => p.group_id === groupFilter.value)
  if (onlyError.value) items = items.filter(p => !!p.last_error)
  if (onlyActionable.value) items = items.filter(p => !!p.review_id)
  if (sortMode.value === 'oldest') items.sort((a, b) => a.created_at_ms - b.created_at_ms)
  else if (sortMode.value === 'code') items.sort((a, b) => (b.internal_code ?? 0) - (a.internal_code ?? 0))
  else items.sort((a, b) => b.created_at_ms - a.created_at_ms)
  return items
})

const visibleSelectableIds = computed(() => visiblePosts.value.map(p => p.review_id).filter(Boolean) as string[])
const visibleAllSelected = computed(() =>
  review.selectAllMode.value || (visibleSelectableIds.value.length > 0 && visibleSelectableIds.value.every(id => review.selectedReviewIds.value.includes(id)))
)

const effectiveSelectedCount = computed(() =>
  review.selectAllMode.value ? review.selectAllTotal.value : review.selectedReviewIds.value.length
)

const summaryCards = computed(() => {
  const posts = visiblePosts.value
  return [
    { label: '当前列表', value: posts.length, tone: 'default' as const, hint: '筛选后的稿件数量' },
    { label: '可操作', value: posts.filter(p => !!p.review_id).length, tone: 'success' as const, hint: '可直接处理' },
    { label: '异常', value: posts.filter(p => !!p.last_error).length, tone: 'error' as const, hint: '带错误信息' },
    { label: '含图', value: posts.filter(p => !!p.preview_image_url).length, tone: 'warning' as const, hint: '含渲染图或附件' },
  ]
})

const detailIndex = computed(() => {
  if (!review.detail.value) return -1
  return visiblePosts.value.findIndex(p => p.post_id === review.detail.value!.post_id)
})

function resetAutoRefresh() {
  if (refreshTimer !== null) { window.clearInterval(refreshTimer); refreshTimer = null }
  if (autoRefresh.value) refreshTimer = window.setInterval(loadAll, 30000)
}
watch(autoRefresh, resetAutoRefresh)

async function loadAll() { await review.loadPosts(); lastUpdatedAt.value = Date.now() }

function toggleVisibleSelectAll() {
  if (visibleAllSelected.value) {
    review.selectedReviewIds.value = review.selectedReviewIds.value.filter(id => !visibleSelectableIds.value.includes(id))
  } else {
    review.selectedReviewIds.value = [...new Set([...review.selectedReviewIds.value, ...visibleSelectableIds.value])]
  }
}

function handleResetFilters() {
  review.stage.value = ''; review.keyword.value = ''
  groupFilter.value = 'all'; sortMode.value = 'newest'
  onlyError.value = false; onlyActionable.value = false
  review.page.value = 0; review.search()
}

// --- Card quick action (opens confirm modal) ---
function handleCardAction(post: PostItem, action: string) {
  if (!post.review_id) { message.warning('当前稿件不可操作'); return }
  actions.openConfirm(
    post.review_id, action,
    `#${post.internal_code ?? post.external_code ?? '-'}`,
    post.group_id,
    post.sender_id ?? '未知投稿人',
  )
}

// --- Confirm modal callback ---
async function onConfirmAction() {
  const ok = await actions.executeAction()
  if (ok) {
    await loadAll()
    await review.refreshDetail()
  }
}

// --- Batch action ---
async function handleBatchAction() {
  const ids = review.selectedReviewIds.value
  if (ids.length === 0) return
  const ok = await actions.batchAction(ids, batchAction.value)
  if (ok) {
    review.clearSelection()
    await loadAll()
    await review.refreshDetail()
  }
}

// --- Detail drawer ---
async function handleDrawerRefresh() { await loadAll(); await review.refreshDetail() }
async function openAdjacentDetail(offset: number) {
  const idx = detailIndex.value + offset
  if (idx >= 0 && idx < visiblePosts.value.length) await review.openDetail(visiblePosts.value[idx].post_id)
}

onMounted(async () => { await loadAll(); resetAutoRefresh() })
onBeforeUnmount(() => { if (refreshTimer !== null) window.clearInterval(refreshTimer) })
</script>

<template>
  <div class="workspace-container">
    <!-- Hero -->
    <section class="hero-panel">
      <div class="hero-copy">
        <span class="hero-kicker">稿件审核</span>
        <h1>查看稿件并执行审核操作。</h1>
        <p>分组筛选、搜索、批量处理和详情页操作。</p>
      </div>
      <div class="hero-metrics">
        <div v-for="card in summaryCards" :key="card.label" class="metric-card" :data-tone="card.tone">
          <span>{{ card.label }}</span><strong>{{ card.value }}</strong><small>{{ card.hint }}</small>
        </div>
      </div>
    </section>

    <!-- Toolbar -->
    <n-card :bordered="false" class="toolbar-card">
      <FilterBar
        :stage="review.stage.value" :groupFilter="groupFilter" :sortMode="sortMode"
        :keyword="review.keyword.value" :onlyError="onlyError" :onlyActionable="onlyActionable"
        :autoRefresh="autoRefresh" :groupOptions="groupOptions"
        @update:stage="(v: any) => { review.stage.value = v; loadAll() }"
        @update:groupFilter="(v: string) => groupFilter = v"
        @update:sortMode="(v: string) => sortMode = v"
        @update:keyword="(v: string) => review.keyword.value = v"
        @update:onlyError="(v: boolean) => onlyError = v"
        @update:onlyActionable="(v: boolean) => onlyActionable = v"
        @update:autoRefresh="(v: boolean) => autoRefresh = v"
        @search="review.search()" @refresh="loadAll()"
        @reset="handleResetFilters()" @toggleSelectAll="toggleVisibleSelectAll()"
      />
      <div class="toolbar-tags">
        <n-tag :bordered="false" type="info" round>{{ visiblePosts.length }} 条</n-tag>
        <n-tag v-if="review.pendingCount.value" :bordered="false" type="warning" round>待审 {{ review.pendingCount.value }}</n-tag>
        <n-tag v-if="effectiveSelectedCount" :bordered="false" type="success" round>已选 {{ effectiveSelectedCount }}</n-tag>
        <n-tag :bordered="false" round>刷新 {{ formattedUpdatedAt }}</n-tag>
      </div>

      <!-- Select-all -->
      <div v-if="!review.selectAllMode.value && visibleSelectableIds.length > 0" class="select-all-hint">
        <span>{{ review.selectedReviewIds.value.length ? `已选 ${review.selectedReviewIds.value.length} 条` : '快捷批量操作' }}</span>
        <div class="select-all-hint-actions">
          <n-button size="tiny" type="primary" ghost @click="review.selectAllAcrossPages()">选择当前筛选</n-button>
          <n-button size="tiny" type="primary" @click="review.selectAllPosts()">选择全部稿件</n-button>
        </div>
      </div>
      <div v-if="review.selectAllMode.value" class="select-all-active">
        <span>已选 <b>全部 {{ review.selectAllTotal.value }}</b> 条</span>
        <div class="select-all-hint-actions">
          <n-button size="tiny" type="primary" ghost @click="review.selectAllPosts()">不限筛选全选</n-button>
          <n-button size="tiny" @click="review.clearSelection()">取消</n-button>
        </div>
      </div>

      <BatchBar :selectedCount="effectiveSelectedCount" :batchAction="batchAction" :loading="actions.submitting.value"
        @update:batchAction="(v: string) => batchAction = v" @execute="handleBatchAction()" />
    </n-card>

    <!-- List -->
    <div class="list-content">
      <PaginationBar v-if="review.totalCount.value" :page="review.page.value" :totalPages="review.totalPages.value"
        :totalCount="review.totalCount.value" :pageSize="review.pageSize.value"
        @update:pageSize="review.goToPage(0)" @prev="review.prevPage()" @next="review.nextPage()"
        style="margin-bottom: 14px;" />

      <div v-if="review.loading.value && !review.posts.value.length" class="center-msg"><n-spin size="large" /></div>
      <n-empty v-else-if="!visiblePosts.length" description="没有符合条件的稿件" class="center-msg" />

      <div v-else class="grid-container">
        <PostCard v-for="post in visiblePosts" :key="post.post_id" :post="post"
          :selected="review.selectAllMode.value || (!!post.review_id && review.selectedReviewIds.value.includes(post.review_id))"
          @click="review.openDetail(post.post_id)"
          @select="(id: string, checked: boolean) => review.toggleOneSelection(id, checked)"
          @quickAction="handleCardAction(post, $event)" />
      </div>

      <PaginationBar v-if="review.totalCount.value && visiblePosts.length > 5" :page="review.page.value"
        :totalPages="review.totalPages.value" :totalCount="review.totalCount.value" :pageSize="review.pageSize.value"
        @update:pageSize="review.goToPage(0)" @prev="review.prevPage()" @next="review.nextPage()"
        style="margin-top: 14px;" />
    </div>

    <!-- Detail drawer -->
    <DetailDrawer v-model:show="review.detailOpen.value" :detail="review.detail.value" :loading="review.detailLoading.value"
      :hasPrev="detailIndex > 0" :hasNext="detailIndex >= 0 && detailIndex < visiblePosts.length - 1"
      @refresh="handleDrawerRefresh()" @prev="openAdjacentDetail(-1)" @next="openAdjacentDetail(1)" />
  </div>
</template>

<style scoped>
.workspace-container { display: flex; flex-direction: column; gap: 18px; height: 100%; }
.hero-panel { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(300px, 400px); gap: 18px; align-items: stretch; }
.hero-copy, .hero-metrics { border-radius: 26px; padding: 24px; background: rgba(255,255,255,0.88); border: 1px solid var(--app-border-strong); box-shadow: var(--app-shadow-soft); }
.hero-kicker { display: inline-block; margin-bottom: 12px; color: rgba(30,41,59,0.46); letter-spacing: 0.14em; text-transform: uppercase; font-size: 11px; }
.hero-copy h1 { margin: 0; font-family: Georgia,"Times New Roman",serif; font-size: clamp(28px,3.2vw,40px); line-height: 1.12; color: #1e293b; }
.hero-copy p { margin: 14px 0 0; color: rgba(30,41,59,0.64); line-height: 1.72; }
.hero-metrics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; align-content: start; }
.metric-card { padding: 16px 18px; border-radius: 20px; background: rgba(241,245,249,0.8); border: 1px solid rgba(148,163,184,0.08); min-height: 100px; }
.metric-card span, .metric-card small { display: block; }
.metric-card span { color: rgba(30,41,59,0.58); font-size: 12px; }
.metric-card strong { display: block; margin: 8px 0 4px; font-size: 28px; line-height: 1; color: #1e293b; }
.metric-card small { color: rgba(30,41,59,0.54); line-height: 1.6; font-size: 11px; }
.metric-card[data-tone="success"] { box-shadow: inset 0 0 0 1px rgba(59,130,246,0.14); }
.metric-card[data-tone="error"] { box-shadow: inset 0 0 0 1px rgba(239,68,68,0.14); }
.metric-card[data-tone="warning"] { box-shadow: inset 0 0 0 1px rgba(245,158,11,0.14); }
.toolbar-card { flex-shrink: 0; border-radius: 26px; background: rgba(255,255,255,0.94); box-shadow: var(--app-shadow); }
.toolbar-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.select-all-hint { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 12px; padding: 10px 16px; border-radius: 14px; background: rgba(59,130,246,0.06); border: 1px solid rgba(59,130,246,0.1); font-size: 13px; color: rgba(30,41,59,0.7); }
.select-all-active { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 12px; padding: 10px 16px; border-radius: 14px; background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); font-size: 13px; color: #1e293b; }
.select-all-hint-actions { display: flex; gap: 6px; flex-shrink: 0; }
.list-content { flex: 1; min-height: 0; overflow-y: auto; padding-right: 4px; }
.grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.center-msg { padding: 60px; display: flex; justify-content: center; border-radius: 24px; background: rgba(255,255,255,0.88); border: 1px solid var(--app-border-strong); }

@media (max-width: 1180px) { .hero-panel { grid-template-columns: 1fr; } }
@media (max-width: 760px) {
  .hero-copy, .hero-metrics, .toolbar-card { border-radius: 22px; }
  .hero-copy { padding: 20px; }
  .hero-copy h1 { max-width: none; }
  .hero-metrics { padding: 18px; grid-template-columns: 1fr 1fr; }
  .grid-container { grid-template-columns: 1fr; }
  .select-all-hint, .select-all-active { flex-direction: column; align-items: stretch; }
  .select-all-hint-actions { justify-content: flex-end; }
}
</style>
