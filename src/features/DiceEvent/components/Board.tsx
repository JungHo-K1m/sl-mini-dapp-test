import React from 'react';
import { motion } from 'framer-motion';
import calculateTilePosition from '@/shared/utils/calculateTilePosition';

interface BoardProps {
  position: number;
  charactorImageSrc: string;
  initialX: number;
  initialY: number;
  delta: number;
}

const Board: React.FC<BoardProps> = ({
  position,
  charactorImageSrc,
  initialX,
  initialY,
  delta,
}) => {
  const { x, y } = calculateTilePosition(position, initialX, initialY, delta);

  return (
    <motion.div
      className={`absolute z-40`} // selectingTile 상태에 따라 z-index 조정
      initial={{ x: initialX, y: initialY }}
      animate={{ x, y }}
      transition={{
        x: { type: 'spring', stiffness: 300, damping: 25 },
        y: { type: 'spring', stiffness: 300, damping: 15 },
      }}
    >
      <div
        className="absolute w-full h-full rounded-full bottom-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: '70%',
          height: '10%',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '50%',
        }}
      ></div>
      <img
        src={charactorImageSrc}
        alt="charactorImageSrc"
        className="w-12 h-12 md:w-20 md:h-20"
      />
    </motion.div>
  );
};

export default Board;
