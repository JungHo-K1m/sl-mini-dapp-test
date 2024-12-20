import React, { useEffect, useRef, useState } from 'react';
import Images from '@/shared/assets/images';
import { useUserStore } from '@/entities/User/model/userModel';
import CountUp from 'react-countup';
import { IoIosArrowRoundUp, IoIosArrowRoundDown } from "react-icons/io";
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

interface MyRankingWidgetProps {
  titleHidden?: boolean;
  className?: string;
}

const MyRankingWidget: React.FC<MyRankingWidgetProps> = ({ className, titleHidden = false }) => {
  // useUserStore에서 필요한 데이터 가져오기
  const { rank, previousRank, starPoints, lotteryCount, slToken } = useUserStore();
  
  // 이전 값들을 추적하기 위한 ref
  const prevRankRef = useRef(rank);
  const prevStarPointsRef = useRef(starPoints);
  const prevLotteryCountRef = useRef(lotteryCount);
  const prevSlTokenRef = useRef(slToken);

  // 애니메이션 트리거 state
  const [rankChanged, setRankChanged] = useState(false);
  const [starChanged, setStarChanged] = useState(false);
  const [lotteryChanged, setLotteryChanged] = useState(false);
  const [tokenChanged, setTokenChanged] = useState(false);

  // rank 차이 계산
  const rankDifference = previousRank - rank; // 차이 계산
  const isRankUp = rankDifference > 0; // 랭크 상승 여부 확인

  // 값 변경 감지 후 애니메이션 트리거
  useEffect(() => {
    if (prevRankRef.current !== rank) {
      setRankChanged(true);
      // 일정 시간 뒤에 다시 false로
      const timer = setTimeout(() => setRankChanged(false), 700);
      prevRankRef.current = rank;
      return () => clearTimeout(timer);
    }
  }, [rank]);

  useEffect(() => {
    if (prevStarPointsRef.current !== starPoints) {
      setStarChanged(true);
      const timer = setTimeout(() => setStarChanged(false), 700);
      prevStarPointsRef.current = starPoints;
      return () => clearTimeout(timer);
    }
  }, [starPoints]);

  useEffect(() => {
    if (prevLotteryCountRef.current !== lotteryCount) {
      setLotteryChanged(true);
      const timer = setTimeout(() => setLotteryChanged(false), 700);
      prevLotteryCountRef.current = lotteryCount;
      return () => clearTimeout(timer);
    }
  }, [lotteryCount]);

  useEffect(() => {
    if (prevSlTokenRef.current !== slToken) {
      setTokenChanged(true);
      const timer = setTimeout(() => setTokenChanged(false), 700);
      prevSlTokenRef.current = slToken;
      return () => clearTimeout(timer);
    }
  }, [slToken]);

// 숫자에 대한 애니메이션 variants
const scaleAndGlow = {
  initial: { 
    scale: 1, 
    filter: 'brightness(1)', 
    rotate: 0
  },
  animate: {
    scale: [1, 1.5, 1.2, 1],
    filter: [
      'brightness(1)', 
      'brightness(2)', 
      'brightness(1.5)', 
      'brightness(1)'
    ],
    rotate: [0, 5, -5, 0],
    // 텍스트일 경우, text-shadow로 glow 효과 주기
    transitionEnd: {
      // transitionEnd에서 text-shadow 설정을 통해
      // 애니메이션 후 상태를 조정할 수도 있습니다.
    },
    transition: {
      duration: 1.0,
      ease: 'easeInOut'
    }
  }
};

// 이미지에 대한 애니메이션 variants
const scaleAndGlowImage = {
  initial: { 
    scale: 1, 
    filter: 'brightness(1) drop-shadow(0 0 0px rgba(255,255,255,0))', 
    rotate: 0
  },
  animate: {
    scale: [1, 1.3, 1.1, 1],
    // drop-shadow로 부드러운 빛 번짐 효과
    filter: [
      'brightness(1) drop-shadow(0 0 0px rgba(255,255,255,0))',
      'brightness(2) drop-shadow(0 0 10px rgba(255,255,255,0.8))',
      'brightness(1.5) drop-shadow(0 0 5px rgba(255,255,255,0.5))',
      'brightness(1) drop-shadow(0 0 0px rgba(255,255,255,0))'
    ],
    rotate: [0, 3, -3, 0],
    transition: {
      duration: 1.0,
      ease: 'easeInOut'
    }
  }
};


  return (
    <div
      className={`flex flex-col items-center justify-center text-white cursor-pointer w-full ${className}`}
      role="button"
    >
      <h1 className={`font-jalnan text-3xl ${titleHidden ? "hidden" : "block"}`}>My Rank</h1>
      <div className={`bg-box  px-8 w-full h-24 md:h-32 flex font-semibold ${titleHidden?"mt-0":"mt-4"}`}>
        {/* My Rank 섹션 */}
        <div className="relative w-[121px] h-full flex flex-col items-center justify-center gap-2">
          <p className="text-base font-semibold">My Rank</p>
          <motion.p 
            className="text-2xl text-[#fde047] font-jalnan"
            variants={scaleAndGlow}
            animate={rankChanged ? 'animate' : 'initial'}
          >
            {rank > 9999 ? "9999+" : (
              <CountUp
                start={0}
                end={rank}
                duration={1}
                separator=","
              />
            )}
          </motion.p>
          {rankDifference !== 0 && (
            <div
              className={`absolute flex flex-row items-center -right-2 z-20 ${
                isRankUp ? 'text-[#22C55E] top-[40%] md:top-[40%]' : 'text-[#DD2726] bottom-1 md:bottom-[15%]'
              } text-[12px] font-semibold`}
            >
              <p>{Math.abs(rankDifference)}</p>
              {isRankUp ? (
                <IoIosArrowRoundUp className="w-4 h-4" />
              ) : (
                <IoIosArrowRoundDown className="w-4 h-4" />
              )}
            </div>
          )}
        </div>

        {/* 구분선 */}
        <div className="w-[1px] h-full flex items-center justify-center mx-6">
          <div className="bg-white h-16 w-full"></div>
        </div>

        {/* 스타, 추첨권, SL 토큰 섹션 */}
        <div className="w-full h-full flex flex-row items-center justify-around text-xs">
          {/* 스타 포인트 */}
          <div className="flex flex-col items-center justify-center gap-2">
            <motion.img
              src={Images.Star}
              alt="star"
              className="w-6 h-6"
              variants={scaleAndGlowImage}
              animate={starChanged ? 'animate' : 'initial'}
            />
            <p>
              <CountUp
                start={0}
                end={starPoints}
                duration={1}
                separator=","
              />
            </p>
          </div>

          {/* 추첨권 */}
          <div className="flex flex-col items-center justify-center gap-2">
            <motion.img
              src={Images.LotteryTicket}
              alt="lottery-ticket"
              className="w-6 h-6"
              variants={scaleAndGlowImage}
              animate={lotteryChanged ? 'animate' : 'initial'}
            />
            <p>
              <CountUp
                start={0}
                end={lotteryCount}
                duration={1}
                separator=","
              />
            </p>
          </div>

          {/* SL 토큰 */}
          <div className="flex flex-col items-center justify-center gap-2">
            <motion.img
              src={Images.TokenReward}
              alt="RankingSLToken"
              className="w-6 h-6"
              variants={scaleAndGlowImage}
              animate={tokenChanged ? 'animate' : 'initial'}
            />
            <p>
              <CountUp
                start={0}
                end={slToken}
                duration={1}
                separator=","
                preserveValue={true}
              />
            </p>
          </div>
        </div>
      </div>

      {/* 설명 텍스트 */}
      <p className="flex items-start justify-start w-full font-medium text-xs md:text-sm mt-2 px-2">
        * Rankings are based on Star Points
      </p>
    </div>
  );
};

export default MyRankingWidget;
