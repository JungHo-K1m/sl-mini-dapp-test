import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Images from '@/shared/assets/images';
import { formatNumber } from '@/shared/utils/formatNumber';
import { useNavigate } from 'react-router-dom';
import { useNavigationStore } from '@/shared/store/navigationStore';

interface MonthlyPrizeProps {
  month: number;            // 1 ~ 12
  prizeType: string;        // 예: 'SL', 'GL'
  amount: number;           // 예: 30000
  eventFinishTime: string;  // 이벤트 종료 시간 (예: '2024-12-31T23:59:59')
}

const MonthlyPrize: React.FC<MonthlyPrizeProps> = ({
  month,
  prizeType,
  amount,
  eventFinishTime,
}) => {
  const navigate = useNavigate();
  const setSelected = useNavigationStore((state) => state.setSelected);

  // 월 이름
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // 남은 시간 표시용 state
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const endDate = new Date(eventFinishTime);

    // 즉시 계산 + 1초 간격 갱신
    const updateCountdown = () => {
      const now = Date.now();
      const distance = endDate.getTime() - now;

      if (distance < 0) {
        setTimeLeft('Event has ended');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);

      setTimeLeft(`Time Left: ${days}d ${hours}h ${minutes}m`);
    };

    // 컴포넌트 마운트 시 1회 즉시 계산
    updateCountdown();

    // 이후 1초마다 갱신
    const timer = setInterval(updateCountdown, 1000);

    // 언마운트 시 인터벌 해제
    return () => clearInterval(timer);
  }, [eventFinishTime]);

  // 클릭 -> /reward
  const handleRankingClick = () => {
    setSelected('/reward');
    if (window.location.pathname !== '/reward') {
      navigate('/reward');
    }
  };

  return (
    <div
      onClick={handleRankingClick}
      className="
        relative z-10 flex flex-col items-center justify-center
        w-48 h-36 md:w-[340px] md:h-44
        text-white border-2 border-[#BBA361] rounded-3xl
        overflow-visible gap-1 bg-neutral-900 
      "
    >
      {/* 월 라벨 */}
      <div className="
        absolute h-7 w-20 rounded-full border-2 border-[#FBDF86]
        bg-white flex items-center justify-center text-xs
        -top-4 text-black z-50 font-medium box-border
        left-14 md:left-32
      ">
        {monthNames[month - 1]}
      </div>

      {/* 상품 이미지 (Framer Motion 적용) */}
      <motion.img
        src={Images.PrizeImage}
        alt="token logo"
        className="h-14 mt-2"
        animate={{
          // 살짝 커졌다 돌아오는 확대 애니메이션
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 2.5,       // 한 사이클 2.5초
          repeat: Infinity,    // 무한 반복
          repeatType: 'reverse', // 앞뒤로 반복 (1->1.08->1->1.08...)
        }}
      />

      {/* 상품 정보 */}
      <div className="flex flex-col items-center">
        <p className="font-semibold text-base">{prizeType}</p>
        <p className="text-xs font-normal">
          (Approx. ${formatNumber(amount)})
        </p>
      </div>

      {/* 남은 기간 표시 (카운트다운) */}
      <div className="text-[10px] font-light">
        {timeLeft}
      </div>

      {/* 첫 번째 이미지 애니메이션 */}
      <motion.img
        src={Images.GiveawayEffect}
        alt="giveaway"
        className="absolute w-32 z-30 -top-[20%] -right-[12%]
                   md:right-[12%] md:-top-[10%]"
        animate={{
          opacity: [1, 0, 1],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      {/* 두 번째 이미지 애니메이션 */}
      <motion.img
        src={Images.GiveawayEffect}
        alt="giveaway"
        className="absolute w-32 z-30 -bottom-[0%] -left-[12%]
                   md:left-[12%] md:bottom-[12%]"
        animate={{
          opacity: [1, 0.2, 1],
          y: [0, 10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
    </div>
  );
};

export default MonthlyPrize;
