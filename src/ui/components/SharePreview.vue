<script setup lang="ts">
/**
 * 分享图的预览与保存。
 *
 * 流程是**先预览再保存**（项目所有者裁定）：图是自动合成的，用户看不到就不知道
 * 发出去长什么样；而且保存失败时（浏览器拦下载、画布异常）预览本身就是降级出口 ——
 * 长按或右键另存即可，不必重来。
 *
 * 生成三件容易漏的事：
 * - **字体**：canvas 不会自己触发字体加载，页面上没出现过的字重会画成回退字体。
 *   绘制层里逐个字重 `document.fonts.load` 之后再画。
 * - **画布不可用**：`getContext('2d')` 返回 null 时（无头环境、被策略限制）
 *   不能静默给张空白图，要有明确提示。
 * - **下载被拦**：`<a download>` 之后无法感知成败，所以同时给出"另存"的指引，
 *   不去假装成功。
 */
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ModalDialog from './ModalDialog.vue'
import { canvasToBlob, renderShareImage, ShareUnavailableError } from '../result/shareDraw'
import type { ShareTokens } from '../result/sharePlan'
import type { ShareInput } from '../result/sharePlan'

const props = defineProps<{
  /** 由结果页把数据解析好传进来（文案、颜色、名次都在视图层解决） */
  build: (
    measure: (text: string, font: string) => number,
    tokens: ShareTokens,
  ) => Omit<ShareInput, 'measure' | 'tokens'>
  fileName: string
}>()

const emit = defineEmits<{ close: [] }>()
const { t } = useI18n()

const status = ref<'working' | 'ready' | 'failed'>('working')
const previewUrl = ref<string | null>(null)
const blob = ref<Blob | null>(null)
const failedReason = ref('')

function revoke(): void {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = null
}

onMounted(async () => {
  try {
    const canvas = await renderShareImage(props.build)
    blob.value = await canvasToBlob(canvas)
    // toBlob 失败（极少数环境）时退回 dataURL 预览：至少让用户看得到
    previewUrl.value = blob.value
      ? URL.createObjectURL(blob.value)
      : canvas.toDataURL('image/png')
    status.value = 'ready'
  } catch (err) {
    failedReason.value =
      err instanceof ShareUnavailableError ? t('ui.share.unsupported') : t('ui.share.failed')
    status.value = 'failed'
  }
})

function save(): void {
  if (!previewUrl.value) return
  const a = document.createElement('a')
  a.href = previewUrl.value
  a.download = props.fileName
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

function close(): void {
  revoke()
  emit('close')
}
</script>

<template>
  <ModalDialog
    narrow
    :closable="false"
    :title="t('ui.share.modalTitle')"
    :close-label="t('ui.share.close')"
    @close="close"
  >
    <div class="body">
      <p v-if="status === 'working'" class="note" role="status">{{ t('ui.share.working') }}</p>

      <template v-else-if="status === 'ready'">
        <img v-if="previewUrl" class="preview" :src="previewUrl" :alt="t('ui.share.alt')" />
        <p class="note">{{ t('ui.share.hint') }}</p>
      </template>

      <p v-else class="note failed" role="alert">{{ failedReason }}</p>
    </div>

    <div class="actions">
      <button
        v-if="status === 'ready'"
        type="button"
        class="primary"
        data-test="share-save"
        @click="save"
      >
        {{ t('ui.share.save') }}
      </button>
      <button type="button" data-test="share-close" @click="close">
        {{ t('ui.share.close') }}
      </button>
    </div>
  </ModalDialog>
</template>

<style scoped>
.body {
  overflow-y: auto;
  margin-top: var(--sp-3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-3);
}

.preview {
  display: block;
  width: auto;
  max-width: 100%;
  /* 竖图按视口高度收，宽高比保持 9:16 */
  max-height: 58vh;
  border-radius: var(--radius-btn);
  border: 1px solid var(--rule-soft);
}

.note {
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--ink-2);
  text-align: center;
  max-width: 34ch;
}

.note.failed {
  color: var(--warn);
}

.actions {
  display: flex;
  gap: var(--sp-3);
  justify-content: flex-end;
  margin-top: var(--sp-4);
}

.primary {
  border-color: transparent;
  background: var(--accent);
  color: var(--accent-ink);
}

.primary:hover:not(:disabled) {
  background: color-mix(in srgb, var(--accent) 85%, var(--ink));
  color: var(--accent-ink);
}

@media (max-width: 480px) {
  .preview {
    max-height: 48vh;
  }

  .actions {
    flex-direction: column-reverse;
  }

  .actions button {
    width: 100%;
  }
}
</style>
