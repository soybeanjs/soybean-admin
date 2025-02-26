<script setup lang="ts">
import * as ww from '@wecom/jssdk';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRouterPush } from '@/hooks/common/router';

defineOptions({
  name: 'WecomLogin'
});

const weComCodeLogin = ref();

// 定义appid
const wecomInfo: Api.Auth.WecomInfo = reactive({
  appid: '',
  agent_id: '',
  redirect_uri: '',
  state: ''
});

const { toggleLoginModule } = useRouterPush();

// 初始化登录组件
const wwLogin = ww.createWWLoginPanel({
  el: '#ww_login',
  params: {
    login_type: ww.WWLoginType.corpApp,
    appid: wecomInfo.appid, // 企业微信的公司ID
    agentid: wecomInfo.agent_id, // 企业微信自建应用ID
    redirect_uri: wecomInfo.redirect_uri,
    state: wecomInfo.state,
    panel_size: ww.WWLoginPanelSizeType.small,
    redirect_type: ww.WWLoginRedirectType.callback
  },
  // 获取企业微信桌面端登录状态的回调函数
  // onCheckWeComLogin({ isWeComLogin }) {
  //   authStore.isWechatLogin = isWeComLogin;
  // },
  onLoginSuccess({ code }: any) {
    // 把获取到的code传递给后端，并在后端获取用户的详细信息返回
    // authStore.wecomLogin(code).then(() => {
    // 登录成功后跳转到首页
    // router.push("/");
    // })
    window.$message?.success(code);
  },
  onLoginFail(err: any) {
    window.$message?.error(err.message);
  }
});

// 确认按钮的回调函数
function handleSubmit() {
  window.$message?.warning('扫码成功即可登录，无需点击该按钮');
}

// 初始化登录组件参数
// async function initLoginParams() {
//   // 向后端获取企业微信扫码组件需要的必要信息
//   const { data: info, error } = await fetchGetWecomInfo();
//   if (!error) {
//     wecomInfo.appid = info.appid;
//     wecomInfo.agent_id = info.agent_id;
//     wecomInfo.redirect_uri = info.redirect_uri;
//     wecomInfo.state = info.state;
//   }
// }

onMounted(async () => {
  // await initLoginParams();
  weComCodeLogin.value.appendChild(wwLogin.el);
});
onUnmounted(() => {
  wwLogin.unmount();
});
</script>

<template>
  <NForm size="large" :show-label="false">
    <NFormItem path="code">
      <div ref="weComCodeLogin" class="w-full flex-x-center" />
    </NFormItem>
    <NSpace vertical :size="18" class="mt-5 w-full">
      <NButton type="primary" size="large" round block @click="handleSubmit">
        {{ $t('common.confirm') }}
      </NButton>
      <NButton size="large" round block @click="toggleLoginModule('pwd-login')">
        {{ $t('page.login.common.back') }}
      </NButton>
    </NSpace>
  </NForm>
</template>

<style scoped></style>
