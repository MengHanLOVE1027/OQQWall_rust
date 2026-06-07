<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import {
  NAlert, NButton, NDescriptions, NDescriptionsItem, NDivider,
  NDrawer, NDrawerContent, NEmpty, NFormItem, NImage,
  NInput, NInputNumber, NModal, NSelect, NSpin, NTag, useMessage,
} from 'naive-ui'
import { ACTION_LABELS, ACTIONS, STAGE_LABELS, type PostDetail } from '../../api/types'
import { usePostActions } from '../../composables/usePostActions'

const props = defineProps<{
  show: boolean; loading: boolean; detail: PostDetail | null
  hasPrev?: boolean; hasNext?: boolean
}>()
const emit = defineEmits<{
  (e: 'update:show', v: boolean): void
  (e: 'refresh'): void; (e: 'prev'): void; (e: 'next'): void
}>()

const message = useMessage()
const actions = usePostActions()

const w = ref(0)
const action = ref('approve')
const extra = reactive({ comment: '', text: '', delay_ms: 180000, key: '', target: null as number | null })
const actionOpts = ACTIONS.map(k => ({ label: ACTION_LABELS[k], value: k }))

onMounted(() => { w.value = window.innerWidth; window.addEventListener('resize', () => w.value = window.innerWidth) })
onUnmounted(() => {})
watch(() => props.detail?.post_id, () => { action.value = 'approve'; extra.comment = ''; extra.text = ''; extra.delay_ms = 180000; extra.key = ''; extra.target = null })

const isMobile = computed(() => w.value < 640)
const visible = computed({ get: () => props.show, set: v => emit('update:show', v) })
const label = computed(() => `#${props.detail?.review_code ?? props.detail?.external_code ?? '-'}`)

const extHint = computed(() => {
  switch (action.value) {
    case 'reject': return '拒绝说明（可留空）'
    case 'reply': case 'comment': return '文本内容（必填）'
    case 'blacklist': return '拉黑原因（必填）'
    case 'defer': return '暂缓毫秒数'
    case 'quick_reply': return '快捷回复键名'
    case 'merge': return '目标审核编号'
    default: return ''
  }
})

const needsText = computed(() => ['reject','blacklist','comment','reply'].includes(action.value))
const needsMs = computed(() => action.value === 'defer')
const needsKey = computed(() => action.value === 'quick_reply')
const needsCode = computed(() => action.value === 'merge')

function formatTime(ms: number) { return new Date(ms).toLocaleString('zh-CN') }
function blobUrl(ref: string, type: string) { return type === 'blob_id' ? '/api/blobs/' + ref : ref }
async function copy(text: string, label: string) {
  try { await navigator.clipboard.writeText(text); message.success(label + '已复制') }
  catch { message.error('复制失败') }
}

const blocks = computed(() => {
  const b = props.detail?.blocks ?? []
  return { t: b.filter(x => x.kind === 'text').length, f: b.length - b.filter(x => x.kind === 'text').length }
})

function doAction() {
  if (!props.detail?.review_id) { message.error('不可操作'); return }
  actions.confirmState.comment = extra.comment
  actions.confirmState.text = extra.text
  actions.confirmState.delay_ms = extra.delay_ms
  actions.confirmState.quick_reply_key = extra.key
  actions.confirmState.target_review_code = extra.target
  actions.openConfirm(props.detail.review_id, action.value, label.value, props.detail.group_id, props.detail.sender_id ?? '')
}

async function onConfirm() {
  if (await actions.executeAction()) {
    emit('refresh')
    if (actions.isTerminalAction(actions.confirmState.action)) emit('update:show', false)
  }
}
</script>

<template>
  <n-drawer v-model:show="visible" :width="isMobile ? '100%' : 780" placement="right" :trap-focus="false">
    <n-drawer-content title="稿件详情" closable native-scrollbar>
      <div v-if="loading" style="display:flex;justify-content:center;padding:48px"><n-spin size="large" /></div>

      <div v-else-if="detail" class="dv">
        <!-- Hero -->
        <section class="hero">
          <div>
            <span class="k">稿件信息</span>
            <h2>{{ label }}</h2>
            <p>{{ detail.sender_id ?? '未知' }} · {{ formatTime(detail.created_at_ms) }}</p>
          </div>
          <div class="tags">
            <n-tag :type="detail.stage==='review_pending'?'warning':'default'" round>{{ STAGE_LABELS[detail.stage]??detail.stage }}</n-tag>
            <n-tag :type="detail.is_safe?'success':'error'" round>{{ detail.is_safe?'安全':'待核查' }}</n-tag>
            <n-tag :type="detail.is_anonymous?'info':'default'" round>{{ detail.is_anonymous?'匿名':'非匿名' }}</n-tag>
          </div>
        </section>

        <!-- Nav bar -->
        <section class="bar">
          <div class="bg"><n-button size="small" :disabled="!hasPrev" @click="emit('prev')">上一条</n-button><n-button size="small" :disabled="!hasNext" @click="emit('next')">下一条</n-button><n-button size="small" @click="emit('refresh')">刷新</n-button></div>
          <div class="bg"><n-button size="small" @click="copy(detail.post_id,'ID')">复制ID</n-button><n-button size="small" @click="copy(detail.session_id,'会话ID')">复制会话</n-button></div>
        </section>

        <!-- Actions: quick buttons + compact form -->
        <section class="ap">
          <div class="qb">
            <n-button type="primary" @click="action='approve';doAction()" :loading="actions.submitting.value">通过</n-button>
            <n-button type="warning" ghost @click="action='reject';doAction()" :loading="actions.submitting.value">拒绝</n-button>
            <n-button type="error" ghost @click="action='delete';doAction()" :loading="actions.submitting.value">删除</n-button>
            <n-button ghost @click="action='immediate';doAction()" :loading="actions.submitting.value">立即发送</n-button>
            <n-button ghost @click="action='rerender';doAction()" :loading="actions.submitting.value">重渲染</n-button>
          </div>
          <n-divider />
          <div class="af">
            <n-select v-model:value="action" :options="actionOpts" style="width:140px;flex-shrink:0" />
            <template v-if="needsText">
              <n-input v-model:value="extra.comment" :placeholder="extHint" style="flex:1" @keyup.enter="doAction()" />
              <n-input v-if="action==='comment'||action==='reply'" v-model:value="extra.text" placeholder="文本内容" style="flex:1" />
            </template>
            <n-input-number v-else-if="needsMs" v-model:value="extra.delay_ms" :min="1000" :step="60000" style="width:160px;flex-shrink:0" />
            <n-input v-else-if="needsKey" v-model:value="extra.key" placeholder="键名" style="width:160px;flex-shrink:0" />
            <n-input-number v-else-if="needsCode" v-model:value="extra.target" :min="1" style="width:160px;flex-shrink:0" />
            <n-button type="primary" :loading="actions.submitting.value" @click="doAction()" style="flex-shrink:0">执行</n-button>
          </div>
        </section>

        <!-- Info -->
        <n-descriptions bordered column="1" size="small" label-placement="left" :label-style="{ width: isMobile?'76px':'96px' }" class="ip">
          <n-descriptions-item label="组别">{{ detail.group_id }}</n-descriptions-item>
          <n-descriptions-item label="投稿人">{{ detail.sender_id ?? '未知' }}</n-descriptions-item>
          <n-descriptions-item label="时间">{{ formatTime(detail.created_at_ms) }}</n-descriptions-item>
          <n-descriptions-item label="文本块">{{ blocks.t }} · 附件块 {{ blocks.f }}</n-descriptions-item>
          <n-descriptions-item label="会话ID"><span class="sid">{{ detail.session_id }}</span></n-descriptions-item>
        </n-descriptions>

        <!-- Preview -->
        <div v-if="detail.render_png_blob_id" class="sec">
          <div class="sh"><span class="k">渲染预览</span><h4>预览图</h4></div>
          <n-image :src="'/api/blobs/'+detail.render_png_blob_id" class="fi" />
        </div>

        <!-- Content -->
        <div class="sec">
          <div class="sh"><span class="k">稿件内容</span><h4>内容块</h4></div>
          <div v-for="(b,i) in detail.blocks" :key="i" class="blk">
            <div v-if="b.kind==='text'" class="tx">{{ b.text }}</div>
            <template v-else>
              <div class="mh">{{ b.media_kind }} · {{ b.reference_type }}</div>
              <n-image v-if="b.media_kind==='image'" :src="blobUrl(b.reference,b.reference_type)" class="fi" />
              <a v-else :href="blobUrl(b.reference,b.reference_type)" target="_blank" class="lnk">打开附件</a>
            </template>
          </div>
        </div>

        <!-- Error -->
        <div v-if="detail.last_error" class="sec err">
          <div class="sh"><span class="k">异常记录</span><h4>最近错误</h4></div>
          <pre>{{ detail.last_error }}</pre>
        </div>
      </div>
      <n-empty v-else description="暂无数据" />
    </n-drawer-content>
  </n-drawer>

  <!-- Confirm modal -->
  <n-modal v-model:show="actions.confirmState.show" preset="card" style="max-width:520px" :mask-closable="false">
    <div><span class="k">确认操作</span><h3 style="margin:8px 0 6px;color:#1e293b">{{ ACTION_LABELS[actions.confirmState.action] }} {{ actions.confirmState.postLabel }}</h3></div>
    <p v-if="actions.confirmState.groupId" style="color:rgba(30,41,59,0.62);line-height:1.7">分组：{{ actions.confirmState.groupId }} · 投稿人：{{ actions.confirmState.senderId }}</p>
    <n-alert type="warning" :bordered="false">确认后立即提交到后端处理。</n-alert>
    <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px">
      <n-button @click="actions.confirmState.show=false">取消</n-button>
      <n-button type="primary" :loading="actions.submitting.value" @click="onConfirm">确认执行</n-button>
    </div>
  </n-modal>
</template>

<style scoped>
.dv { display: flex; flex-direction: column; gap: 18px; padding-bottom: 24px; }
.hero,.bar,.ap,.ip,.sec { border-radius: 24px; overflow: hidden; }
.hero { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; padding: 24px; background: linear-gradient(135deg, rgba(59,130,246,0.16), rgba(99,102,241,0.12)); border: 1px solid rgba(59,130,246,0.12); }
.k { display: inline-block; margin-bottom: 10px; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: rgba(30,41,59,.46); }
.hero h2 { margin: 0; font-family: Georgia,serif; font-size: clamp(34px,6vw,50px); line-height: 1; color: #1e293b; }
.hero p { margin: 10px 0 0; color: rgba(30,41,59,.72); }
.tags { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
.bar { display: flex; justify-content: space-between; gap: 12px; padding: 14px 16px; background: rgba(255,255,255,.92); border: 1px solid rgba(148,163,184,.1); box-shadow: var(--app-shadow-soft); }
.bg { display: flex; flex-wrap: wrap; gap: 8px; }
.ap { padding: 18px; background: rgba(255,255,255,.96); border: 1px solid rgba(148,163,184,.1); box-shadow: var(--app-shadow-soft); }
.qb { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.af { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.ip { background: rgba(255,255,255,.94); border: 1px solid rgba(148,163,184,.1); box-shadow: var(--app-shadow-soft); }
.sec { padding: 22px; background: rgba(255,255,255,.94); border: 1px solid rgba(148,163,184,.1); box-shadow: var(--app-shadow-soft); }
.sh { margin-bottom: 14px; } .sh h4 { margin: 0; font-size: 22px; color: #1e293b; }
.fi { width: 100%; display: block; } :deep(.fi img) { width: 100%; height: auto; display: block; border-radius: 18px; }
.blk { background: rgba(30,41,59,.03); border: 1px solid rgba(30,41,59,.08); padding: 14px; border-radius: 18px; margin-bottom: 10px; overflow: hidden; }
.tx { white-space: pre-wrap; word-break: break-word; line-height: 1.8; color: #334155; }
.mh { font-size: 12px; color: rgba(51,65,85,.52); margin-bottom: 8px; }
.lnk { color: #3b82f6; text-decoration: none; }
.err pre { color: #dc2626; background: rgba(239,68,68,.08); padding: 14px; border-radius: 16px; white-space: pre-wrap; word-break: break-all; }
.sid { word-break: break-all; font-size: 12px; font-family: monospace; }
@media (max-width:760px) { .hero,.qb,.bar { flex-direction: column; } .tags { justify-content: flex-start; } }
</style>
