<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import { NStep, NSteps } from 'naive-ui';
import { getPaletteColorByNumber, mixColor } from '@sa/color';
import { useThemeStore } from '@/store/modules/theme';
import { useAppStore } from '@/store/modules/app';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useRouterPush } from '@/hooks/common/router';
import ModuleSelect from './modules/module-select.vue';

defineOptions({
  name: 'InitPage'
});

const { formRef, validate } = useNaiveForm();
const { formRules, createRequiredRule } = useFormRules();
const { routerPushByKey } = useRouterPush();

const themeStore = useThemeStore();
const appStore = useAppStore();

// 步骤状态管理
const currentStep = ref(1);

type Model = App.Global.InitFormModel;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    deploymentMode: 'local',
    adminPassword: 'admin123',
    dbType: 'mysql',
    host: '127.0.0.1',
    port: '3306',
    dbName: 'myapp',
    userName: 'root',
    password: 'Tricolor_123',
    redisIP: '127.0.0.1',
    redisPort: '6379',
    redisPassword: '',
    redisDB: 6,
    redisUseCluster: false,
    redisClusterAddrs: []
  };
}

// 数据库配置规则
const dbRules = computed<Record<string, App.Global.FormRule[]>>(() => {
  return {
    adminPassword: formRules.pwd,
    dbType: formRules.userName,
    host: formRules.ip,
    port: formRules.port,
    dbName: formRules.userName,
    userName: formRules.userName,
    password: formRules.pwd
  };
});

type RuleKey = Extract<keyof Model, 'redisIP' | 'redisPort' | 'redisDB'>;

// 缓存配置规则
const cacheRules: Record<RuleKey, App.Global.FormRule[]> = {
  redisIP: formRules.ip,
  redisPort: formRules.port,
  redisDB: [createRequiredRule('请输入Redis数据库编号')]
};

// 步骤切换
const nextStep = async () => {
  if (currentStep.value === 1) {
    // 验证数据库配置
    try {
      await validate();
      currentStep.value = 2;
    } catch (error) {
      // 验证失败，不切换步骤
      window.$message?.error(`请检查数据库配置${error}`);
    }
  }
};

const prevStep = () => {
  currentStep.value = 1;
};

// 计算属性：构建 redisAddr
const redisAddr = computed(() => {
  return `${model.redisIP}:${model.redisPort}`;
});

// 最终提交
const handleSubmit = async () => {
  try {
    await validate();
    const params = {
      ...model,
      port: String(model.port),
      redisPort: String(model.redisPort),
      redisDB: Number(model.redisDB)
    };

    // 容器部署模式下添加 redisAddr
    if (model.deploymentMode === 'docker') {
      params.redisAddr = redisAddr.value;
    }

    await appStore.InitDatabase(params);
    window.$message?.destroyAll();
    window.$message?.success('项目初始化成功！！');
    routerPushByKey('login');
  } catch (error) {
    window.$message?.destroyAll();
    window.$message?.error(`初始化失败${error}`);
  }
};

const generalOptions = ['MySQL', '‌PostgreSQL', '‌SQLite'].map(item => ({
  label: item,
  value: item
}));

// 集群地址字符串和数组的转换
const redisClusterAddrsStr = computed({
  get: () => model.redisClusterAddrs?.join('\n') || '',
  set: (value: string) => {
    model.redisClusterAddrs = value
      .split('\n')
      .map(addr => addr.trim())
      .filter(addr => addr.length > 0);
  }
});

// 监听部署模式变化，自动配置容器部署参数
watch(
  () => model.deploymentMode,
  newMode => {
    if (newMode === 'docker') {
      // 容器部署模式
      model.host = 'mysql';
      model.port = '3306';
      model.redisIP = 'redis';
      model.redisPort = '6379';
    } else {
      // 本地部署模式 - 恢复默认值
      model.host = '127.0.0.1';
      model.port = '3306';
      model.redisIP = '127.0.0.1';
      model.redisPort = '6379';
    }
  }
);

// 计算属性：是否显示容器部署提示
const showDockerHint = computed(() => model.deploymentMode === 'docker');

const bgThemeColor = computed(() =>
  themeStore.darkMode ? getPaletteColorByNumber(themeStore.themeColor, 600) : themeStore.themeColor
);

const bgColor = computed(() => {
  const COLOR_WHITE = '#ffffff';
  const ratio = themeStore.darkMode ? 0.5 : 0.2;
  return mixColor(COLOR_WHITE, themeStore.themeColor, ratio);
});
</script>

<template>
  <div class="relative size-full">
    <!-- 固定背景 -->
    <div class="fixed inset-0 flex-center" :style="{ backgroundColor: bgColor }">
      <WaveBg :theme-color="bgThemeColor" />
    </div>

    <!-- 可滚动的内容区域 -->
    <div class="relative z-4 min-h-full flex items-center justify-center overflow-y-auto py-8">
      <NCard :bordered="false" class="w-auto rd-12px">
        <div class="w-400px lt-sm:w-300px">
          <header class="flex-y-center justify-between">
            <SystemLogo class="text-64px text-primary lt-sm:text-48px" />
            <h2 class="text-28px text-primary font-500 lt-sm:text-22px">项目初始化</h2>
            <div class="i-flex-col">
              <ThemeSchemaSwitch
                :theme-schema="themeStore.themeScheme"
                :show-tooltip="false"
                class="text-20px lt-sm:text-18px"
                @switch="themeStore.toggleThemeScheme"
              />
              <LangSwitch
                v-if="themeStore.header.multilingual.visible"
                :lang="appStore.locale"
                :lang-options="appStore.localeOptions"
                :show-tooltip="false"
                @change-lang="appStore.changeLocale"
              />
            </div>
          </header>

          <!-- 步骤指示器 -->
          <div class="my-6">
            <NSteps :current="currentStep" size="small" class="w-full">
              <NStep title="数据库配置" description="配置数据库连接信息" />
              <NStep title="缓存配置" description="配置Redis缓存连接" />
            </NSteps>
          </div>

          <main>
            <!-- 第一步：数据库配置 -->
            <div v-if="currentStep === 1" class="animate-fade-in">
              <!--部署模式选择 -->
              <ModuleSelect v-model:model-value="model.deploymentMode" />
              <div
                v-if="showDockerHint"
                class="mb-4 border border-blue-200 rounded-md bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
              >
                <div class="flex items-center">
                  <div class="i-tabler-info-circle mr-2 text-base"></div>
                  <span>在Docker模式下，使用容器名称访问服务</span>
                </div>
              </div>
              <NForm
                ref="formRef"
                :model="model"
                :rules="dbRules"
                size="large"
                label-placement="left"
                label-width="100"
              >
                <NFormItem label="管理员密码" path="adminPassword">
                  <NInput v-model:value="model.adminPassword" type="password" show-password-on="click" />
                </NFormItem>
                <NFormItem label="数据库类型" path="dbType">
                  <NSelect v-model:value="model.dbType" :options="generalOptions" />
                </NFormItem>
                <NFormItem v-if="!showDockerHint" label="数据库地址" path="host">
                  <NInput v-model:value="model.host" placeholder="127.0.0.1" />
                </NFormItem>
                <NFormItem label="数据库端口" path="port">
                  <NInput v-model:value="model.port" placeholder="3306" />
                </NFormItem>
                <NFormItem label="数据库名称" path="dbName">
                  <NInput v-model:value="model.dbName" placeholder="数据库名称" />
                </NFormItem>
                <NFormItem label="用户名" path="userName">
                  <NInput v-model:value="model.userName" placeholder="数据库用户名" />
                </NFormItem>
                <NFormItem label="密码" path="password">
                  <NInput v-model:value="model.password" type="password" show-password-on="click" />
                </NFormItem>
                <NFormItem>
                  <div class="w-full flex gap-2">
                    <NButton type="primary" size="large" class="flex-1" @click="nextStep">
                      <template #icon>
                        <SvgIcon local-icon="page-arrow_right" />
                      </template>
                      下一步
                    </NButton>
                  </div>
                </NFormItem>
              </NForm>
            </div>

            <!-- 第二步：缓存配置 -->
            <div v-if="currentStep === 2" class="animate-fade-in">
              <div
                v-if="showDockerHint"
                class="mb-4 border border-blue-200 rounded-md bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
              >
                <div class="flex items-center">
                  <div class="i-tabler-info-circle mr-2 text-base"></div>
                  <span>在Docker模式下，Redis服务地址为: redis</span>
                </div>
              </div>
              <NForm
                ref="formRef"
                :model="model"
                :rules="cacheRules"
                size="large"
                label-placement="left"
                label-width="120"
              >
                <NFormItem v-if="!showDockerHint" label="Redis地址" path="redisIP">
                  <NInput v-model:value="model.redisIP" placeholder="127.0.0.1" />
                </NFormItem>
                <NFormItem label="Redis端口" path="redisPort">
                  <NInput v-model:value="model.redisPort" placeholder="6379" />
                </NFormItem>
                <NFormItem label="Redis密码" path="redisPassword">
                  <NInput
                    v-model:value="model.redisPassword"
                    type="password"
                    show-password-on="click"
                    placeholder="留空表示无密码"
                  />
                </NFormItem>
                <NFormItem label="数据库索引" path="redisDB">
                  <NInputNumber v-model:value="model.redisDB" :min="0" :max="15" placeholder="0" />
                </NFormItem>
                <NFormItem label="集群模式" path="redisUseCluster">
                  <NSwitch v-model:value="model.redisUseCluster">
                    <template #checked>启用</template>
                    <template #unchecked>禁用</template>
                  </NSwitch>
                </NFormItem>
                <NFormItem v-if="model.redisUseCluster" label="集群节点" path="redisClusterAddrs">
                  <NInput
                    v-model:value="redisClusterAddrsStr"
                    type="textarea"
                    placeholder="请输入集群节点地址，每行一个，格式: host:port
例如:
10.0.0.2:7000
10.0.0.3:7001"
                    :rows="5"
                    class="text-sm"
                  />
                </NFormItem>
                <NFormItem>
                  <div class="w-full flex gap-2">
                    <NButton size="large" class="flex-1" @click="prevStep">
                      <template #icon>
                        <SvgIcon local-icon="page-arrow_left" />
                      </template>
                      上一步
                    </NButton>
                    <NButton type="primary" size="large" class="flex-1" @click="handleSubmit">
                      <template #icon>
                        <SvgIcon local-icon="page-infinity" />
                      </template>
                      初始化
                    </NButton>
                  </div>
                </NFormItem>
              </NForm>
            </div>
          </main>
        </div>
      </NCard>
    </div>
  </div>
</template>
