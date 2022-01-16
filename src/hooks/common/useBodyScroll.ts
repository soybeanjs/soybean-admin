interface ScrollBodyStyle {
  overflow: string;
  paddingRight: string;
}

/**
 * body标签滚动
 * @param duration - 显示滚动条的延迟时间
 */
export default function useBodyScroll(duration = 300) {
  const defaultStyle: ScrollBodyStyle = {
    overflow: '',
    paddingRight: ''
  };
  function getInitBodyStyle() {
    const { overflow, paddingRight } = document.body.style;
    Object.assign(defaultStyle, { overflow, paddingRight });
  }
  function setScrollBodyStyle() {
    document.body.style.paddingRight = `${window.innerWidth - document.body.clientWidth}px`;
    document.body.style.overflow = 'hidden';
  }
  function resetScrollBodyStyle() {
    document.body.style.overflow = defaultStyle.overflow;
    document.body.style.paddingRight = defaultStyle.paddingRight;
  }

  /**
   * 处理body的滚动条
   * @param hideScroll - 禁止滚动
   */
  function scrollBodyHandler(hideScroll: boolean) {
    if (hideScroll) {
      setScrollBodyStyle();
    } else {
      setTimeout(() => {
        resetScrollBodyStyle();
      }, duration);
    }
  }

  getInitBodyStyle();

  return {
    scrollBodyHandler
  };
}
