import { reactive, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { api } from '../api/client'
import { ACTION_LABELS } from '../api/types'

export interface ActionTarget {
  reviewId: string
  label: string
  groupId?: string
  senderId?: string
}

export function usePostActions() {
  const message = useMessage()
  const submitting = ref(false)

  const confirmState = reactive({
    show: false,
    reviewId: '',
    action: 'approve' as string,
    postLabel: '',
    groupId: '',
    senderId: '',
    comment: '',
    text: '',
    delay_ms: 180000,
    quick_reply_key: '',
    target_review_code: null as number | null,
  })

  function buildPayload(action: string): Record<string, unknown> {
    const payload: Record<string, unknown> = { action }

    if (action === 'reject' || action === 'blacklist') {
      const comment = confirmState.comment.trim()
      if (comment) payload.comment = comment
      if (action === 'blacklist' && !comment) throw new Error('请填写拉黑原因')
    }
    if (action === 'comment' || action === 'reply') {
      const text = confirmState.text.trim() || confirmState.comment.trim()
      if (!text) throw new Error(action === 'reply' ? '请填写回复内容' : '请填写评论内容')
      payload.text = text
    }
    if (action === 'defer') {
      if (!confirmState.delay_ms || confirmState.delay_ms <= 0) throw new Error('请填写大于 0 的暂缓时长')
      payload.delay_ms = confirmState.delay_ms
    }
    if (action === 'quick_reply') {
      const key = confirmState.quick_reply_key.trim()
      if (!key) throw new Error('请填写快捷回复键名')
      payload.quick_reply_key = key
    }
    if (action === 'merge') {
      if (!confirmState.target_review_code) throw new Error('请填写目标审核编号')
      payload.target_review_code = confirmState.target_review_code
    }
    return payload
  }

  function openConfirm(reviewId: string, action: string, postLabel: string, groupId = '', senderId = '') {
    confirmState.reviewId = reviewId
    confirmState.action = action
    confirmState.postLabel = postLabel
    confirmState.groupId = groupId
    confirmState.senderId = senderId
    confirmState.comment = ''
    confirmState.text = ''
    confirmState.delay_ms = 180000
    confirmState.quick_reply_key = ''
    confirmState.target_review_code = null
    confirmState.show = true
  }

  async function executeAction(): Promise<boolean> {
    let payload: Record<string, unknown>
    try {
      payload = buildPayload(confirmState.action)
    } catch (e) {
      message.error((e as Error).message)
      return false
    }

    submitting.value = true
    try {
      await api(`/api/reviews/${confirmState.reviewId}/decision`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      message.success(`执行成功: ${ACTION_LABELS[confirmState.action]}`)
      confirmState.show = false
      return true
    } catch (e) {
      message.error((e as Error).message)
      return false
    } finally {
      submitting.value = false
    }
  }

  async function batchAction(reviewIds: string[], action: string): Promise<boolean> {
    if (reviewIds.length === 0) return false
    submitting.value = true
    try {
      await api('/api/reviews/batch', {
        method: 'POST',
        body: JSON.stringify({ review_ids: reviewIds, action }),
      })
      message.success(`批量执行成功: ${ACTION_LABELS[action]}`)
      return true
    } catch (e) {
      message.error((e as Error).message)
      return false
    } finally {
      submitting.value = false
    }
  }

  /** Check if action causes post to leave review queue (close detail) */
  function isTerminalAction(action: string): boolean {
    return ['approve', 'reject', 'delete', 'immediate'].includes(action)
  }

  return {
    submitting,
    confirmState,
    openConfirm,
    executeAction,
    batchAction,
    isTerminalAction,
  }
}
