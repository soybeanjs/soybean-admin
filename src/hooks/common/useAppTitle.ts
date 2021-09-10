/** 项目名称 */
export default function useAppTitle() {
  const title = import.meta.env.VITE_APP_TITLE as string;

  return title;
}
