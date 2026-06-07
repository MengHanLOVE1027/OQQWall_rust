<script setup lang="ts">
import {
  NButton,
  NPopconfirm,
  NSelect,
} from 'naive-ui'
import { ACTION_LABELS, ACTIONS } from '../../api/types'

const props = defineProps<{
  selectedCount: number
  batchAction: string
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'update:batchAction', v: string): void
  (e: 'execute'): void
}>()

const actionOptions = ACTIONS.map((k) => ({ label: ACTION_LABELS[k], value: k }))
</script>

<template>
  <div v-if="selectedCount > 0" class="batch-bar">
    <span>已选择 <b>{{ selectedCount }}</b> 条可操作稿件</span>
    <div class="batch-actions">
      <n-select
        size="small"
        :value="batchAction"
        :options="actionOptions"
        style="width: 140px"
        @update:value="emit('update:batchAction', $event)"
      />
      <n-popconfirm @positive-click="emit('execute')">
        <template #trigger>
          <n-button size="small" type="primary" :loading="loading">执行批量动作</n-button>
        </template>
        确定批量执行 {{ ACTION_LABELS[batchAction] }} 吗？
      </n-popconfirm>
    </div>
  </div>
</template>

<style scoped>
.batch-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 18px;
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.08), rgba(99, 102, 241, 0.04));
  border: 1px solid rgba(59, 130, 246, 0.12);
  color: #334155;
  font-size: 13px;
  margin-top: 14px;
}

.batch-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

@media (max-width: 760px) {
  .batch-bar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
