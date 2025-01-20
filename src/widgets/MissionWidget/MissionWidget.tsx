import React from 'react';
import Images from '@/shared/assets/images';
import { useNavigate } from 'react-router-dom';
import { useNavigationStore } from '@/shared/store/navigationStore';
import { useTranslation } from "react-i18next";
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";


const MissionWidget: React.FC = () => {
  const navigate = useNavigate();
  const setSelected = useNavigationStore((state) => state.setSelected);
  const { t } = useTranslation();
  const { playSfx } = useSound();
  

  const handleMissionClick = () => {
    playSfx(Audios.button_click);
    setSelected('/mission');
    navigate('/mission');
  };

  return (
    <div
      className="mt-6 flex flex-col items-center justify-center cursor-pointer"
      onClick={handleMissionClick}
    >
      <h1 className="font-jalnan text-white text-3xl">{t("dice_event.mission")}</h1>
      <div className="flex flex-row items-center justify-between md:justify-around bg-box mt-4 w-[332px] md:w-[595.95px] h-36 md:h-44 text-white px-8">
        <div className="space-y-3">
          <h2 className="font-semibold text-xl">{t("dice_event.get_more_dice")}</h2>
          <p className="text-sm">
            {t("dice_event.Earn_extra_rolls")}
            <br />
            {t("dice_event.to_boost_your_chances")}
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
