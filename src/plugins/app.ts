import { h } from 'vue';
import { NButton } from 'naive-ui';
import { $t } from '../locales';

export function setupAppVersionNotification() {
  document.addEventListener('visibilitychange', async () => {
    const buildTime = await getHtmlBuildTime();

    if (!import.meta.env.DEV && buildTime !== BUILD_TIME && document.visibilityState === 'visible') {
      const n = window.$notification?.create({
        title: $t('system.updateTitle'),
        content: $t('system.updateContent'),
        action() {
          return h('div', { style: { display: 'flex', justifyContent: 'end', gap: '12px', width: '325px' } }, [
            h(
              NButton,
              {
                onClick() {
                  n?.destroy();
                }
              },
              () => $t('system.updateCancel')
            ),
            h(
              NButton,
              {
                type: 'primary',
                onClick() {
                  location.reload();
                }
              },
              () => $t('system.updateConfirm')
            )
          ]);
        }
      });
    }
  });
}

async function getHtmlBuildTime() {
  const baseURL = import.meta.env.VITE_BASE_URL;

  const res = await fetch(`${baseURL}index.html`);

  const html = await res.text();

  const match = html.match(/<meta name="buildTime" content="(.*)">/);

  const buildTime = match?.[1] || '';

  return buildTime;
}
