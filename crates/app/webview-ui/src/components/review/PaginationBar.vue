<script setup lang="ts">
import { NButton, NSelect } from 'naive-ui'

const props = defineProps<{
  page: number
  totalPages: number
  totalCount: number
  pageSize: number
}>()

const emit = defineEmits<{
  (e: 'update:pageSize', v: number): void
  (e: 'prev'): void
  (e: 'next'): void
}>()

const pageSizeOptions = [
  { label: '20条/页', value: 20 },
  { label: '50条/页', value: 50 },
  { label: '100条/页', value: 100 },
  { label: '200条/页', value: 200 },
]
</script>

<template>
  <div class="pagination-bar">
    <div class="page-info">
      第 {{ page + 1 }}/{{ totalPages }} 页，共 {{ totalCount }} 条
      <n-select
        :value="pageSize"
        size="tiny"
        :options="pageSizeOptions"
        style="width: 100px; display: inline-flex; margin-left: 12px"
        @update:value="emit('update:pageSize', $event)"
      />
    </div>
    <div class="page-actions">
      <n-button size="tiny" :disabled="page === 0" @click="emit('prev')">上一页</n-button>
      <n-button size="tiny" :disabled="page >= totalPages - 1" @click="emit('next')">下一页</n-button>
    </div>
  </div>
</template>

<style scoped>
.pagination-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--app-border-strong);
}

.page-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(30, 41, 59, 0.7);
}

.page-actions {
  display: flex;
  gap: 6px;
}
</style>
