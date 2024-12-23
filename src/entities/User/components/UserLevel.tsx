import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Snowfall } from 'react-snowfall';
import Images from '@/shared/assets/images';

const UserLevel: React.FC<{
  userLv: number;
  charactorImageSrc: string;
  exp: number; 
}> = ({ userLv, charactorImageSrc, exp }) => {
  let levelClassName = '';
  let mainColor = '';

  if (userLv >= 1 && userLv <= 4) {
    levelClassName = 'lv1to4-box';
    mainColor = '#dd2726';
  } else if (userLv >= 5 && userLv <= 8) {
    levelClassName = 'lv5to8-box';
    mainColor = '#f59e0b';
  } else if (userLv >= 9 && userLv <= 12) {
    levelClassName = 'lv9to12-box';
    mainColor = '#facc15';
  } else if (userLv >= 13 && userLv <= 16) {
    levelClassName = 'lv13to16-box';
    mainColor = '#22c55e';
  } else if (userLv >= 17 && userLv <= 20) {
    levelClassName = 'lv17to20-box';
    mainColor = '#0147e5';
  }

  const roundedExp = Math.floor(exp);

  const messages = [
    "Hey there, <br/>ready to roll?",
    "Dice are <br/>hot!",
    "Roll it <br/>again!",
    "Let's make a <br/>big move!",
    "All set <br/>to roll?",
    "Keep those <br/>dice rolling!"
  ];

  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let showTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;
  
    const startCycle = () => {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setCurrentMsgIndex(randomIndex);
      setVisible(true);
  
      hideTimer = setTimeout(() => {
        setVisible(false);
      }, 3000);
  
      // 12초 후 다음 메시지
      showTimer = setTimeout(() => {
        startCycle();
      }, 12000);
    };
  
    startCycle();
  
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [messages.length]);

  const currentMessageParts = messages[currentMsgIndex].split('<br/>');

  // 현재 날짜 기준 계절 구분
  const month = new Date().getMonth() + 1; // 1~12
  let images: HTMLImageElement[] | undefined;

  if (month >= 3 && month <= 5) {
    // 봄: 벚꽃잎(예: Images.Spring)
    const springImg = new Image();
    springImg.src = Images.Spring;
    images = [springImg];
  } else if (month >= 6 && month <= 8) {
    // 여름: 잎사귀(예: Images.Summer)
    const summerImg = new Image();
    summerImg.src = Images.Summer;
    images = [summerImg];
  } else if (month >= 9 && month <= 11) {
    // 가을: 낙엽(예: Images.Fall)
    const fallImg = new Image();
    fallImg.src = Images.Fall;
    images = [fallImg];
  } else {
    // 겨울: 이미지 사용 안함(눈송이 기본 형태)
    images = undefined;
  }


  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-3xl w-32 h-36 md:w-[240px] md:h-44 ${levelClassName}`}
      style={{ position: 'relative' }}
    >
      <Snowfall style={{ borderRadius:"24px" }} snowflakeCount={10} images={images} />
      {/* 말풍선 + 문구 */}
      <div className="absolute top-1 right-1 flex justify-end w-full px-1 z-30">
        <AnimatePresence>
          {visible && (
            <motion.div
              key={currentMsgIndex}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="relative px-2 py-1 rounded-2xl shadow-lg font-semibold text-[10px]"
              style={{
                background: '#fff',
                color: '#333',
                textAlign: 'center',
                zIndex: 30,
                overflow: 'visible',
              }}
            >
              {currentMessageParts.map((part, index) => (
                <React.Fragment key={index}>
                  {part}
                  {index < currentMessageParts.length - 1 && <br />}
                </React.Fragment>
              ))}
              <div
                style={{
                  content: '',
                  position: 'absolute' as const,
                  bottom: '-3px',
                  left: '30%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '6px solid #fff',
                }}
              ></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 캐릭터 */}
      <img
        src={charactorImageSrc}
        className="w-24 h-24 md:w-32 md:h-32 z-20"
        alt={`Character Level ${userLv}`}
      />

      <div className="flex flex-row items-center w-full px-4 gap-2">
        <p className="font-semibold text-[8px] md:text-xs">Lv.{userLv}</p>
        <div className="flex flex-row border border-[#F59E0B] rounded-full w-full h-2 relative overflow-hidden">
          {[...Array(100)].map((_, i) => {
            let barColor = '';
            if (i < 20) barColor = '#DD2726';
            else if (i < 40) barColor = '#F59E0B';
            else if (i < 60) barColor = '#FACC15';
            else if (i < 80) barColor = '#22C55E';
            else barColor = '#0147E5';

            return (
              <div
                key={i}
                className={`w-[1%] ${i === 0 ? 'rounded-l-full' : ''} ${i === 99 ? 'rounded-r-full' : ''}`}
                style={{ backgroundColor: i < roundedExp ? barColor : 'transparent' }}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserLevel;
