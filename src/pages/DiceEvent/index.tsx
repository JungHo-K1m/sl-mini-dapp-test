// src/pages/DiceEventPage.tsx

import React, { useEffect, useState } from "react";
import UserLevel from "@/entities/User/components/UserLevel";
import "@/features/DiceEvent/DiceEvent.css";
import Images from "@/shared/assets/images";
import { MonthlyPrize } from "@/entities/MonthlyPrize";
import Attendance from "@/widgets/Attendance";
import MyRankingWidget from "@/widgets/MyRanking/MyRankingWidget";
import MissionWidget from "@/widgets/MissionWidget/MissionWidget";
import useDiceGame from "./useDiceGame"; // 수정된 import
import GameBoard from "./GameBoard";
import { Board } from "@/features/DiceEvent";
import RPSGame from "../RPSGame";
import SpinGame from "../SpinGame";
import { useUserStore } from "@/entities/User/model/userModel";
import LoadingSpinner from "@/shared/components/ui/loadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {formatNumber}  from "@/shared/utils/formatNumber";
import LevelRewards from "@/widgets/LevelRewards";

const DiceEventPage: React.FC = () => {
  const {
    fetchUserData,
    isLoading,
    error,
    userLv,
    characterType,
    position,
    monthlyPrize,
    isAuto, // isAuto 상태 가져오기
  } = useUserStore();

  const game = useDiceGame();
  const [initialX, setInitialX] = useState<number>(140);
  const [initialY, setInitialY] = useState<number>(474);
  const [delta, setDelta] = useState<number>(56);

  // 캐릭터 이미지 결정 로직 추가
  const getCharacterImageSrc = () => {
    // 레벨에 따른 인덱스 계산
    const index = Math.floor((userLv - 1) / 2);

    // 캐릭터 타입에 따른 이미지 배열
    const catImages = [
      Images.CatLv1to2,
      Images.CatLv3to4,
      Images.CatLv5to6,
      Images.CatLv7to8,
      Images.CatLv9to10,
      Images.CatLv11to12,
      Images.CatLv13to14,
      Images.CatLv15to16,
      Images.CatLv17to18,
      Images.CatLv19to20,
    ];

    const dogImages = [
      Images.DogLv1to2,
      Images.DogLv3to4,
      Images.DogLv5to6,
      Images.DogLv7to8,
      Images.DogLv9to10,
      Images.DogLv11to12,
      Images.DogLv13to14,
      Images.DogLv15to16,
      Images.DogLv17to18,
      Images.DogLv19to20,
    ];

    if (characterType === "cat") {
      return catImages[index] || catImages[catImages.length - 1];
    } else {
      return dogImages[index] || dogImages[dogImages.length - 1];
    }
  };

  const charactorImageSrc = getCharacterImageSrc();

  useEffect(() => {
    return () => {
      game.setIsAuto(false);
    };
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setInitialX(250);
        setInitialY(730);
        setDelta(100);
      } else {
        setInitialX(140);
        setInitialY(474);
        setDelta(56);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error loading data: {error}</div>;
  }

  // handleRPSGameEnd 함수 수정
  const handleRPSGameEnd = (result: "win" | "lose", winnings: number) => {
    console.log(`RPS Game Ended: ${result}, Winnings: ${winnings}`);
    // 사용자 데이터 다시 가져오기
    fetchUserData();
    // useDiceGame의 handleRPSGameEnd 호출하여 상태 업데이트
    game.handleRPSGameEnd(result, winnings);
  };

  return (
    <div className="flex flex-col items-center relative w-full h-full overflow-x-hidden">
      {game.isRPSGameActive ? (
        <RPSGame
          onGameEnd={handleRPSGameEnd}
          onCancel={() => handleRPSGameEnd("lose", 0)}
        />
      ) : game.isSpinGameActive ? (
        <SpinGame onSpinEnd={game.handleSpinGameEnd} />
      ) : (
        <>
          <div className="w-full flex justify-center mb-4 mt-8 gap-4">
            <Dialog>
              <DialogTrigger>
                <UserLevel
                  userLv={userLv}
                  charactorImageSrc={charactorImageSrc}
                />
              </DialogTrigger>
              <DialogContent className=" bg-[#21212F] border-none rounded-3xl text-white h-svh overflow-x-hidden font-semibold  overflow-y-auto max-w-[90%] md:max-w-lg max-h-[80%]">
                <LevelRewards />
              </DialogContent>
            </Dialog>

            <MonthlyPrize
              month={monthlyPrize.month}
              prizeType={monthlyPrize.prizeType}
              amount={monthlyPrize.amount}
            />
          </div>
          <GameBoard
            position={position}
            selectingTile={game.selectingTile}
            handleTileClick={game.handleTileClick}
            gaugeValue={game.gaugeValue}
            diceCount={game.diceCount}
            showDiceValue={game.showDiceValue}
            rolledValue={game.rolledValue}
            buttonDisabled={game.buttonDisabled}
            diceRef={game.diceRef}
            handleRollComplete={game.handleRollComplete}
            reward={game.reward}
            isHolding={game.isHolding}
            handleMouseDown={game.handleMouseDown}
            handleMouseUp={game.handleMouseUp}
            isLuckyVisible={game.isLuckyVisible} // "LUCKY" 상태 전달
          />
          {game.selectingTile &&
            !isAuto && ( // isAuto가 false일 때만 모달 표시
              <div className="absolute md:-top-40 -top-20 left-0 w-full h-full flex justify-center items-center z-20">
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-75"></div>
                <div className="text-white text-lg z-30 flex flex-col items-center justify-center mb-96 md:mb-[442px] font-semibold md:text-xl">
                  <img
                    src={Images.Airplane}
                    alt="airplane"
                    className="h-20 md:h-28"
                  />
                  Select a tile to move
                </div>
              </div>
            )}
          <Board
            position={position}
            charactorImageSrc={charactorImageSrc}
            initialX={initialX}
            initialY={initialY}
            delta={delta}
          />
          <br />
          
      
          <MyRankingWidget  />
      
        
          <br />
          <Attendance />
          <MissionWidget />
          <br /> <br /> <br />
          <br />
          <br />
          <div className="hidden md:block md:mb-40"> &nbsp;</div>
        </>
      )}
    </div>
  );
};

export default DiceEventPage;
