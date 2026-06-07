import { computed, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { api } from '../api/client'
import { type PostDetail, type PostItem, type Stage } from '../api/types'

export function useReview() {
  const message = useMessage()
  const loading = ref(false)
  const detailLoading = ref(false)
  const actionLoading = ref(false)

  const stage = ref<Stage | '' | '__active__'>('__active__')
  const keyword = ref('')
  const posts = ref<PostItem[]>([])
  const page = ref(0)
  const pageSize = ref(50)
  const totalCount = ref(0)
  const sortBy = ref('created_at')
  const sortOrder = ref('desc')

  const selectedReviewIds = ref<string[]>([])
  // "Select all" mode: when true, ALL matching posts are selected (not just visible page)
  const selectAllMode = ref(false)
  const selectAllTotal = ref(0)

  const detail = ref<PostDetail | null>(null)
  const detailOpen = ref(false)
  const currentDetailId = ref<string | null>(null)

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalCount.value / pageSize.value)),
  )

  const pendingCount = computed(() =>
    posts.value.filter((item) => item.stage === 'review_pending').length,
  )

  const filteredPosts = computed(() => {
    return posts.value
  })

  const selectableReviewIds = computed(() =>
    filteredPosts.value.map((item) => item.review_id).filter(Boolean) as string[],
  )

  const allSelected = computed(() => {
    if (selectAllMode.value) return true
    if (selectableReviewIds.value.length === 0) return false
    return selectableReviewIds.value.every((id) => selectedReviewIds.value.includes(id))
  })

  function buildQueryParams(): URLSearchParams {
    const params = new URLSearchParams()
    if (stage.value && stage.value !== '__active__') {
      params.set('stage', stage.value)
    }
    params.set('limit', String(pageSize.value))
    params.set('cursor', String(page.value * pageSize.value))
    if (keyword.value.trim()) {
      params.set('keyword', keyword.value.trim())
    }
    params.set('sort_by', sortBy.value)
    params.set('sort_order', sortOrder.value)
    return params
  }

  async function loadPosts() {
    loading.value = true
    try {
      const result = await api<{ items: PostItem[]; next_cursor: number | null }>(
        '/api/posts?' + buildQueryParams().toString(),
      )
      posts.value = result.items
      if (result.next_cursor !== null && result.next_cursor !== undefined) {
        totalCount.value =
          result.items.length > 0
            ? (page.value + 2) * pageSize.value
            : page.value * pageSize.value
      } else {
        totalCount.value = page.value * pageSize.value + result.items.length
      }
      // Keep selections that still exist in the loaded page
      const reviewSet = new Set(
        result.items.map((item) => item.review_id).filter(Boolean) as string[],
      )
      selectedReviewIds.value = selectedReviewIds.value.filter((id) => reviewSet.has(id))
      selectAllMode.value = false
      selectAllTotal.value = 0
    } catch (err) {
      message.error((err as Error).message)
    } finally {
      loading.value = false
    }
  }

  function goToPage(p: number) {
    page.value = Math.max(0, Math.min(p, totalPages.value - 1))
    loadPosts()
  }

  function nextPage() {
    goToPage(page.value + 1)
  }

  function prevPage() {
    goToPage(page.value - 1)
  }

  function search() {
    page.value = 0
    selectAllMode.value = false
    selectAllTotal.value = 0
    selectedReviewIds.value = []
    loadPosts()
  }

  async function openDetail(postId: string) {
    currentDetailId.value = postId
    detailOpen.value = true
    detailLoading.value = true
    try {
      detail.value = await api<PostDetail>('/api/posts/' + postId)
    } catch (err) {
      detail.value = null
      message.error((err as Error).message)
    } finally {
      detailLoading.value = false
    }
  }

  async function refreshDetail() {
    if (!currentDetailId.value) return
    detailLoading.value = true
    try {
      detail.value = await api<PostDetail>('/api/posts/' + currentDetailId.value)
    } catch (err) {
      message.error((err as Error).message)
    } finally {
      detailLoading.value = false
    }
  }

  function toggleSelectAll() {
    if (allSelected.value) {
      selectedReviewIds.value = []
      selectAllMode.value = false
      selectAllTotal.value = 0
      return
    }
    // Select all visible items
    selectedReviewIds.value = [...new Set([...selectedReviewIds.value, ...selectableReviewIds.value])]
  }

  /** Fetch ALL review IDs matching current filter and select them all */
  async function selectAllAcrossPages() {
    loading.value = true
    try {
      const params = buildQueryParams()
      // Remove pagination params
      params.delete('cursor')
      params.delete('limit')
      const result = await api<{ review_ids: string[]; total: number }>(
        '/api/reviews/ids?' + params.toString(),
      )
      selectedReviewIds.value = result.review_ids
      selectAllMode.value = true
      selectAllTotal.value = result.total
      if (result.total === 0) {
        message.info('没有可选择的稿件')
      } else {
        message.success(`已选择全部 ${result.total} 条匹配稿件`)
      }
    } catch (err) {
      message.error((err as Error).message)
    } finally {
      loading.value = false
    }
  }

  /** Fetch ALL review IDs regardless of filter (全系统选择) */
  async function selectAllPosts() {
    loading.value = true
    try {
      const result = await api<{ review_ids: string[]; total: number }>(
        '/api/reviews/ids',
      )
      selectedReviewIds.value = result.review_ids
      selectAllMode.value = true
      selectAllTotal.value = result.total
      if (result.total === 0) {
        message.info('系统中没有可选择的稿件')
      } else {
        message.success(`已选择全部 ${result.total} 条稿件（不限筛选条件）`)
      }
    } catch (err) {
      message.error((err as Error).message)
    } finally {
      loading.value = false
    }
  }

  function clearSelection() {
    selectedReviewIds.value = []
    selectAllMode.value = false
    selectAllTotal.value = 0
  }

  function toggleOneSelection(reviewId: string, checked: boolean) {
    selectAllMode.value = false
    selectAllTotal.value = 0
    if (checked) {
      if (!selectedReviewIds.value.includes(reviewId)) {
        selectedReviewIds.value = [...selectedReviewIds.value, reviewId]
      }
    } else {
      selectedReviewIds.value = selectedReviewIds.value.filter((id) => id !== reviewId)
    }
  }

  return {
    loading,
    detailLoading,
    actionLoading,
    stage,
    keyword,
    posts,
    filteredPosts,
    pendingCount,
    selectedReviewIds,
    selectAllMode,
    selectAllTotal,
    detail,
    detailOpen,
    allSelected,
    page,
    pageSize,
    totalCount,
    totalPages,
    sortBy,
    sortOrder,
    selectableReviewIds,
    loadPosts,
    openDetail,
    refreshDetail,
    toggleSelectAll,
    selectAllAcrossPages,
    selectAllPosts,
    clearSelection,
    toggleOneSelection,
    goToPage,
    nextPage,
    prevPage,
    search,
  }
}
