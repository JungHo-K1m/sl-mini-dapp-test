// src/pages/RPSGame/index.tsx

import React, { useEffect, useState } from "react";
import Images from "@/shared/assets/images";
import { motion } from "framer-motion";
import { formatNumber } from "@/shared/utils/formatNumber";
import RPSResultDialog from "./ui/RPSResultDialog";
import RPSGameStart from "./ui/RPSGameStart";
import { useRPSGameStore } from "./store";
import { useUserStore } from "@/entities/User/model/userModel";
import LoadingSpinner from "@/shared/components/ui/loadingSpinner"; // ★ 로딩 스피너
import { preloadImages } from "@/shared/utils/preloadImages"; // ★ 이미지 프리로딩 함수

interface RPSGameProps {
  onGameEnd: (result: "win" | "lose", winnings: number) => void;
  onCancel: () => void;
}

const rpsImages = {
  rock: Images.Rock,
  paper: Images.Paper,
  scissors: Images.Scissors,
};

const RPSGame: React.FC<RPSGameProps> = ({ onGameEnd, onCancel }) => {
  // -----------------------
  // 1) 로딩 상태 관리
  // -----------------------
  const [isLoading, setIsLoading] = useState(true);

  // -----------------------
  // 필요한 이미지 모두 담기
  // -----------------------
  const imagesToLoad = [
    Images.BGRPSGame,
    Images.RPSGameExample,
    Images.RPSGame,
    Images.Rock,
    Images.Paper,
    Images.Scissors,
    Images.RockButton,
    Images.PaperButton,
    Images.ScissorsButton,
    Images.Star,
    // 혹시 RPSGameStart, RPSResultDialog 등에서 추가로 쓰는 이미지도 여기 포함
  ];

  // -----------------------
  // 이미지 프리로드
  // -----------------------
  useEffect(() => {
    const loadAllImages = async () => {
      try {
        await preloadImages(imagesToLoad);
      } catch (error) {
        console.error("이미지 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllImages();
  }, []);

  // -----------------------
  // RPS 게임 관련 상태
  // -----------------------
  const {
    betAmount,
    winMultiplier,
    isSpinning,
    isDialogOpen,
    gameResult,
    consecutiveWins,
    lastReward,
    isGameStarted,
    startGame,
    spin,
    stopSpin,
    continueGame,
    endGame,
    closeDialog,
    playRound,
    allowedBetting,
    currentRound,
    handleRPSGameEnd,
    totalRounds,
    fetchAllowedBetting,
  } = useRPSGameStore();

  const { starPoints } = useUserStore();

  // -----------------------
  // 슬롯 애니메이션 상태
  // -----------------------
  const [slotStates, setSlotStates] = useState<("spinning" | "stopped")[]>([
    "stopped",
    "stopped",
    "stopped",
  ]);
  const isAnySlotSpinning = slotStates.some((state) => state === "spinning");
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // -----------------------
  // 게임 흐름
  // -----------------------
  const handleGameStart = () => {
    startGame();
    setSlotStates(["spinning", "spinning", "spinning"]);
    setIsAnimating(true);
    console.log("Game started with betAmount:", betAmount);
  };

  const handleSpin = async (userChoice: string) => {
    if (isSpinning || !isAnySlotSpinning) return; 
    spin();

    setTimeout(async () => {
      try {
        const response = await playRound(userChoice);
        if (response) {
          stopSpin(userChoice, response.computerChoice);

          // 현재 라운드 슬롯만 정지
          setSlotStates((prev) => {
            const newStates = [...prev];
            newStates[currentRound - 1] = "stopped";
            return newStates;
          });
          
          // 모든 라운드 다 돌았다면 애니메이션 종료
          if (currentRound >= totalRounds) {
            setIsAnimating(false);
          }
        } else {
          throw new Error("Failed to play round.");
        }
      } catch (error) {
        console.error("Error during RPS playRound:", error);
        alert("An error occurred while playing Rock-Paper-Scissors. The page will reload.");
        window.location.reload();
      }
    }, 2000);
  };

  const handleContinue = () => {
    if (consecutiveWins >= totalRounds) {
      handleQuit();
    } else {
      continueGame();
      console.log("Continuing game with betAmount:", betAmount);
    }
  };

  const handleQuit = () => {
    endGame();
    onGameEnd(gameResult!, lastReward);
    console.log(`Game ended with ${gameResult}:`, lastReward);
  };

  // -----------------------
  // allowedBetting 불러오기
  // -----------------------
  useEffect(() => {
    fetchAllowedBetting();
    console.log("Component mounted");
  }, [fetchAllowedBetting]);

  // -----------------------
  // 가로 스크롤 막기
  // -----------------------
  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
    };
  }, []);

  // -----------------------
  // 2) 로딩 중이면 스피너, 아니라면 실제 화면
  // -----------------------
  if (isLoading) {
    return <LoadingSpinner className="h-screen"/>;
  }

  // -----------------------
  // 실제 RPS 게임 화면
  // -----------------------
  return (
    <div
      className="flex flex-col z-50 bg-white h-screen justify-items-center drop-shadow overflow-x-hidden"
      style={{
        backgroundImage: `url(${Images.BGRPSGame})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!isGameStarted ? (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="flex h-full w-full"
        >
          <RPSGameStart
            onStart={handleGameStart}
            allowedBetting={allowedBetting}
            onCancel={() => {
              onCancel();
              handleRPSGameEnd("lose", 0);
            }}
          />
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full w-[600px] overflow-hidden mx-auto">
          {/* 배팅 금액, 배율 */}
          <div className="flex flex-row items-center justify-center h-[86px] w-[264px] border-2 border-[#21212f] rounded-3xl bg-white gap-3">
            <div className="flex flex-row items-center gap-1">
              <img src={Images.Star} alt="Star" className="w-9 h-9" />
              <p className="text-3xl font-semibold">
                {formatNumber(betAmount)}
              </p>
            </div>
            <div className="bg-[#21212f] rounded-full flex items-center justify-center h-8 w-11 text-sm font-semibold text-white">
              x{winMultiplier * 3 > 27 ? 27 : winMultiplier * 3}
            </div>
          </div>

          {/* 게임 보드 */}
          <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
            className="mt-8 relative"
          >
            <img
              src={Images.RPSGame}
              alt="RPS Game"
              className="w-[352px] mx-auto"
            />

            {/* 슬롯(라운드) 3개 표시 */}
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                style={{
                  left: `${32 + index * 88}px`,
                  position: "absolute",
                  bottom: "204px",
                }}
                className="gap-2 flex flex-row items-center justify-center pl-1 w-[87px] overflow-y-hidden h-[80px]"
              >
                <motion.div
                  className="flex flex-col items-center justify-center h-full"
                  initial={{ y: 0 }}
                  animate={{
                    y:
                      slotStates[index] === "spinning"
                        ? ["-100%", "0%"]
                        : "0%", 
                  }}
                  transition={{
                    duration: slotStates[index] === "spinning" ? 0.1 : 0.5,
                    ease: "linear",
                    repeat: slotStates[index] === "spinning" ? Infinity : 0,
                  }}
                >
                  {slotStates[index] === "spinning" ? (
                    <div className="slot-item text-5xl flex items-center justify-center">
                      <img
                        src={rpsImages.scissors}
                        alt="Spinning"
                        className="h-[70px] min-w-[50px] self-center"
                      />
                    </div>
                  ) : (
                    <div
                      className="slot-item text-5xl flex items-center justify-center"
                      style={{ height: "100%", width: "100%" }}
                    >
                      {useRPSGameStore.getState().slotResults[index] ? (
                        <img
                          src={
                            rpsImages[
                              useRPSGameStore.getState().slotResults[index]
                                .computerChoice as keyof typeof rpsImages
                            ]
                          }
                          alt={`slot-${index}`}
                          className="h-[70px] min-w-[50px] self-center"
                        />
                      ) : (
                        <img
                          src={Images.Scissors}
                          alt={`slot-${index}`}
                          className="h-[70px] min-w-[50px] self-center"
                        />
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            ))}

            {/* 가위바위보 선택 버튼 */}
            <div
              style={{
                position: "absolute",
                bottom: "80px",
                left: "54px",
              }}
              className="flex flex-row gap-2 items-center"
            >
              <img
                src={Images.RockButton}
                alt="Rock"
                className={`w-[68px] h-[68px] cursor-pointer ${
                  isSpinning || !isAnySlotSpinning
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => handleSpin("rock")}
              />
              <img
                src={Images.PaperButton}
                alt="Paper"
                className={`w-[68px] h-[68px] cursor-pointer ${
                  isSpinning || !isAnySlotSpinning
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => handleSpin("paper")}
              />
              <img
                src={Images.ScissorsButton}
                alt="Scissors"
                className={`w-[68px] h-[68px] cursor-pointer ${
                  isSpinning || !isAnySlotSpinning
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => handleSpin("scissors")}
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* 결과 다이얼로그 */}
      <RPSResultDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        result={gameResult}
        winnings={lastReward}
        onContinue={handleContinue}
        onQuit={handleQuit}
        consecutiveWins={consecutiveWins}
        winMultiplier={winMultiplier}
      />
    </div>
  );
};

export default RPSGame;
