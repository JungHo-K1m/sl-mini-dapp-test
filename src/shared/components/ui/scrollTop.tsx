import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // 페이지 이동 후 화면을 상단으로 고정
  }, [pathname]);

  return null;
};

export default ScrollToTop;
