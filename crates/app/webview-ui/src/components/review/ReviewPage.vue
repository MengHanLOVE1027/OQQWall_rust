<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import {
  NCard,
  NEmpty,
  NModal,
  NSpin,
  NTag,
  useMessage,
  NInput,
  NAlert,
  NButton,
} from 'naive-ui'
import { api } from '../../api/client'
import { ACTION_LABELS, type PostItem } from '../../api/types'
import { useReview } from '../../composables/useReview'
import FilterBar from './FilterBar.vue'
import BatchBar from './BatchBar.vue'
import PaginationBar from './PaginationBar.vue'
import PostCard from './PostCard.vue'
import DetailDrawer from './DetailDrawer.vue'

const review = useReview()
const message = useMessage()

const groupFilter = ref('all')
const sortMode = ref('newest')
const autoRefresh = ref(true)
const onlyError = ref(false)
const onlyActionable = ref(false)
const lastUpdatedAt = ref<number | null>(null)

const batchAction = ref('approve')
const batchLoading = ref(false)

const confirmState = reactive({
  show: false,
  reviewId: '',
  action: 'approve',
  postLabel: '',
  groupId: '',
  senderId: '',
  comment: '',
})

let refreshTimer: number | null = null

function formatTime(ms: number) {
  return new Date(ms).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formattedUpdatedAt = computed(() => {
  if (!lastUpdatedAt.value) return '尚未刷新'
  return formatTime(lastUpdatedAt.value)
})

const groupOptions = computed(() => {
  const groups = [...new Set(review.posts.value.map((post) => post.group_id))].sort()
  return [
    { label: '全部分组', value: 'all' },
    ...groups.map((group) => ({ label: group, value: group })),
  ]
})

const visiblePosts = computed(() => {
  let items = [...review.posts.value]
  if (groupFilter.value !== 'all') {
    items = items.filter((post) => post.group_id === groupFilter.value)
  }
  if (onlyError.value) {
    items = items.filter((post) => !!post.last_error)
  }
  if (onlyActionable.value) {
    items = items.filter((post) => !!post.review_id)
  }
  switch (sortMode.value) {
    case 'oldest':
      items.sort((a, b) => a.created_at_ms - b.created_at_ms)
      break
    case 'code':
      items.sort((a, b) => (b.internal_code ?? 0) - (a.internal_code ?? 0))
      break
    default:
      items.sort((a, b) => b.created_at_ms - a.created_at_ms)
  }
  return items
})

const visibleSelectableReviewIds = computed(
  () => visiblePosts.value.map((item) => item.review_id).filter(Boolean) as string[],
)

const visibleAllSelected = computed(() => {
  if (review.selectAllMode.value) return true
  if (visibleSelectableReviewIds.value.length === 0) return false
  return visibleSelectableReviewIds.value.every((id) => review.selectedReviewIds.value.includes(id))
})

const effectiveSelectedCount = computed(() => {
  if (review.selectAllMode.value) return review.selectAllTotal.value
  return review.selectedReviewIds.value.length
})

const summaryCards = computed(() => {
  const posts = visiblePosts.value
  const errorCount = posts.filter((post) => !!post.last_error).length
  const actionableCount = posts.filter((post) => !!post.review_id).length
  const imageCount = posts.filter((post) => !!post.preview_image_url).length
  return [
    { label: '当前列表', value: posts.length, tone: 'default' as const, hint: '筛选后的稿件数量' },
    { label: '可操作稿件', value: actionableCount, tone: 'success' as const, hint: '当前可直接处理' },
    { label: '异常稿件', value: errorCount, tone: 'error' as const, hint: '带最近错误信息' },
    { label: '含图稿件', value: imageCount, tone: 'warning' as const, hint: '含渲染图或图片附件' },
  ]
})

const detailIndex = computed(() => {
  const currentPostId = review.detail.value?.post_id
  if (!currentPostId) return -1
  return visiblePosts.value.findIndex((post) => post.post_id === currentPostId)
})

function resetAutoRefresh() {
  if (refreshTimer !== null) {
    window.clearInterval(refreshTimer)
    refreshTimer = null
  }
  if (autoRefresh.value) {
    refreshTimer = window.setInterval(() => { loadAll() }, 30000)
  }
}

watch(autoRefresh, resetAutoRefresh)

async function loadAll() {
  await review.loadPosts()
  lastUpdatedAt.value = Date.now()
}

function handleToggleSelectAll() {
  review.toggleSelectAll()
}

async function handleSelectAllAcrossPages() {
  await review.selectAllAcrossPages()
}

function handleResetFilters() {
  review.stage.value = 'review_pending'
  review.keyword.value = ''
  groupFilter.value = 'all'
  sortMode.value = 'newest'
  onlyError.value = false
  onlyActionable.value = false
  review.page.value = 0
  review.search()
}

function requestQuickAction(post: PostItem, action: string) {
  if (!post.review_id) {
    message.warning('当前稿件不可操作')
    return
  }
  confirmState.show = true
  confirmState.reviewId = post.review_id
  confirmState.action = action
  confirmState.postLabel = `#${post.internal_code ?? post.external_code ?? '-'}`
  confirmState.groupId = post.group_id
  confirmState.senderId = post.sender_id ?? '未知投稿人'
  confirmState.comment = ''
}

async function confirmQuickAction() {
  const payload: Record<string, unknown> = { action: confirmState.action }
  if (confirmState.action === 'reject' && confirmState.comment.trim()) {
    payload.comment = confirmState.comment.trim()
  }
  if (confirmState.action === 'blacklist') {
    if (!confirmState.comment.trim()) {
      message.warning('请填写拉黑原因')
      return
    }
    payload.comment = confirmState.comment.trim()
  }

  review.actionLoading.value = true
  try {
    await api(`/api/reviews/${confirmState.reviewId}/decision`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    message.success(`执行成功: ${ACTION_LABELS[confirmState.action]}`)
    confirmState.show = false
    await loadAll()
    await review.refreshDetail()
  } catch (e) {
    message.error((e as Error).message)
  } finally {
    review.actionLoading.value = false
  }
}

async function handleBatchAction() {
  const ids = review.selectAllMode.value
    ? review.selectedReviewIds.value
    : review.selectedReviewIds.value
  if (ids.length === 0) return
  batchLoading.value = true
  try {
    await api('/api/reviews/batch', {
      method: 'POST',
      body: JSON.stringify({
        review_ids: ids,
        action: batchAction.value,
      }),
    })
    message.success('批量操作完成')
    review.clearSelection()
    await loadAll()
    await review.refreshDetail()
  } catch (e) {
    message.error((e as Error).message)
  } finally {
    batchLoading.value = false
  }
}

async function handleDrawerRefresh() {
  await loadAll()
  await review.refreshDetail()
}

async function openAdjacentDetail(offset: number) {
  const nextIndex = detailIndex.value + offset
  if (nextIndex < 0 || nextIndex >= visiblePosts.value.length) return
  await review.openDetail(visiblePosts.value[nextIndex].post_id)
}

onMounted(async () => {
  await loadAll()
  resetAutoRefresh()
})

onBeforeUnmount(() => {
  if (refreshTimer !== null) window.clearInterval(refreshTimer)
})
</script>

<template>
  <div class="workspace-container">
    <!-- Hero panel -->
    <section class="hero-panel">
      <div class="hero-copy">
        <span class="hero-kicker">稿件审核</span>
        <h1>按状态查看稿件并执行审核操作。</h1>
        <p>支持分组筛选、搜索、批量处理和详情页操作。</p>
      </div>
      <div class="hero-metrics">
        <div v-for="card in summaryCards" :key="card.label" class="metric-card" :data-tone="card.tone">
          <span>{{ card.label }}</span>
          <strong>{{ card.value }}</strong>
          <small>{{ card.hint }}</small>
        </div>
      </div>
    </section>

    <!-- Filter toolbar -->
    <n-card :bordered="false" class="toolbar-card">
      <FilterBar
        :stage="review.stage.value"
        :groupFilter="groupFilter"
        :sortMode="sortMode"
        :keyword="review.keyword.value"
        :onlyError="onlyError"
        :onlyActionable="onlyActionable"
        :autoRefresh="autoRefresh"
        :groupOptions="groupOptions"
        @update:stage="review.stage.value = $event; loadAll()"
        @update:groupFilter="groupFilter = $event"
        @update:sortMode="sortMode = $event"
        @update:keyword="review.keyword.value = $event"
        @update:onlyError="onlyError = $event"
        @update:onlyActionable="onlyActionable = $event"
        @update:autoRefresh="autoRefresh = $event"
        @search="review.search()"
        @refresh="loadAll()"
        @reset="handleResetFilters()"
        @toggleSelectAll="handleToggleSelectAll()"
      />

      <div class="toolbar-tags">
        <n-tag :bordered="false" type="info" round>{{ visiblePosts.length }} 条结果</n-tag>
        <n-tag :bordered="false" type="warning" round v-if="review.pendingCount.value > 0">
          待审 {{ review.pendingCount.value }}
        </n-tag>
        <n-tag :bordered="false" type="success" round v-if="effectiveSelectedCount > 0">
          已选 {{ effectiveSelectedCount }}
        </n-tag>
        <n-tag :bordered="false" round>上次刷新 {{ formattedUpdatedAt }}</n-tag>
      </div>

      <!-- Select all banner -->
      <div v-if="!review.selectAllMode.value && visibleSelectableReviewIds.length > 0" class="select-all-hint">
        <span>已选择 {{ review.selectedReviewIds.value.length }} 条当前页稿件。</span>
        <n-button size="tiny" type="primary" ghost @click="handleSelectAllAcrossPages">
          选择全部匹配稿件
        </n-button>
      </div>
      <div v-if="review.selectAllMode.value" class="select-all-active">
        <span>已选择 <b>全部 {{ review.selectAllTotal.value }}</b> 条匹配稿件。</span>
        <n-button size="tiny" @click="review.clearSelection()">取消全选</n-button>
      </div>

      <BatchBar
        :selectedCount="effectiveSelectedCount"
        :batchAction="batchAction"
        :loading="batchLoading"
        @update:batchAction="batchAction = $event"
        @execute="handleBatchAction()"
      />
    </n-card>

    <!-- List content -->
    <div class="list-content">
      <PaginationBar
        v-if="review.totalCount.value > 0"
        :page="review.page.value"
        :totalPages="review.totalPages.value"
        :totalCount="review.totalCount.value"
        :pageSize="review.pageSize.value"
        @update:pageSize="review.goToPage(0)"
        @prev="review.prevPage()"
        @next="review.nextPage()"
        style="margin-bottom: 14px;"
      />

      <div v-if="review.loading.value && review.posts.value.length === 0" class="center-msg">
        <n-spin size="large" />
      </div>
      <n-empty v-else-if="visiblePosts.length === 0" description="没有符合条件的稿件" class="center-msg" />

      <div v-else class="grid-container">
        <PostCard
          v-for="post in visiblePosts"
          :key="post.post_id"
          :post="post"
          :selected="review.selectAllMode.value || (!!post.review_id && review.selectedReviewIds.value.includes(post.review_id))"
          @click="review.openDetail(post.post_id)"
          @select="(reviewId: string, checked: boolean) => review.toggleOneSelection(reviewId, checked)"
          @quickAction="requestQuickAction(post, $event)"
        />
      </div>

      <PaginationBar
        v-if="review.totalCount.value > 0 && visiblePosts.length > 5"
        :page="review.page.value"
        :totalPages="review.totalPages.value"
        :totalCount="review.totalCount.value"
        :pageSize="review.pageSize.value"
        @update:pageSize="review.goToPage(0)"
        @prev="review.prevPage()"
        @next="review.nextPage()"
        style="margin-top: 14px;"
      />
    </div>

    <!-- Detail drawer -->
    <DetailDrawer
      v-model:show="review.detailOpen.value"
      :detail="review.detail.value"
      :loading="review.detailLoading.value"
      :hasPrev="detailIndex > 0"
      :hasNext="detailIndex >= 0 && detailIndex < visiblePosts.length - 1"
      @refresh="handleDrawerRefresh()"
      @prev="openAdjacentDetail(-1)"
      @next="openAdjacentDetail(1)"
    />

    <!-- Quick action confirm modal -->
    <n-modal v-model:show="confirmState.show" preset="card" class="confirm-modal" :mask-closable="false">
      <div class="confirm-head">
        <span class="confirm-kicker">确认操作</span>
        <h3>{{ ACTION_LABELS[confirmState.action] }} {{ confirmState.postLabel }}</h3>
      </div>
      <p class="confirm-meta">分组：{{ confirmState.groupId }} · 投稿人：{{ confirmState.senderId }}</p>
      <n-input
        v-if="confirmState.action === 'reject'"
        v-model:value="confirmState.comment"
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 5 }"
        placeholder="可填写拒绝说明"
        style="margin-bottom: 14px"
      />
      <n-input
        v-if="confirmState.action === 'blacklist'"
        v-model:value="confirmState.comment"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
        placeholder="请填写拉黑原因"
        style="margin-bottom: 14px"
      />
      <n-alert type="warning" :bordered="false">操作确认后会立即提交到后端处理。</n-alert>
      <div class="confirm-actions">
        <n-button @click="confirmState.show = false">取消</n-button>
        <n-button type="primary" :loading="review.actionLoading.value" @click="confirmQuickAction">确认执行</n-button>
      </div>
    </n-modal>
  </div>
</template>

<style scoped>
.workspace-container {
  display: flex;
  flex-direction: column;
  gap: 18px;
  height: 100%;
}

.hero-panel {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(300px, 400px);
  gap: 18px;
  align-items: stretch;
}

.hero-copy,
.hero-metrics {
  border-radius: 26px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid var(--app-border-strong);
  box-shadow: var(--app-shadow-soft);
}

.hero-kicker {
  display: inline-block;
  margin-bottom: 12px;
  color: rgba(30, 41, 59, 0.46);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 11px;
}

.hero-copy h1 {
  margin: 0;
  max-width: 12ch;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(28px, 3.2vw, 40px);
  line-height: 1.12;
  color: #1e293b;
}

.hero-copy p {
  max-width: 42rem;
  margin: 14px 0 0;
  color: rgba(30, 41, 59, 0.64);
  line-height: 1.72;
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  align-content: start;
}

.metric-card {
  padding: 16px 18px;
  border-radius: 20px;
  background: rgba(241, 245, 249, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.08);
  min-height: 126px;
}

.metric-card span,
.metric-card small {
  display: block;
}

.metric-card span {
  color: rgba(30, 41, 59, 0.58);
  font-size: 12px;
}

.metric-card strong {
  display: block;
  margin: 12px 0 8px;
  font-size: 30px;
  line-height: 1;
  color: #1e293b;
}

.metric-card small {
  color: rgba(30, 41, 59, 0.54);
  line-height: 1.6;
}

.metric-card[data-tone="success"] {
  box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.14);
}

.metric-card[data-tone="error"] {
  box-shadow: inset 0 0 0 1px rgba(239, 68, 68, 0.14);
}

.metric-card[data-tone="warning"] {
  box-shadow: inset 0 0 0 1px rgba(245, 158, 11, 0.14);
}

.toolbar-card {
  flex-shrink: 0;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: var(--app-shadow);
}

.toolbar-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.select-all-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
  padding: 10px 16px;
  border-radius: 14px;
  background: rgba(59, 130, 246, 0.06);
  border: 1px solid rgba(59, 130, 246, 0.1);
  font-size: 13px;
  color: rgba(30, 41, 59, 0.7);
}

.select-all-active {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
  padding: 10px 16px;
  border-radius: 14px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  font-size: 13px;
  color: #1e293b;
}

.list-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.center-msg {
  padding: 60px;
  display: flex;
  justify-content: center;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid var(--app-border-strong);
}

.confirm-modal {
  max-width: 520px;
}

.confirm-head h3 {
  margin: 8px 0 6px;
  color: #1e293b;
}

.confirm-kicker {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(30, 41, 59, 0.46);
}

.confirm-meta {
  margin: 0 0 14px;
  color: rgba(30, 41, 59, 0.62);
  line-height: 1.7;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

@media (max-width: 1180px) {
  .hero-panel {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .hero-copy,
  .hero-metrics,
  .toolbar-card {
    border-radius: 22px;
  }

  .hero-copy {
    padding: 20px;
  }

  .hero-copy h1 {
    max-width: none;
  }

  .hero-metrics {
    padding: 18px;
    grid-template-columns: 1fr 1fr;
  }

  .grid-container {
    grid-template-columns: 1fr;
  }

  .select-all-hint,
  .select-all-active {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
