import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Images from '@/shared/assets/images';
import { formatNumber } from '@/shared/utils/formatNumber';
import { useNavigate } from 'react-router-dom';
import { useNavigationStore } from '@/shared/store/navigationStore';

interface MonthlyPrizeProps {
  month: number;              // 예) 1 ~ 12
  prizeType: string;          // 예) 'SL', 'GL' 등
  amount: number;             // 예) 30000
  eventFinishTime: string | null; // 이벤트 종료 시간 (예: '2024-12-31T23:59:59'), 없으면 null
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
    // eventFinishTime이 없으면 표시하지 않음
    if (!eventFinishTime) {
      setTimeLeft('');
      return;
    }

    // 존재한다면, 해당 시간을 이용해 카운트다운 설정
    const endDate = new Date(eventFinishTime);

    const timer = setInterval(() => {
      const now = Date.now();
      const distance = endDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft('Event has ended');
        return;
      }

      // 일/시간/분 계산
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);

      setTimeLeft(`Time Left: ${days}d ${hours}h ${minutes}m`);
    }, 1000);

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
      className="relative z-10 flex flex-col items-center justify-center
                 w-48 h-36 md:w-[340px] md:h-44
                 text-white border-2 border-[#BBA361] rounded-3xl
                 overflow-visible gap-1
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

      {/* 상품 이미지 */}
      <img
        src={Images.PrizeImage}
        alt="token logo"
        className="h-14 mt-2"
      />

      {/* 상품 정보 */}
      <div className="flex flex-col items-center">
        <p className="font-semibold text-base">{prizeType}</p>
        <p className="text-xs font-normal">
          (Approx. ${formatNumber(amount)})
        </p>
      </div>

      {/* 남은 기간 표시 (eventFinishTime이 없으면 표시 안 함) */}
      {timeLeft && (
        <div className="text-[10px] font-light">
          {timeLeft}
        </div>
      )}

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
