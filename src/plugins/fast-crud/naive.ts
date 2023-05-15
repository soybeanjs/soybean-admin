import type { App } from 'vue';
import * as NaiveUI from 'naive-ui';

const naive = NaiveUI.create({
  components: [
    NaiveUI.NInput,
    NaiveUI.NButton,
    NaiveUI.NForm,
    NaiveUI.NFormItem,
    NaiveUI.NCheckboxGroup,
    NaiveUI.NCheckbox,
    NaiveUI.NIcon,
    NaiveUI.NDropdown,
    NaiveUI.NTooltip,
    NaiveUI.NTabs,
    NaiveUI.NTabPane,
    NaiveUI.NCard,
    NaiveUI.NRow,
    NaiveUI.NCol,
    NaiveUI.NDrawer,
    NaiveUI.NDrawerContent,
    NaiveUI.NDivider,
    NaiveUI.NSwitch,
    NaiveUI.NBadge,
    NaiveUI.NAlert,
    NaiveUI.NTag,
    NaiveUI.NProgress,
    NaiveUI.NDatePicker,
    NaiveUI.NGrid,
    NaiveUI.NGridItem,
    NaiveUI.NDataTable,
    NaiveUI.NPagination,
    NaiveUI.NSelect,
    NaiveUI.NRadioGroup,
    NaiveUI.NRadio,
    NaiveUI.NInputGroup,
    NaiveUI.NTable,
    NaiveUI.NInputNumber,
    NaiveUI.NLoadingBarProvider,
    NaiveUI.NModal,
    NaiveUI.NUpload,
    NaiveUI.NTree,
    NaiveUI.NSpin,
    NaiveUI.NTimePicker,

    // add by fs
    NaiveUI.NCascader,
    NaiveUI.NRadioButton,
    NaiveUI.NTreeSelect,
    NaiveUI.NImageGroup,
    NaiveUI.NImage,
    NaiveUI.NCollapse,
    NaiveUI.NCollapseItem
  ]
});

export function setupNaive(app: App<Element>) {
  app.use(naive);
}
