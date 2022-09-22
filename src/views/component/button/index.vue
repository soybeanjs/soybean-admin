<template>
  <div>
    <n-card title="按钮" class="h-full shadow-sm rounded-16px">
      <n-grid cols="s:1 m:2" responsive="screen" :x-gap="16" :y-gap="16">
        <n-grid-item v-for="item in buttonExample" :key="item.id">
          <n-card :title="item.label" class="min-h-180px">
            <p v-if="item.desc" class="pb-16px">{{ item.desc }}</p>
            <n-space>
              <n-button
                v-for="button in item.buttons"
                :key="button.id"
                v-bind="button.props"
                :style="`--icon-margin: ${button.props.circle ? 0 : 6}px`"
              >
                <template v-if="button.icon" #icon>
                  <svg-icon :icon="button.icon" />
                </template>
                {{ button.label }}
              </n-button>
            </n-space>
          </n-card>
        </n-grid-item>
        <n-grid-item class="h-180px">
          <n-card title="加载中" class="h-full">
            <p class="pb-16px">按钮有加载状态。</p>
            <n-space>
              <n-button :loading="loading" type="primary" @click="startLoading">开始加载</n-button>
              <n-button @click="endLoading">取消加载</n-button>
            </n-space>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import type { ButtonProps } from 'naive-ui';
import { useLoading } from '@/hooks';

interface ButtonDetail {
  id: number;
  props: ButtonProps & { href?: string; target?: string };
  label?: string;
  icon?: string;
}

interface ButtonExample {
  id: number;
  label: string;
  buttons: ButtonDetail[];
  desc?: string;
}

const { loading, startLoading, endLoading } = useLoading();

const buttonExample: ButtonExample[] = [
  {
    id: 0,
    label: '基础',
    buttons: [
      {
        id: 0,
        props: {},
        label: 'Default'
      },
      {
        id: 1,
        props: { type: 'tertiary' },
        label: 'Tertiary'
      },
      {
        id: 2,
        props: { type: 'primary' },
        label: 'Primary'
      },
      {
        id: 3,
        props: { type: 'info' },
        label: 'Info'
      },
      {
        id: 4,
        props: { type: 'success' },
        label: 'Success'
      },
      {
        id: 5,
        props: { type: 'warning' },
        label: 'Warning'
      },
      {
        id: 6,
        props: { type: 'error' },
        label: 'Error'
      }
    ],
    desc: '按钮的 type 分别为 default、primary、info、success、warning 和 error。'
  },
  {
    id: 1,
    label: '次要按钮',
    buttons: [
      {
        id: 0,
        props: { strong: true, secondary: true },
        label: 'Default'
      },
      {
        id: 1,
        props: { strong: true, secondary: true, type: 'tertiary' },
        label: 'Tertiary'
      },
      {
        id: 2,
        props: { strong: true, secondary: true, type: 'primary' },
        label: 'Primary'
      },
      {
        id: 3,
        props: { strong: true, secondary: true, type: 'info' },
        label: 'Info'
      },
      {
        id: 4,
        props: { strong: true, secondary: true, type: 'success' },
        label: 'Success'
      },
      {
        id: 5,
        props: { strong: true, secondary: true, type: 'warning' },
        label: 'Warning'
      },
      {
        id: 6,
        props: { strong: true, secondary: true, type: 'error' },
        label: 'Error'
      },
      {
        id: 7,
        props: { strong: true, secondary: true, round: true },
        label: 'Default'
      },
      {
        id: 8,
        props: { strong: true, secondary: true, round: true, type: 'tertiary' },
        label: 'Tertiary'
      },
      {
        id: 9,
        props: { strong: true, secondary: true, round: true, type: 'primary' },
        label: 'Primary'
      },
      {
        id: 10,
        props: { strong: true, secondary: true, round: true, type: 'info' },
        label: 'Info'
      },
      {
        id: 11,
        props: { strong: true, secondary: true, round: true, type: 'success' },
        label: 'Success'
      },
      {
        id: 12,
        props: { strong: true, secondary: true, round: true, type: 'warning' },
        label: 'Warning'
      },
      {
        id: 13,
        props: { strong: true, secondary: true, round: true, type: 'error' },
        label: 'Error'
      }
    ]
  },
  {
    id: 2,
    label: '次次要按钮',
    buttons: [
      {
        id: 0,
        props: { tertiary: true },
        label: 'Default'
      },
      {
        id: 1,
        props: { tertiary: true, type: 'primary' },
        label: 'Primary'
      },
      {
        id: 2,
        props: { tertiary: true, type: 'info' },
        label: 'Info'
      },
      {
        id: 3,
        props: { tertiary: true, type: 'success' },
        label: 'Success'
      },
      {
        id: 4,
        props: { tertiary: true, type: 'warning' },
        label: 'Warning'
      },
      {
        id: 5,
        props: { tertiary: true, type: 'error' },
        label: 'Error'
      },
      {
        id: 6,
        props: { tertiary: true, round: true },
        label: 'Default'
      },
      {
        id: 7,
        props: { tertiary: true, round: true, type: 'primary' },
        label: 'Primary'
      },
      {
        id: 8,
        props: { tertiary: true, round: true, type: 'info' },
        label: 'Info'
      },
      {
        id: 9,
        props: { tertiary: true, round: true, type: 'success' },
        label: 'Success'
      },
      {
        id: 10,
        props: { tertiary: true, round: true, type: 'warning' },
        label: 'Warning'
      },
      {
        id: 11,
        props: { tertiary: true, round: true, type: 'error' },
        label: 'Error'
      }
    ]
  },
  {
    id: 3,
    label: '次次次要按钮',
    buttons: [
      {
        id: 0,
        props: { quaternary: true },
        label: 'Default'
      },
      {
        id: 1,
        props: { quaternary: true, type: 'primary' },
        label: 'Primary'
      },
      {
        id: 2,
        props: { quaternary: true, type: 'info' },
        label: 'Info'
      },
      {
        id: 3,
        props: { quaternary: true, type: 'success' },
        label: 'Success'
      },
      {
        id: 4,
        props: { quaternary: true, type: 'warning' },
        label: 'Warning'
      },
      {
        id: 5,
        props: { quaternary: true, type: 'error' },
        label: 'Error'
      },
      {
        id: 6,
        props: { quaternary: true, round: true },
        label: 'Default'
      },
      {
        id: 7,
        props: { quaternary: true, round: true, type: 'primary' },
        label: 'Primary'
      },
      {
        id: 8,
        props: { quaternary: true, round: true, type: 'info' },
        label: 'Info'
      },
      {
        id: 9,
        props: { quaternary: true, round: true, type: 'success' },
        label: 'Success'
      },
      {
        id: 10,
        props: { quaternary: true, round: true, type: 'warning' },
        label: 'Warning'
      },
      {
        id: 11,
        props: { quaternary: true, round: true, type: 'error' },
        label: 'Error'
      }
    ]
  },
  {
    id: 4,
    label: '虚线按钮',
    buttons: [
      {
        id: 0,
        props: { dashed: true },
        label: 'Default'
      },
      {
        id: 1,
        props: { dashed: true, type: 'tertiary' },
        label: 'Tertiary'
      },
      {
        id: 2,
        props: { dashed: true, type: 'primary' },
        label: 'Primary'
      },
      {
        id: 3,
        props: { dashed: true, type: 'info' },
        label: 'Info'
      },
      {
        id: 4,
        props: { dashed: true, type: 'success' },
        label: 'Success'
      },
      {
        id: 5,
        props: { dashed: true, type: 'warning' },
        label: 'Warning'
      },
      {
        id: 6,
        props: { dashed: true, type: 'error' },
        label: 'Error'
      }
    ]
  },
  {
    id: 5,
    label: '尺寸',
    buttons: [
      {
        id: 0,
        props: { size: 'tiny', strong: true },
        label: '小小'
      },
      {
        id: 1,
        props: { size: 'small', strong: true },
        label: '小'
      },
      {
        id: 2,
        props: { size: 'medium', strong: true },
        label: '不小'
      },
      {
        id: 3,
        props: { size: 'large', strong: true },
        label: '不不小'
      }
    ]
  },
  {
    id: 6,
    label: '文本按钮',
    buttons: [
      {
        id: 0,
        props: { text: true },
        label: '那车头依然吐着烟',
        icon: 'mdi:train'
      }
    ]
  },
  {
    id: 7,
    label: '自定义标签按钮',
    buttons: [
      {
        id: 0,
        props: {
          text: true,
          tag: 'a',
          href: 'https://github.com/honghuangdc/soybean-admin',
          target: '_blank',
          type: 'primary'
        },
        label: 'soybean-admin'
      }
    ],
    desc: '你可以把按钮渲染成不同的标签，比如 a标签 。'
  },
  {
    id: 8,
    label: '按钮禁用',
    buttons: [
      {
        id: 0,
        props: {
          disabled: true
        },
        label: '不许点'
      }
    ],
    desc: '按钮可以被禁用'
  },
  {
    id: 9,
    label: '图标按钮',
    buttons: [
      {
        id: 0,
        props: {
          secondary: true,
          strong: true
        },
        label: '+100元',
        icon: 'mdi:cash-100'
      },
      {
        id: 0,
        props: {
          iconPlacement: 'right',
          secondary: true,
          strong: true
        },
        label: '+100元',
        icon: 'mdi:cash-100'
      }
    ],
    desc: '在按钮上使用图标。'
  },
  {
    id: 10,
    label: '不同形状按钮',
    buttons: [
      {
        id: 0,
        props: {
          circle: true
        },
        icon: 'mdi:cash-100'
      },
      {
        id: 1,
        props: {
          round: true
        },
        label: '圆角'
      },
      {
        id: 2,
        props: {},
        label: '方'
      }
    ],
    desc: '按钮拥有不同的形状。'
  },
  {
    id: 11,
    label: '透明背景按钮',
    buttons: [
      {
        id: 0,
        props: { ghost: true },
        label: 'Default'
      },
      {
        id: 1,
        props: { ghost: true, type: 'tertiary' },
        label: 'Tertiary'
      },
      {
        id: 2,
        props: { ghost: true, type: 'primary' },
        label: 'Primary'
      },
      {
        id: 3,
        props: { ghost: true, type: 'info' },
        label: 'Info'
      },
      {
        id: 4,
        props: { ghost: true, type: 'success' },
        label: 'Success'
      },
      {
        id: 5,
        props: { ghost: true, type: 'warning' },
        label: 'Warning'
      },
      {
        id: 6,
        props: { ghost: true, type: 'error' },
        label: 'Error'
      }
    ],
    desc: 'Ghost 按钮有透明的背景。'
  },
  {
    id: 12,
    label: '自定义颜色',
    buttons: [
      {
        id: 0,
        props: {
          color: '#8a2be2'
        },
        label: '#8a2be2',
        icon: 'ic:baseline-color-lens'
      },
      {
        id: 1,
        props: {
          color: '#ff69b4'
        },
        label: '#ff69b4',
        icon: 'ic:baseline-color-lens'
      },
      {
        id: 2,
        props: {
          color: '#8a2be2',
          ghost: true
        },
        label: '#8a2be2',
        icon: 'ic:baseline-color-lens'
      },
      {
        id: 3,
        props: {
          color: '#ff69b4',
          ghost: true
        },
        label: '#ff69b4',
        icon: 'ic:baseline-color-lens'
      },
      {
        id: 4,
        props: {
          color: '#8a2be2',
          text: true
        },
        label: '#8a2be2',
        icon: 'ic:baseline-color-lens'
      },
      {
        id: 5,
        props: {
          color: '#ff69b4',
          text: true
        },
        label: '#ff69b4',
        icon: 'ic:baseline-color-lens'
      }
    ],
    desc: '这两个颜色看起来像毒蘑菇。'
  }
];
</script>

<style scoped></style>
