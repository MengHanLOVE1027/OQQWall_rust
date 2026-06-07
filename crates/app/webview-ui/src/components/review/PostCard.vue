<script setup lang="ts">
import {
  NCard,
  NTag,
  NImage,
  NButton,
  NButtonGroup,
  NSpace,
} from 'naive-ui'
import { STAGE_LABELS, type PostItem } from '../../api/types'

const props = defineProps<{
  post: PostItem
  selected: boolean
}>()

const emit = defineEmits<{
  (e: 'select', reviewId: string, checked: boolean): void
  (e: 'click'): void
  (e: 'quickAction', action: string): void
}>()

function formatTime(ms: number) {
  return new Date(ms).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function stageType(stage: string) {
  switch (stage) {
    case 'review_pending': return 'warning'
    case 'sent': return 'success'
    case 'rejected': case 'failed': return 'error'
    case 'sending': return 'info'
    default: return 'default'
  }
}
</script>

<template>
  <n-card size="small" hoverable class="post-card" :bordered="false" @click="emit('click')">
    <template #header>
      <div class="card-header">
        <div>
          <span class="code">#{{ post.internal_code ?? post.external_code ?? '-' }}</span>
          <p class="card-subhead">{{ post.sender_id ?? '未知投稿人' }}</p>
        </div>
        <n-tag size="small" :type="stageType(post.stage)" round class="status-tag">
          {{ STAGE_LABELS[post.stage] ?? post.stage }}
        </n-tag>
      </div>
    </template>

    <template #header-extra>
      <input
        v-if="post.review_id"
        type="checkbox"
        :checked="selected"
        @click.stop="emit('select', post.review_id!, !selected)"
        class="checkbox"
      />
    </template>

    <div class="card-body">
      <div class="preview-area">
        <n-image
          v-if="post.preview_image_url"
          :src="post.preview_image_url"
          class="preview-img"
          preview-disabled
        />
        <div v-if="post.preview_text" class="preview-text">
          {{ post.preview_text }}
        </div>
        <div v-else-if="!post.preview_image_url" class="preview-fallback">
          <span>{{ post.last_error ? '该稿件存在异常信息' : '点击查看稿件详情' }}</span>
        </div>
      </div>

      <div class="meta-row">
        <n-tag size="small" :bordered="false" round>{{ post.group_id }}</n-tag>
        <span>{{ formatTime(post.created_at_ms) }}</span>
      </div>
      <div v-if="post.last_error" class="error-msg">{{ post.last_error }}</div>
    </div>

    <template #action>
      <n-space justify="space-between" align="center" size="small" v-if="post.review_id">
        <span class="action-tip">点击卡片查看详情</span>
        <n-button-group size="tiny">
          <n-button type="primary" ghost @click.stop="emit('quickAction', 'approve')">通过</n-button>
          <n-button type="warning" ghost @click.stop="emit('quickAction', 'reject')">拒绝</n-button>
          <n-button type="error" ghost @click.stop="emit('quickAction', 'delete')">删除</n-button>
        </n-button-group>
        <n-button size="tiny" ghost @click.stop="emit('quickAction', 'immediate')" style="margin-left: 6px">立即发送</n-button>
      </n-space>
      <div v-else class="no-action">当前阶段暂无可执行动作</div>
    </template>
  </n-card>
</template>

<style scoped>
.post-card {
  height: 100%;
  border-radius: 22px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: var(--app-shadow-soft);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 34px rgba(15, 23, 42, 0.14);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.code {
  font-size: 24px;
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 700;
  color: #1e293b;
}

.card-subhead {
  margin: 6px 0 0;
  font-size: 12px;
  color: rgba(30, 41, 59, 0.62);
}

.status-tag {
  flex-shrink: 0;
}

.checkbox {
  cursor: pointer;
  transform: scale(1.2);
}

.card-body {
  cursor: pointer;
  padding-bottom: 8px;
}

.preview-area {
  margin-bottom: 12px;
  border-radius: 16px;
  overflow: hidden;
  background:
    linear-gradient(160deg, rgba(30, 41, 59, 0.05), rgba(30, 41, 59, 0.01)),
    linear-gradient(135deg, rgba(59, 130, 246, 0.06), rgba(245, 158, 11, 0.05));
  border: 1px solid rgba(30, 41, 59, 0.06);
}

.preview-img {
  width: 100%;
  display: block;
}

:deep(.preview-img img) {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}

.preview-text {
  padding: 14px;
  font-size: 13px;
  color: #334155;
  line-height: 1.65;
  min-height: 88px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.preview-fallback {
  min-height: 120px;
  display: grid;
  place-items: center;
  padding: 16px;
  text-align: center;
  color: rgba(51, 65, 85, 0.56);
  line-height: 1.7;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: rgba(51, 65, 85, 0.62);
}

.error-msg {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(239, 68, 68, 0.08);
  color: #dc2626;
  font-size: 12px;
  line-height: 1.6;
}

.no-action {
  font-size: 12px;
  color: rgba(51, 65, 85, 0.4);
  text-align: center;
}

.action-tip {
  color: rgba(51, 65, 85, 0.52);
  font-size: 12px;
}
</style>
