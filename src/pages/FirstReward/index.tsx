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
        Save the Life! <br />
        Create Your Journey
      </h1>

      {/* 메인 보상 메시지 */}
      <p className="text-center mt-6 text-sm">
        As a new member, <br />
        you're starting your journey with
      </p>

      {/* 보상 아이콘 */}
      <div className="mt-6">
        <img
          src={Images.FirstReward} // 아이콘을 대체하세요
          alt="reward-icon"
          className="w-36 h-36"
        />
      </div>

      {/* 보상 내역 */}
      <div className="flex flex-col items-center bg-[#1F283C] rounded-2xl px-4 py-6 mt-10 w-full">
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
      <button
        className="bg-blue-500 hover:bg-blue-600 rounded-full text-white font-semibold text-lg py-3 px-6 mt-10"
        onClick={handleReceiveReward}
      >
        Receive Reward & Start Now!
      </button>
    </div>
  );
};

export default FirstRewardPage;
