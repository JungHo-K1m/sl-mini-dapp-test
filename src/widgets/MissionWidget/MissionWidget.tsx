import React from 'react';
import Images from '@/shared/assets/images';
import { useNavigate } from 'react-router-dom';
import { useNavigationStore } from '@/shared/store/navigationStore';

const MissionWidget: React.FC = () => {
  const navigate = useNavigate();
  const setSelected = useNavigationStore((state) => state.setSelected);

  const handleMissionClick = () => {
    setSelected('/mission');
    navigate('/mission');
  };

  return (
    <div
      className="mt-8 flex flex-col items-center justify-center cursor-pointer"
      onClick={handleMissionClick}
    >
      <h1 className="font-jalnan text-white text-3xl">Mission</h1>
      <div className="flex flex-row items-center justify-between md:justify-around bg-box mt-4 w-[332px] md:w-[595.95px] h-36 md:h-44 text-white px-8">
        <div className="space-y-3">
          <h2 className="font-semibold text-xl">Get More Dice</h2>
          <p className="text-sm">
            Earn extra rolls
            <br />
            to boost your chances!
          </p>
        </div>
        <img
          src={Images.MissionDice}
          className="w-28 h-28 object-cover"
          alt="mission-dice"
        />
      </div>
    </div>
  );
};

export default MissionWidget;
