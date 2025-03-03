// src/pages/DiceEventPage.tsx
import React, { useEffect, useState, useRef } from "react";
import UserLevel from "@/entities/User/components/UserLevel";
import "@/features/DiceEvent/DiceEvent.css";
import Images from "@/shared/assets/images";
import { MonthlyPrize } from "@/entities/MonthlyPrize";
import Attendance from "@/widgets/Attendance";
import MyRankingWidget from "@/widgets/MyRanking/MyRankingWidget";
import MissionWidget from "@/widgets/MissionWidget/MissionWidget";
import useDiceGame from "./useDiceGame";
import GameBoard from "./GameBoard";
import { Board } from "@/features/DiceEvent";
import RPSGame from "../RPSGame";
import SpinGame from "../SpinGame";
import { useUserStore } from "@/entities/User/model/userModel";
import LoadingSpinner from "@/shared/components/ui/loadingSpinner";
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogTrigger } from "@/shared/components/ui";
import { formatNumber } from "@/shared/utils/formatNumber";
import LevelRewards from "@/widgets/LevelRewards";
import LeaderBoard from "@/widgets/LeaderBoard";
import { HiX } from "react-icons/hi";
import { DialogClose } from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";
import getRewardPoints from "@/entities/Mission/api/fromRewardPoint";

const levelRewards = [
  // 2~9 레벨 보상 예시
  { level: 2, dice: 10, points: 1000 },
  { level: 3, dice: 15, points: 2000 },
  { level: 4, dice: 20, points: 3000 },
  { level: 5, dice: 30, points: 5000, tickets: 3 },
  { level: 6, dice: 40, points: 7000, tickets: 3 },
  { level: 7, dice: 50, points: 10000, tickets: 3 },
  { level: 8, dice: 60, points: 15000, tickets: 4 },
  { level: 9, dice: 70, points: 20000, tickets: 5 },

  // 10~14 레벨 보상 예시
  { level: 10, dice: 100, points: 30000, tickets: 7 },
  { level: 11, dice: 100, points: 30000, tickets: 7 },
  { level: 12, dice: 100, points: 30000, tickets: 7 },
  { level: 13, dice: 100, points: 30000, tickets: 7 },
  { level: 14, dice: 100, points: 30000, tickets: 7 },

  // 15~19 레벨 보상 예시
  { level: 15, dice: 200, points: 50000, tickets: 15 },
  { level: 16, dice: 200, points: 50000, tickets: 15 },
  { level: 17, dice: 200, points: 50000, tickets: 15 },
  { level: 18, dice: 200, points: 50000, tickets: 15 },
  { level: 19, dice: 200, points: 50000, tickets: 15 },

  // 20 레벨 보상 예시
  { level: 20, dice: 500, points: 100000, tickets: 100 },
];

const DiceEventPage: React.FC = () => {
  const {
    fetchUserData,
    isLoading,
    error,
    userLv,
    characterType,
    position,
    monthlyPrize,
    isAuto,
    pet,
  } = useUserStore();

  const game = useDiceGame();
  const { playSfx } = useSound();
  const [initialX, setInitialX] = useState<number>(140);
  const [initialY, setInitialY] = useState<number>(474);
  const [delta, setDelta] = useState<number>(56);
  const { t } = useTranslation();

  // 랭킹 보상 팝업 표시를 위한 상태
  const [showRankingModal, setShowRankingModal] = useState<boolean>(false);

  // AirDrop 팝업 표시를 위한 상태
  const [showAirDrop, setShowAirDrop] = useState<boolean>(false);

  // URL 보상 팝업 표시를 위한 상태
  const [showUrlReward, setShowUrlReward] = useState<boolean>(false);
  

  // 레벨 업 시 팝업 표시를 위한 상태
  const [showLevelUpDialog, setShowLevelUpDialog] = useState<boolean>(false);
  const [prevLevel, setPrevLevel] = useState<number>(userLv);

  // 레벨 업 감지: userLv가 이전 레벨보다 커질 때만 팝업 표시
  useEffect(() => {
    if (userLv > prevLevel) {
      playSfx(Audios.level_up);
      setShowLevelUpDialog(true);
    }
    setPrevLevel(userLv);
  }, [userLv, prevLevel]);


  // 보상 링크를 통한 접근 여부 확인 및 보상 API 호출
  useEffect(() => {
    const referralCode = localStorage.getItem("referralCode");
    if (referralCode === "from-dapp-portal") {
      console.log("[DiceEventPage] Dapp Portal referral detected. Calling reward API...");
      getRewardPoints()
        .then((message) => {
          console.log("[DiceEventPage] Reward API response:", message);
          // 응답 메시지가 "Success"인 경우에만 다이얼로그 표시
          if (message === "Success") {
            setShowUrlReward(true);
          } else if (message === "Already Rewarded") {
            console.log("[DiceEventPage] Reward already claimed.");
          }
          // 중복 호출 방지를 위해 referralCode 삭제
          localStorage.removeItem("referralCode");
        })
        .catch((error) => {
          console.error("[DiceEventPage] Reward API error:", error);
        });
    }
  }, []);



  // 현재 레벨 보상 찾기
  const currentReward = levelRewards.find((r) => r.level === userLv);

  const getCharacterImageSrc = () => {
    const index = Math.floor((userLv - 1) / 2);

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

  const getLevelEffectImageSrc = () => {
    const level = Math.min(userLv, 20);
    const effectImageKey = `LevelEffect${level}` as keyof typeof Images;
    return Images[effectImageKey] || Images.LevelEffect1;
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
    return <LoadingSpinner className="h-screen"/>;
  }

  if (error) {
    return <div>Error loading data: {error}</div>;
  }

  const handleRPSGameEnd = (result: "win" | "lose", winnings: number) => {
    console.log(`RPS Game Ended: ${result}, Winnings: ${winnings}`);
    fetchUserData();
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
              <DialogTrigger onClick={() => playSfx(Audios.button_click)}>
                <UserLevel
                  userLv={userLv}
                  charactorImageSrc={charactorImageSrc}
                  exp={pet.exp}
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
              eventFinishTime={monthlyPrize.eventFinishTime}
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
            isLuckyVisible={game.isLuckyVisible}
            rollDice={game.rollDice}
          />
          {game.selectingTile && !isAuto && (
            <div className="absolute md:-top-40 -top-20 left-0 w-full h-full flex justify-center items-center z-20">
              <div className="absolute top-0 left-0 w-full h-full bg-black opacity-75"></div>
              <div className="text-white text-lg z-30 flex flex-col items-center justify-center mb-96 md:mb-[442px] font-semibold md:text-xl">
                <img
                  src={Images.Airplane}
                  alt="airplane"
                  className="h-20 md:h-28"
                />
                {t("dice_event.select_tile")}
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
          <Dialog>
            <DialogTrigger className="w-full flex justify-center" onClick={() => playSfx(Audios.button_click)}>
              <MyRankingWidget className="max-w-[332px] md:max-w-full" titleHidden={true} />
            </DialogTrigger>
            <DialogContent className=" flex flex-col bg-[#21212F] border-none rounded-3xl text-white h-svh overflow-x-hidden font-semibold  overflow-y-auto  max-h-[80%]">
              <DialogHeader className="flex w-full items-end">
                <DialogClose>
                <HiX className="w-5 h-5" />
                </DialogClose>
              </DialogHeader>
              <MyRankingWidget />
              <LeaderBoard />
            </DialogContent>
          </Dialog>

          <Attendance customWidth="w-[332px] md:w-[595.95px]"  />
          <MissionWidget />

          {/* 레벨업 시 다이얼로그: 이전보다 레벨이 올라갔을 때만 표시 */}
          <Dialog open={showLevelUpDialog}>
            <DialogContent className=" bg-[#21212F] border-none rounded-3xl text-white h-svh overflow-x-hidden font-semibold overflow-y-auto max-w-[90%] md:max-w-lg max-h-[80%]">
              <div className="flex flex-col items-center justify-around">
                <div className=" flex flex-col items-center gap-2">
                  <h1 className=" font-jalnan text-5xl text-[#FDE047]">
                    {t("dice_event.level_up")}
                  </h1>
                  <img
                    src={getLevelEffectImageSrc()}
                    alt="levelupEffect"
                    className=" w-36 h-36"
                  />
                </div>
                <div className="flex flex-col gap-6">
                  <p className="font-jalnan text-center">{t("dice_event.grap_prize")}</p>
                  {currentReward && (
                    <div className="flex flex-row items-center gap-2">
                      <div className="box-bg rounded-xl w-16 h-16 border-2 border-[#2660f4] flex flex-col items-center gap-2 justify-center ">
                        <img src={Images.Dice} alt="dice" className="w-6 h-6" />
                        <p className=" font-semibold text-xs">
                          +{currentReward.dice}
                        </p>
                      </div>
                      <div className="box-bg rounded-xl w-16 h-16 border-2 border-[#2660f4] flex flex-col items-center gap-2 justify-center ">
                        <img src={Images.Star} alt="star" className="w-6 h-6" />
                        <p className=" font-semibold text-xs">
                          +{formatNumber(currentReward.points)}
                        </p>
                      </div>
                      {currentReward.tickets && (
                        <div className="box-bg rounded-xl w-16 h-16 border-2 border-[#2660f4] flex flex-col items-center gap-2 justify-center ">
                          <img
                            src={Images.LotteryTicket}
                            alt="rapple"
                            className="w-6 h-6"
                          />
                          <p className=" font-semibold text-xs">
                            +{currentReward.tickets}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowLevelUpDialog(false)}
                  className="bg-[#0147E5] font-medium rounded-full w-40 h-14"
                >
                  {t("character_page.Continue")}
                </button>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* 지난 달 보상 다이얼로그 */}
          <Dialog open={showRankingModal}>
            <DialogTitle></DialogTitle>
            <DialogContent className=" bg-[#21212F] border-none rounded-3xl text-white h-svh overflow-x-hidden font-semibold overflow-y-auto max-w-[90%] md:max-w-lg max-h-[80%]">
              <div className="relative">
                <DialogClose className="absolute top-0 right-0 p-2">
                  <HiX 
                    className="w-5 h-5"
                    onClick={() => {
                      playSfx(Audios.button_click);
                      setShowRankingModal(false);
                    }} 
                  />
                </DialogClose>
              </div>
              <div className="flex flex-col items-center justify-around">
                <div className=" flex flex-col items-center gap-2">
                  <h1 className=" font-jalnan text-4xl text-[#DD2726] text-center">
                    {t("dice_event.check_rank")}
                  </h1>
                  <img
                    src={Images.rankingModal}
                    alt="ranking modal"
                    className="mt-2 w-60 h-60"
                  />
                </div>
                <div className="flex flex-col mt-4">
                  <p className="font-Pretendard text-center text-base font-semibold">{t("dice_event.claim_rewards")}</p>
                </div>
                <button
                  onClick={() => setShowAirDrop(false)}
                  className="bg-[#0147E5] text-base font-medium rounded-full w-40 h-14 mt-8 mb-7"
                >
                  {t("dice_event.check")}
                </button>
              </div>
            </DialogContent>
          </Dialog>

          {/* AirDrop 다이얼로그 */}
          <Dialog open={showAirDrop}>
            <DialogTitle></DialogTitle>
            <DialogContent className=" bg-[#21212F] border-none rounded-3xl text-white h-svh overflow-x-hidden font-semibold overflow-y-auto max-w-[90%] md:max-w-lg max-h-[80%]">
              <div className="relative">
                <DialogClose className="absolute top-0 right-0 p-2">
                  <HiX 
                    className="w-5 h-5"
                    onClick={() => {
                      playSfx(Audios.button_click);
                      setShowRankingModal(false);
                    }} 
                  />
                </DialogClose>
              </div>
              <div className="flex flex-col items-center justify-around">
                <div className=" flex flex-col items-center gap-2">
                  <h1 className=" font-jalnan text-4xl text-[#DD2726] text-center">
                    {t("dice_event.lucyk_airdrop")}
                  </h1>
                  <img
                    src={Images.airDropBoxes}
                    alt="airdrop boxes"
                    className="mt-2 w-60 h-60"
                  />
                </div>
                <div className="flex flex-col mt-4">
                  <p className="font-Pretendard text-center text-base font-semibold">{t("dice_event.lucky_winner")}</p>
                </div>
                <button
                  onClick={() => setShowRankingModal(false)}
                  className="bg-[#0147E5] text-base font-medium rounded-full w-40 h-14 mt-8 mb-7"
                >
                  {t("dice_event.check")}
                </button>
              </div>
            </DialogContent>
          </Dialog>


          {/* dapp-portal URL 보상 다이얼로그 */}
          <Dialog open={showUrlReward}>
            <DialogTitle></DialogTitle>
            <DialogContent className=" bg-[#21212F] border-none rounded-3xl text-white h-svh overflow-x-hidden font-semibold overflow-y-auto max-w-[90%] md:max-w-lg max-h-[80%]">
              <div className="relative">
                <DialogClose className="absolute top-0 right-0 p-2">
                  <HiX 
                    className="w-5 h-5"
                    onClick={() => {
                      playSfx(Audios.button_click);
                      setShowUrlReward(false);
                    }} 
                  />
                </DialogClose>
              </div>
              <div className="flex flex-col items-center justify-around">
                <div className=" flex flex-col items-center gap-2">
                  <h1 className=" font-Pretendard text-base font-semibold text-white text-center">
                    {t("dice_event.claim_point")}
                  </h1>
                  <img
                    src={Images.urlReward}
                    alt="airdrop boxes"
                    className="mt-2 w-16 h-16"
                  />
                </div>
                <button
                  onClick={() => {
                    playSfx(Audios.button_click);
                    setShowUrlReward(false);
                  }}
                  className="bg-[#0147E5] text-base font-medium rounded-full w-40 h-14 mt-8 mb-7"
                >
                  {t("dice_event.claim")}
                </button>
              </div>
            </DialogContent>
          </Dialog>
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="hidden md:block md:mb-40"> &nbsp;</div>
        </>
      )}
    </div>
  );
};

export default DiceEventPage;
