import React, { useState, useEffect } from 'react';
import { TopTitle } from '@/shared/components/ui';
import { motion } from 'framer-motion';
import './SlotMachine.css'; // CSS 파일을 그대로 사용
import Images from '@/shared/assets/images';

const images = [Images.Rock, Images.Scissors, Images.Paper]; // 이미지 경로 배열

const SlotMachine: React.FC = () => {
  const [slotIndex, setSlotIndex] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinSpeed, setSpinSpeed] = useState<number>(100);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isSpinning) {
      interval = setInterval(() => {
        setSlotIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, spinSpeed);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSpinning, spinSpeed]);

  const mockServerRequest = async () => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(Images.SlotScissors); // 가정: 서버에서 '가위' 결과 반환
      }, 500);
    });
  };

  const handleSpin = async () => {
    setIsSpinning(true);
    setSpinSpeed(50); // 애니메이션 속도를 빠르게 설정

    const serverResult = await mockServerRequest();

    setTimeout(() => {
      setIsSpinning(false);
      setSpinSpeed(100);
    }, 500);
  };

  return (
    <div className="flex flex-col mx-6 mb-44 text-white items-center md:mx-28">
      <TopTitle title="Slot Machine" />
      <div className="slot-machine">
        <motion.div
          className="flex flex-col items-center justify-center h-full"
          initial={{ y: 0 }}
          animate={{ y: isSpinning ? ['-100%', '0%'] : '0%' }}
          transition={{
            duration: isSpinning ? 0.1 : 0.5,
            ease: 'linear',
            repeat: isSpinning ? Infinity : 0,
          }}
        >
          {images.map((slot, index) => (
            <div
              key={index}
              className="slot-item"
              style={{
                transform: `rotateX(${
                  index === 1 ? '0' : index === 0 ? '-10' : '10'
                }deg)`, // 3D 회전 효과
                opacity: index === 1 ? 1 : 0.5,
              }}
            >
              <img src={slot} alt={`slot-${index}`} className="slot-image" />{' '}
            </div>
          ))}
        </motion.div>
      </div>
      <button
        onClick={handleSpin}
        className="spin-button"
        disabled={isSpinning}
      >
        {isSpinning ? 'Spinning...' : 'Spin'}
      </button>
    </div>
  );
};

export default SlotMachine;
