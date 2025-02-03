import React from "react";
import { useNavigate } from "react-router-dom";
import Images from "@/shared/assets/images";
import { useSound } from "@/shared/provider/SoundProvider";
import { useTranslation } from "react-i18next";
import Audios from "@/shared/assets/audio";


const FirstRewardPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { playSfx } = useSound();

    const handleReceiveReward = () => {
        playSfx(Audios.button_click);
        navigate("/dice-event");
    };

    return (
        <div className="flex flex-col items-center text-white mx-6 relative min-h-screen pb-20">
            {/* 상단 메시지 */}
            <h1 className="text-center mt-36 text-xl font-semibold">
                {t("reward_page.get_started")} <br />
                {t("reward_page.kick_off")}
            </h1>

            {/* 보상 아이콘 */}
            <div className="mt-6 flex justify-center gap-2">
                <img
                    src={Images.firstPoints}
                    alt="reward-icon"
                    className="w-24 h-24"
                />

                <img
                    src={Images.firstSL}
                    alt="reward-icon"
                    className="w-24 h-24"
                />
                
                <img
                    src={Images.firstDice}
                    alt="reward-icon"
                    className="w-24 h-24"
                />
            </div>

            {/* 보상 내역 */}
            <h2 className="text-lg font-medium mb-4 mt-16 text-left w-full">{t("reward_page.your_rewards")}</h2>
            <div className="flex flex-col items-start bg-[#1F283C] rounded-2xl px-4 py-6 w-full">
                <div className="flex flex-col gap-2 text-base w-full">
                    <div className="flex items-center gap-2">
                        <img
                            src={Images.Calender}
                            alt="calendar-icon"
                            className="w-6 h-6"
                        />
                        <p className="text-left text-base font-medium">{t("reward_page.daily_attendance")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <img
                            src={Images.Celebration}
                            alt="gift-icon"
                            className="w-6 h-6"
                        />
                        <p className="text-left text-base font-medium">
                            {t("reward_page.welcom_gift")}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-left ml-9 text-base font-medium">
                            : {t("reward_page.rewards")}
                        </p>
                    </div>
                </div>
            </div>
            {/* 보상 받기 버튼 */}
            <div className="w-full absolute bottom-16 left-1/2 transform -translate-x-1/2">
                <button
                    className="w-full py-4 rounded-full text-base font-medium"
                    onClick={handleReceiveReward}
                    style={{backgroundColor: '#0147E5'}}
                >
                    {t("reward_page.start_now")}
                </button>
            </div>
        </div>
    );
};

export default FirstRewardPage;
