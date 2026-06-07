<script setup lang="ts">
import { KeepAlive, computed, onMounted, ref } from 'vue'
import {
  NConfigProvider,
  NGlobalStyle,
  NMessageProvider,
  dateZhCN,
  zhCN,
} from 'naive-ui'
import MainLayout from './components/layout/MainLayout.vue'
import LoginForm from './components/business/LoginForm.vue'
import ReviewWorkspace from './components/business/ReviewWorkspace.vue'
import StatsDashboard from './components/business/StatsDashboard.vue'
import { useAuth } from './composables/useAuth'

const auth = useAuth()
const currentView = ref('review')

const themeOverrides = computed(() => ({
  common: {
    primaryColor: '#3b82f6',
    primaryColorHover: '#2563eb',
    primaryColorPressed: '#1d4ed8',
    primaryColorSuppl: '#60a5fa',
    infoColor: '#6366f1',
    successColor: '#10b981',
    warningColor: '#f59e0b',
    errorColor: '#ef4444',
    borderRadius: '18px',
    borderRadiusSmall: '12px',
    cardColor: '#ffffff',
    bodyColor: '#f0f4f8',
    modalColor: '#ffffff',
    textColorBase: '#1e293b',
    textColor1: '#1e293b',
    textColor2: 'rgba(30, 41, 59, 0.78)',
    textColor3: 'rgba(30, 41, 59, 0.55)',
    placeholderColor: 'rgba(30, 41, 59, 0.35)',
    borderColor: 'rgba(148, 163, 184, 0.2)',
    dividerColor: 'rgba(148, 163, 184, 0.15)',
    fontFamily: '"Lato", "PingFang SC", "Microsoft YaHei", sans-serif',
    fontFamilyMono: '"Fira Code", "Cascadia Code", monospace',
  },
}))

onMounted(() => {
  auth.checkSession()
})
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="themeOverrides">
    <n-global-style />
    <n-message-provider>
      <div class="app-shell">
        <div class="ambient ambient-left"></div>
        <div class="ambient ambient-right"></div>
        <div class="grain-layer"></div>
        <div class="app-stage">
          <LoginForm v-if="!auth.authed.value" />
          <MainLayout v-else v-model:activeKey="currentView">
            <KeepAlive>
              <component :is="currentView === 'stats' ? StatsDashboard : ReviewWorkspace" />
            </KeepAlive>
          </MainLayout>
        </div>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
:root {
  color-scheme: light;
  --app-bg: #eef2f6;
  --app-page: #f0f4f8;
  --app-page-strong: #f8fafc;
  --app-panel: rgba(30, 41, 59, 0.94);
  --app-panel-strong: rgba(15, 23, 42, 0.98);
  --app-card: #ffffff;
  --app-card-soft: rgba(241, 245, 249, 0.9);
  --app-border: rgba(148, 163, 184, 0.2);
  --app-border-strong: rgba(148, 163, 184, 0.16);
  --app-text: #1e293b;
  --app-text-muted: rgba(30, 41, 59, 0.62);
  --app-text-on-dark: #e2e8f0;
  --app-text-on-dark-muted: rgba(226, 232, 240, 0.66);
  --app-accent: #3b82f6;
  --app-warning: #f59e0b;
  --app-danger: #ef4444;
  --app-shadow: 0 26px 70px rgba(15, 23, 42, 0.12);
  --app-shadow-soft: 0 18px 40px rgba(15, 23, 42, 0.06);
}

* {
  box-sizing: border-box;
}

html,
body,
#app {
  min-height: 100%;
}

body {
  margin: 0;
  padding: 0;
  font-family: "Lato", "PingFang SC", "Microsoft YaHei", sans-serif;
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.08), transparent 30%),
    radial-gradient(circle at 80% 10%, rgba(99, 102, 241, 0.06), transparent 28%),
    linear-gradient(180deg, #f8fafc 0%, #eef2f6 100%);
  color: var(--app-text);
}

a {
  color: inherit;
}

.app-shell {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.app-stage {
  position: relative;
  z-index: 2;
  min-height: 100vh;
}

.ambient {
  position: fixed;
  border-radius: 999px;
  filter: blur(24px);
  opacity: 0.7;
  pointer-events: none;
  z-index: 0;
}

.ambient-left {
  top: 6vh;
  left: -10vw;
  width: 28vw;
  height: 28vw;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.12), transparent 65%);
}

.ambient-right {
  right: -8vw;
  bottom: 10vh;
  width: 32vw;
  height: 32vw;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.08), transparent 64%);
}

.grain-layer {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.04;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px);
  background-size: 3px 3px, 3px 3px;
  mix-blend-mode: soft-light;
}
</style>
