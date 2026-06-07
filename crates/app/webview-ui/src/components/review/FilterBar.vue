<script setup lang="ts">
import { NButton, NCheckbox, NInput, NSelect, NSwitch } from 'naive-ui'
import { STAGE_LABELS, type Stage } from '../../api/types'

defineProps<{
  stage: Stage | '' | '__active__'; groupFilter: string; sortMode: string; keyword: string
  onlyError: boolean; onlyActionable: boolean; autoRefresh: boolean
  groupOptions: { label: string; value: string }[]
}>()

const emit = defineEmits<{
  'update:stage': [v: Stage | '']; 'update:groupFilter': [v: string]; 'update:sortMode': [v: string]
  'update:keyword': [v: string]; 'update:onlyError': [v: boolean]; 'update:onlyActionable': [v: boolean]
  'update:autoRefresh': [v: boolean]
  search: []; refresh: []; reset: []; toggleSelectAll: []
}>()

// "全部状态" = 全部活跃状态（排除已拒绝/已跳过/失败）
const ACTIVE_STAGES = new Set(['drafted','render_requested','rendered','review_pending','reviewed','scheduled','sending','sent','manual'])
const stages = [
  { label: '全部活跃', value: '__active__' },
  { label: '全部（含已删除）', value: '' },
  ...Object.keys(STAGE_LABELS).filter(k => ACTIVE_STAGES.has(k)).map(k => ({ label: STAGE_LABELS[k], value: k })),
  { label: '──', value: '__sep__', disabled: true },
  ...Object.keys(STAGE_LABELS).filter(k => !ACTIVE_STAGES.has(k)).map(k => ({ label: STAGE_LABELS[k], value: k })),
]
const sorts = [{ label: '最新优先', value: 'newest' }, { label: '最早优先', value: 'oldest' }, { label: '编号优先', value: 'code' }]
</script>

<template>
  <div class="tb">
    <div class="row">
      <n-select :value="stage" :options="stages" @update:value="emit('update:stage', $event)" style="width:130px" />
      <n-select :value="groupFilter" :options="groupOptions" @update:value="emit('update:groupFilter', $event)" style="width:130px" />
      <n-select :value="sortMode" :options="sorts" @update:value="emit('update:sortMode', $event)" style="width:130px" />
      <n-input :value="keyword" placeholder="搜索编号/分组/投稿人/内容/错误" clearable @update:value="emit('update:keyword', $event)" @keyup.enter="emit('search')">
        <template #suffix><n-button size="tiny" @click="emit('search')">搜索</n-button></template>
      </n-input>
    </div>
    <div class="row2">
      <div class="fl">
        <n-checkbox :checked="onlyActionable" @update:checked="emit('update:onlyActionable', $event)">可操作</n-checkbox>
        <n-checkbox :checked="onlyError" @update:checked="emit('update:onlyError', $event)">异常</n-checkbox>
        <label class="sw"><span>自动刷新</span><n-switch :value="autoRefresh" @update:value="emit('update:autoRefresh', $event)" size="small" /></label>
      </div>
      <div class="bt">
        <n-button size="small" @click="emit('reset')">重置</n-button>
        <n-button size="small" @click="emit('refresh')">刷新</n-button>
        <n-button size="small" @click="emit('toggleSelectAll')">全选</n-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tb { display: flex; flex-direction: column; gap: 12px; }
.row { display: flex; gap: 10px; }
.row > :last-child { flex: 1; min-width: 0; }
.row2 { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.fl { display: flex; align-items: center; gap: 14px; color: rgba(30,41,59,0.72); font-size: 13px; }
.sw { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; }
.bt { display: flex; gap: 6px; }
@media (max-width:760px) { .row { flex-wrap: wrap; } .row2 { flex-direction: column; align-items: stretch; } }
</style>
