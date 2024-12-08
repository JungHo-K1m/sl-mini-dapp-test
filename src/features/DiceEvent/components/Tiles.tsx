import React from 'react';
import Images from '@/shared/assets/images';

const StarTile: React.FC<{ count: number }> = ({ count }) => (
  <div className="flex flex-col gap-1 items-center">
    <img src={Images.Star} alt="star" className="h-6 w-6 md:h-10 md:w-10" />
    <p>x {count}</p>
  </div>
);

const DiceTile: React.FC<{ count: number }> = ({ count }) => (
  <div className="flex flex-col gap-1 items-center">
    <img src={Images.Dice} alt="dice" className="h-6 w-6 md:h-10 md:w-10" />
    <p>x {count}</p>
  </div>
);

const AirplaneTile: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex flex-col gap-1 items-center">
    <img
      src={Images.Airplane}
      alt="airplane"
      className=" max-h-6 md:max-h-10"
    />
    <p className="text-[10px] md:text-sm">{text}</p>
  </div>
);

export { StarTile, DiceTile, AirplaneTile };
