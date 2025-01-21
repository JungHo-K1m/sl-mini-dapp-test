import React, { useEffect, useRef, useState } from 'react';
import Images from '@/shared/assets/images';
import { useUserStore } from '@/entities/User/model/userModel';
import CountUp from 'react-countup';
import { IoIosArrowRoundUp, IoIosArrowRoundDown } from "react-icons/io";
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from "react-i18next";

interface MyRankingWidgetProps {
  titleHidden?: boolean;
  className?: string;
}

const MyRankingWidget: React.FC<MyRankingWidgetProps> = ({
  className,
  titleHidden = false
}) => {
  // -----------------------
  // 1) 필요한 데이터 가져오기
  // -----------------------
  const { rank, previousRank, starPoints, lotteryCount, slToken } = useUserStore();

  // -----------------------
  // 2) 이전 값 추적 (기존 코드)
  // -----------------------
  const prevRankRef = useRef(rank);
  const prevStarPointsRef = useRef(starPoints);
  const prevLotteryCountRef = useRef(lotteryCount);
  const prevSlTokenRef = useRef(slToken);

  const { t } = useTranslation();

  // -----------------------
  // 3) 상태 관리
  // -----------------------
  // (1) "myRank" | "rankUp" | "rankDown" 표시
  const [showRankText, setShowRankText] = useState<'myRank' | 'rankUp' | 'rankDown'>('myRank');

  // (2) 기존 코드의 애니메이션 트리거 state
  const [rankChanged, setRankChanged] = useState(false);
  const [starChanged, setStarChanged] = useState(false);
  const [lotteryChanged, setLotteryChanged] = useState(false);
  const [tokenChanged, setTokenChanged] = useState(false);

  // -----------------------
  // 4) rank 차이 계산
  // -----------------------
  const rankDifference = previousRank - rank; 
  const isRankUp = rankDifference > 0;    // 랭크 상승 여부
  const isRankDown = rankDifference < 0;  // 랭크 하락 여부

  // -----------------------
  // 5) 값 변경 감지 후 애니메이션 트리거 (기존 코드)
  // -----------------------
  useEffect(() => {
    if (prevRankRef.current !== rank) {
      setRankChanged(true);
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

  // -----------------------
  // 6) Rank Up/Down 텍스트 표시 로직
  // -----------------------
  useEffect(() => {
    if (prevRankRef.current !== rank) {
      if (isRankUp) {
        setShowRankText('rankUp');
      } else if (isRankDown) {
        setShowRankText('rankDown');
      } else {
        setShowRankText('myRank');
      }

      // 1.5초 뒤 다시 "myRank"로 복귀
      const timer = setTimeout(() => {
        setShowRankText('myRank');
      }, 1500);

      prevRankRef.current = rank;
      return () => clearTimeout(timer);
    }
  }, [rank, isRankUp, isRankDown]);

  // -----------------------
  // 7) Framer Motion Variants
  // -----------------------
  // (1) 숫자(랭크) 애니메이션 (기존 코드)
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
      transition: {
        duration: 1.0,
        ease: 'easeInOut'
      }
    }
  };

  // (2) 이미지 애니메이션 (기존 코드)
  const scaleAndGlowImage = {
    initial: { 
      scale: 1, 
      filter: 'brightness(1) drop-shadow(0 0 0px rgba(255,255,255,0))', 
      rotate: 0
    },
    animate: {
      scale: [1, 1.3, 1.1, 1],
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

  // (3) Rank Up/Down 문구 애니메이션 (두 번 튀는 느낌)
  const rankUpDownVariants = {
    initial: { scale: 1, opacity: 0, y: 0 },
    animate: {
      scale: [1, 1.3, 1, 1.3, 1],
      opacity: [0, 1, 1, 1, 0],
      y: [0, -5, 0, -5, 5],
      transition: {
        duration: 1.4,
        ease: 'easeInOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 1,
      y: 10,
      transition: { duration: 0.2 },
    },
  };

  // (4) 기본 My Rank 텍스트에 대한 간단한 fade-in/out
  const myRankVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  // -----------------------
  // 8) 렌더링
  // -----------------------

  return (
    <div
      className={`flex flex-col items-center justify-center text-white cursor-pointer w-full ${className}`}
      role="button"
    >
      {/* 상단의 큰 타이틀 My Rank */}
      <h1 className={`font-jalnan text-3xl ${titleHidden ? "hidden" : "block"}`}>
        {t("dice_event.my_rank")}
      </h1>

      <div className={`bg-box px-8 w-full h-24 md:h-32 flex font-semibold ${titleHidden ? "mt-0" : "mt-4"}`}>
        
        {/* -----------------------------
            여기서부터 내부 "My Rank / Rank Up / Rank Down" 문구
           ----------------------------- */}
        <div className="relative w-[121px] h-full flex flex-col items-center justify-center gap-2">
          {/* 
            1) 이 placeholder <p>로 레이아웃 공간을 항상 확보.
               text-transparent or invisible로 해 두면 실제 텍스트는 안 보이지만
               공간은 유지되어, My Rank가 사라져도 레이아웃이 튀지 않음
          */}
          <p className="text-base font-semibold invisible">
            {t("dice_event.my_rank")}
          </p>

          {/* 
            2) 실제로 보여줄 텍스트들(Rank Up!, Rank Down!, My Rank)은
               아래 absolute 컨테이너 안에서 AnimatePresence로 전환 
          */}
          <div className="absolute top-[18%] md:top-[24%] min-w-32 flex items-center justify-center w-full">
            <AnimatePresence mode="wait">
              {/* (A) 기본 My Rank */}
              {showRankText === 'myRank' && (
                <motion.p
                  key="myRank"
                  className="text-base font-semibold"
                  variants={myRankVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {t("dice_event.my_rank")}
                </motion.p>
              )}

              {/* (B) Rank Up */}
              {showRankText === 'rankUp' && (
                <motion.p
                  key="rankUp"
                  className="font-jalnan text-[#22C55E]"
                  variants={rankUpDownVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  Rank Up!
                </motion.p>
              )}

              {/* (C) Rank Down */}
              {showRankText === 'rankDown' && (
                <motion.p
                  key="rankDown"
                  className="font-jalnan text-[#DD2726]"
                  variants={rankUpDownVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  Rank Down!
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* -----------------------------
              (기존) 랭크 숫자 부분
             ----------------------------- */}
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

          {/* rankDifference 표시 (화살표, +/-) */}
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
        * {t("dice_event.ranking_base")}
      </p>
    </div>
  );
};

export default MyRankingWidget;
