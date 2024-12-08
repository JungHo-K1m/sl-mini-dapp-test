// src/components/ui/LoadingSpinner.tsx

import React from 'react';

interface LoadingSpinnerProps {
  /** 스피너의 크기를 설정합니다. 기본값은 16px입니다. */
  size?: number;
  /** 스피너의 색상을 설정합니다. 기본값은 흰색입니다. */
  color?: string;
  /** 스피너가 회전하는 속도를 설정합니다. 초 단위로 설정하며, 기본값은 1초입니다. */
  duration?: number;
  /** 추가적인 CSS 클래스를 적용할 수 있습니다. */
  className?: string;
  /** 접근성을 위한 aria-label을 설정합니다. */
  ariaLabel?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 16,
  color = '#ffffff',
  duration = 1,
  className = '',
  ariaLabel = 'Loading',
}) => {
  return (
    <div
      className={`flex justify-center items-center h-screen ${className}`}
      aria-label={ariaLabel}
      role="status"
    >
      <div
        className="animate-spin rounded-full border-t-4 border-b-4"
        style={{
          width: `${size * 4}px`,
          height: `${size * 4}px`,
          borderTopColor: color,
          borderBottomColor: color,
          animationDuration: `${duration}s`,
        }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
