<script lang="ts" setup>
import { ref, watch } from 'vue';

// 部署模式配置
interface DeploymentOption {
  value: 'local' | 'docker' | 'k8s';
  label: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const deploymentOptions: DeploymentOption[] = [
  {
    value: 'local',
    label: '本地部署',
    description: '直接部署到服务器',
    icon: 'fa-desktop',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    borderColor: 'border-blue-500 dark:border-blue-500/50'
  },
  {
    value: 'docker',
    label: '容器部署',
    description: 'Docker容器化部署',
    icon: 'fa-cloud',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    borderColor: 'border-green-500 dark:border-green-500/50'
  }
];

// 部署模式选择
defineOptions({
  name: 'ModuleSelect'
});

const props = defineProps<{
  modelValue: 'local' | 'docker' | 'k8s';
}>();

const deploymentMode = ref<'local' | 'docker' | 'k8s'>(props.modelValue);

const emit = defineEmits<{
  (e: 'update:modelValue', value: 'local' | 'docker' | 'k8s'): void;
  (e: 'change', value: 'local' | 'docker' | 'k8s'): void;
}>();

// 监听外部传入的modelValue变化
watch(
  () => props.modelValue,
  newValue => {
    deploymentMode.value = newValue;
  }
);

// 监听内部选择变化
watch(deploymentMode, newValue => {
  emit('update:modelValue', newValue);
  emit('change', newValue);
});

defineExpose({
  deploymentMode
});
</script>

<template>
  <div class="mb-5 w-full">
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-2">
      <div
        v-for="option in deploymentOptions"
        :key="option.value"
        class="group relative cursor-pointer overflow-hidden border-2 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-blue-900/20"
        :class="[
          deploymentMode === option.value
            ? `${option.borderColor} ${option.bgColor} shadow-lg dark:shadow-lg dark:shadow-blue-900/30`
            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-gray-600 dark:hover:bg-gray-800'
        ]"
        @click="deploymentMode = option.value"
      >
        <!-- 背景装饰 -->
        <div
          class="absolute h-16 w-16 rounded-full opacity-10 transition-all duration-300 -right-4 -top-4 dark:opacity-20"
          :class="[
            deploymentMode === option.value ? option.bgColor.replace('100', '200') : 'bg-gray-200 dark:bg-gray-600',
            deploymentMode === option.value ? 'scale-150' : 'scale-100'
          ]"
        />

        <!-- 内容区域 -->
        <div class="relative flex items-center space-x-3">
          <!-- 图标 -->
          <div
            class="h-10 w-10 flex items-center justify-center rounded-full transition-all duration-300"
            :class="[
              deploymentMode === option.value
                ? option.bgColor.replace('100', '200')
                : 'bg-gray-100 group-hover:bg-gray-200 dark:bg-gray-700 dark:group-hover:bg-gray-600'
            ]"
          >
            <SvgIcon class="text-xl" :class="[option.color]" :icon="option.icon" />
          </div>

          <!-- 文字信息 -->
          <div class="min-w-0 flex-1">
            <h3
              class="text-sm font-semibold transition-colors duration-300"
              :class="[
                deploymentMode === option.value
                  ? 'text-gray-900 dark:text-gray-100'
                  : 'text-gray-700 group-hover:text-gray-900 dark:text-gray-200 dark:group-hover:text-gray-100'
              ]"
            >
              {{ option.label }}
            </h3>
            <p
              class="mt-1 text-xs transition-colors duration-300"
              :class="[
                deploymentMode === option.value
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300'
              ]"
            >
              {{ option.description }}
            </p>
          </div>

          <!-- 选择指示器 -->
          <div class="flex-shrink-0">
            <div
              class="h-5 w-5 flex items-center justify-center border-2 rounded-full transition-all duration-300"
              :class="[
                deploymentMode === option.value
                  ? `${option.borderColor} ${option.bgColor.replace('100', '500')}`
                  : 'border-gray-300 group-hover:border-gray-400 dark:border-gray-600 dark:group-hover:border-gray-500'
              ]"
            >
              <div v-if="deploymentMode === option.value" class="h-2 w-2 rounded-full bg-primary" />
            </div>
          </div>
        </div>

        <!-- 选中状态指示条 -->
        <div
          class="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300"
          :class="[deploymentMode === option.value ? option.bgColor.replace('100', '500') : 'bg-transparent']"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 添加一些动画效果 */
.group:hover .text-xl {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
</style>
