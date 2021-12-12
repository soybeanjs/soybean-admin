interface BrowserInfo {
  type: string;
  version: string;
}

/** 获取浏览器版本信息 */
export function getBrowserInfo() {
  const explorer = window.navigator.userAgent.toLowerCase();
  const info: BrowserInfo = {
    type: '',
    version: ''
  };
  function setInfo(data: BrowserInfo) {
    Object.assign(info, data);
  }
  // ie
  if (explorer.indexOf('msie') >= 0) {
    const [version] = explorer.match(/msie ([\d.]+)/) || [''];
    setInfo({ type: 'IE', version });
  }
  // firefox
  if (explorer.indexOf('firefox') >= 0) {
    const [version] = explorer.match(/firefox\/([\d.]+)/) || [''];
    setInfo({ type: 'Firefox', version });
  }
  // Chrome
  if (explorer.indexOf('chrome') >= 0) {
    const [version] = explorer.match(/chrome\/([\d.]+)/) || [''];
    setInfo({ type: 'Chrome', version });
    if (explorer.indexOf('qqbrowser') >= 0) {
      const [version] = explorer.match(/qqbrowser\/([\d.]+)/) || [''];
      setInfo({ type: 'QQ浏览器', version });
    }
  }
  // Opera
  if (explorer.indexOf('opera') >= 0) {
    const [version] = explorer.match(/opera.([\d.]+)/) || [''];
    setInfo({ type: 'Opera', version });
  }
  // Safari
  if (explorer.indexOf('Safari') >= 0) {
    const [version] = explorer.match(/version\/([\d.]+)/) || [''];
    setInfo({ type: 'Safari', version });
  }
  return info;
}
