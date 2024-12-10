import React from "react";
import { useNavigate } from "react-router-dom";
import Images from "@/shared/assets/images";

const FirstRewardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleReceiveReward = () => {
    navigate("/dice-event"); // "다음 페이지"로 이동
  };

  return (
    <div className="flex flex-col items-center text-white mx-6 h-screen overflow-x-hidden">
        {/* 상단 메시지 */}
        <h1 className="text-center mt-12 text-lg font-semibold">
            As a new member, <br />
            you're starting your journey with
        </h1>

        {/* 보상 아이콘 */}
        <div className="mt-6">
            <img
                src={Images.FirstReward} // 아이콘을 대체하세요
                alt="reward-icon"
                className="w-36 h-36"
            />
        </div>

        {/* 보상 내역 */}
        <div className="flex flex-col items-center bg-[#1F283C] rounded-2xl px-4 py-6 mt-16 w-full">
            <h2 className="text-base font-semibold mb-4">Your rewards include:</h2>
            <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                    <img
                        src={Images.Calender}// 아이콘을 대체하세요
                        alt="calendar-icon"
                        className="w-6 h-6"
                    />
                    <p>Daily Attendance : 10,000P</p>
                </div>
                <div className="flex items-center gap-2">
                    <img
                        src={Images.Celebration} // 아이콘을 대체하세요
                        alt="gift-icon"
                        className="w-6 h-6"
                    />
                    <p>Welcome gift for joining : 777P</p>
                </div>
            </div>
        </div>

    {/* 보상 받기 버튼 */}
    <div className="w-full max-w-md absolute bottom-16 left-1/2 transform -translate-x-1/2">
        <button
            className="bg-blue-500 text-white rounded-full text-lg font-semibold py-3 px-6 mt-10"
            onClick={handleReceiveReward}
        >
            Receive Reward & Start Now!
        </button>
      </div>
    </div>
  );
};

export default FirstRewardPage;
