import { useEffect, useState } from 'react';

/**
 * 实时监听媒体查询的 Hook。
 * - 初始值在首次渲染时快照（避免 SSR / 首帧抖动）；
 * - 挂载后监听 change 事件，系统偏好中途变化时同步更新；
 * - 全站各组件统一使用本 Hook 处理「减少动态效果」「hover 能力」等系统偏好，
 *   避免出现「有的组件实时响应、有的只认快照」的行为不一致。
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener('change', onChange);

    return () => media.removeEventListener('change', onChange);
  }, [query]);

  return matches;
};
