import React from "react";
import { useNavigate } from "react-router-dom";
import Images from "@/shared/assets/images";

const FirstRewardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleReceiveReward = () => {
    navigate("/dice-event"); // "다음 페이지"로 이동
  };

  return (
    <div className="flex flex-col items-center text-white mx-6 relative min-h-screen pb-20">
        {/* 상단 메시지 */}
        <h1 className="text-center mt-36 text-lg font-semibold">
            As a new member, <br />
            you're starting your journey with
        </h1>

        {/* 보상 아이콘 */}
        <div className="mt-6 flex justify-center gap-4">
            <img
                src={Images.firstPoints}
                alt="reward-icon"
                className="w-36 h-36"
            />

            
            <img
                src={Images.firstSL}
                alt="reward-icon"
                className="w-36 h-36"
            />

            
            <img
                src={Images.firstDice}
                alt="reward-icon"
                className="w-36 h-36"
            />
        </div>

        {/* 보상 내역 */}
        <h2 className="text-lg font-semibold mb-4 mt-16 text-left w-full">Your rewards include:</h2>
        <div className="flex flex-col items-start bg-[#1F283C] rounded-2xl px-4 py-6 w-full">
            <div className="flex flex-col gap-2 text-base w-full">
                <div className="flex items-center gap-2">
                    <img
                        src={Images.Calender}
                        alt="calendar-icon"
                        className="w-6 h-6"
                    />
                    <p className="text-left">Daily Attendance : 10,000P</p>
                </div>
                <div className="flex items-center gap-2">
                    <img
                        src={Images.Celebration}
                        alt="gift-icon"
                        className="w-6 h-6"
                    />
                    <p className="text-left">
                        Welcome gift for joining :<br/>
                        7,777 Points + 10SL Tokens + 30 Dices
                    </p>
                </div>
            </div>
        </div>
    {/* 보상 받기 버튼 */}
    <div className="w-full absolute bottom-16 left-1/2 transform -translate-x-1/2">
        <button
            className="w-full py-4 rounded-full text-lg font-semibold"
            onClick={handleReceiveReward}
            style={{backgroundColor: '#0147E5'}}
        >
            Receive Reward & Start Now!
        </button>
      </div>
    </div>
  );
};

export default FirstRewardPage;
