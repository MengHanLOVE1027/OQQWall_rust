import { computed, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { api } from '../api/client'
import { STAGE_LABELS, type PostDetail, type PostItem, type Stage } from '../api/types'

export function useReview() {
  const message = useMessage()
  const loading = ref(false)
  const detailLoading = ref(false)
  const actionLoading = ref(false)

  const stage = ref<Stage>('review_pending')
  const keyword = ref('')
  const posts = ref<PostItem[]>([])
  const page = ref(0)
  const pageSize = ref(50)
  const totalCount = ref(0)
  const sortBy = ref('created_at')
  const sortOrder = ref('desc')

  const selectedReviewIds = ref<string[]>([])

  const detail = ref<PostDetail | null>(null)
  const detailOpen = ref(false)
  const currentDetailId = ref<string | null>(null)

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalCount.value / pageSize.value))
  )

  const pendingCount = computed(() => posts.value.filter((item) => item.stage === 'review_pending').length)

  const filteredPosts = computed(() => {
    // Server-side filtering now, return posts directly
    return posts.value
  })

  const selectableReviewIds = computed(() =>
    filteredPosts.value.map((item) => item.review_id).filter(Boolean) as string[],
  )

  const allSelected = computed(() => {
    if (selectableReviewIds.value.length === 0) return false
    return selectableReviewIds.value.every((id) => selectedReviewIds.value.includes(id))
  })

  async function loadPosts() {
    loading.value = true
    try {
      const params = new URLSearchParams()
      params.set('stage', stage.value)
      params.set('limit', String(pageSize.value))
      params.set('cursor', String(page.value * pageSize.value))
      if (keyword.value.trim()) {
        params.set('keyword', keyword.value.trim())
      }
      params.set('sort_by', sortBy.value)
      params.set('sort_order', sortOrder.value)

      const result = await api<{ items: PostItem[]; next_cursor: number | null }>(
        '/api/posts?' + params.toString()
      )
      posts.value = result.items
      if (result.next_cursor !== null && result.next_cursor !== undefined) {
        totalCount.value = result.items.length > 0
          ? (page.value + 2) * pageSize.value // estimate
          : page.value * pageSize.value
      } else {
        totalCount.value = page.value * pageSize.value + result.items.length
      }
      const reviewSet = new Set(result.items.map((item) => item.review_id).filter(Boolean) as string[])
      selectedReviewIds.value = selectedReviewIds.value.filter((id) => reviewSet.has(id))
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
      selectedReviewIds.value = selectedReviewIds.value.filter((id) => !selectableReviewIds.value.includes(id))
      return
    }
    const set = new Set([...selectedReviewIds.value, ...selectableReviewIds.value])
    selectedReviewIds.value = [...set]
  }

  function toggleOneSelection(reviewId: string, checked: boolean) {
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
    detail,
    detailOpen,
    allSelected,
    page,
    pageSize,
    totalCount,
    totalPages,
    sortBy,
    sortOrder,
    loadPosts,
    openDetail,
    refreshDetail,
    toggleSelectAll,
    toggleOneSelection,
    goToPage,
    nextPage,
    prevPage,
    search,
  }
}
