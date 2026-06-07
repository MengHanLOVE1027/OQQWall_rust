<script setup lang="ts">
import {
  NButton,
  NCheckbox,
  NInput,
  NSelect,
  NSwitch,
} from 'naive-ui'
import { STAGE_LABELS } from '../../api/types'
import type { Stage } from '../../api/types'

const props = defineProps<{
  stage: Stage
  groupFilter: string
  sortMode: string
  keyword: string
  onlyError: boolean
  onlyActionable: boolean
  autoRefresh: boolean
  groupOptions: { label: string; value: string }[]
}>()

const emit = defineEmits<{
  (e: 'update:stage', v: Stage): void
  (e: 'update:groupFilter', v: string): void
  (e: 'update:sortMode', v: string): void
  (e: 'update:keyword', v: string): void
  (e: 'update:onlyError', v: boolean): void
  (e: 'update:onlyActionable', v: boolean): void
  (e: 'update:autoRefresh', v: boolean): void
  (e: 'search'): void
  (e: 'refresh'): void
  (e: 'reset'): void
  (e: 'toggleSelectAll'): void
}>()

const stageOptions = Object.keys(STAGE_LABELS).map((k) => ({ label: STAGE_LABELS[k], value: k }))
const sortOptions = [
  { label: '最新投稿优先', value: 'newest' },
  { label: '最早投稿优先', value: 'oldest' },
  { label: '编号优先', value: 'code' },
]
</script>

<template>
  <div class="toolbar-main">
    <div class="toolbar-grid">
      <n-select
        :value="stage"
        :options="stageOptions"
        class="stage-select"
        @update:value="emit('update:stage', $event)"
      />
      <n-select
        :value="groupFilter"
        :options="groupOptions"
        class="group-select"
        @update:value="emit('update:groupFilter', $event)"
      />
      <n-select
        :value="sortMode"
        :options="sortOptions"
        class="sort-select"
        @update:value="emit('update:sortMode', $event)"
      />
      <n-input
        :value="keyword"
        placeholder="搜索编号、分组、投稿人、错误或预览文本"
        class="search-input"
        clearable
        @update:value="emit('update:keyword', $event)"
        @keyup.enter="emit('search')"
      >
        <template #suffix>
          <n-button size="tiny" @click="emit('search')">搜索</n-button>
        </template>
      </n-input>
    </div>

    <div class="toolbar-actions">
      <div class="toolbar-flags">
        <n-checkbox :checked="onlyActionable" @update:checked="emit('update:onlyActionable', $event)">仅看可操作</n-checkbox>
        <n-checkbox :checked="onlyError" @update:checked="emit('update:onlyError', $event)">仅看异常</n-checkbox>
        <div class="toolbar-switch">
          <span>自动刷新</span>
          <n-switch :value="autoRefresh" @update:value="emit('update:autoRefresh', $event)" />
        </div>
      </div>

      <div class="toolbar-buttons">
        <n-button size="small" @click="emit('reset')">重置筛选</n-button>
        <n-button size="small" @click="emit('refresh')">刷新</n-button>
        <n-button size="small" @click="emit('toggleSelectAll')">全选</n-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toolbar-main {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toolbar-grid {
  display: grid;
  grid-template-columns: 160px 160px 160px minmax(260px, 1fr);
  gap: 12px;
}

.toolbar-actions {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
}

.toolbar-flags {
  display: flex;
  align-items: center;
  gap: 16px;
  color: rgba(30, 41, 59, 0.72);
}

.toolbar-switch {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: rgba(30, 41, 59, 0.72);
  font-size: 13px;
}

.toolbar-buttons {
  display: flex;
  gap: 8px;
}

.stage-select,
.group-select,
.sort-select,
.search-input {
  width: 100%;
}

@media (max-width: 1180px) {
  .toolbar-actions {
    grid-template-columns: 1fr;
  }

  .toolbar-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .toolbar-grid {
    grid-template-columns: 1fr;
  }

  .toolbar-flags,
  .toolbar-buttons {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
