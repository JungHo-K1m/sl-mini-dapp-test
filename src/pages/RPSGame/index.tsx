// src/pages/RPSGame/index.tsx

import React, { useEffect, useState } from "react";
import Images from "@/shared/assets/images";
import { motion } from "framer-motion";
import { formatNumber } from "@/shared/utils/formatNumber";
import RPSResultDialog from "./ui/RPSResultDialog";
import RPSGameStart from "./ui/RPSGameStart";
import { useRPSGameStore } from "./store";
import { useUserStore } from "@/entities/User/model/userModel";

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
  } = useRPSGameStore();

  const { starPoints } = useUserStore();

  // 모든 슬롯 상태 관리: spinning | stopped
  const [slotStates, setSlotStates] = useState<("spinning" | "stopped")[]>([
    "stopped",
    "stopped",
    "stopped",
  ]);

  // 최소 하나의 슬롯이라도 spinning이면 true
  const isAnySlotSpinning = slotStates.some((state) => state === "spinning");
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // 게임 시작 시 모든 슬롯을 spinning, isAnimating을 true로 만든다.
  const handleGameStart = () => {
    startGame();
    setSlotStates(["spinning", "spinning", "spinning"]);
    setIsAnimating(true); // 게임 시작 시 애니메이션 시작
    console.log("Game started with betAmount:", betAmount);
  };

  const handleSpin = async (userChoice: string) => {
    if (isSpinning || !isAnySlotSpinning) return; 
    // 이미 스핀 중이거나 더 이상 회전하는 슬롯이 없으면 return
    spin();

    setTimeout(async () => {
      try {
        const response = await playRound(userChoice);
        if (response) {
          stopSpin(userChoice, response.computerChoice);

          // 현재 라운드의 슬롯만 정지
          setSlotStates((prev) => {
            const newStates = [...prev];
            newStates[currentRound - 1] = "stopped";
            return newStates;
          });
          
          // 만약 모든 슬롯이 멈췄다면(마지막 라운드 끝)
          if (currentRound >= totalRounds) {
            // 모든 슬롯 정지 후 애니메이션 종료
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
      // 마지막 라운드까지 끝났으면 quit
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

  const fetchAllowedBetting = useRPSGameStore((state) => state.fetchAllowedBetting);

  useEffect(() => {
    console.log("Component mounted");
    fetchAllowedBetting();
  }, [fetchAllowedBetting]);

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
    };
  }, []);

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
          {/* 배팅 금액과 배율 표시 */}
          <div className="flex flex-row items-center justify-center h-[86px] w-[264px] border-2 border-[#21212f] rounded-3xl bg-white gap-3">
            <div className="flex flex-row items-center gap-1">
              <img src={Images.Star} alt="Star" className="w-9 h-9" />
              <p className="text-3xl font-semibold">
                {formatNumber(betAmount)}
              </p>
            </div>
            <div className="bg-[#21212f] rounded-full flex items-center justify-center h-8 w-11 text-sm font-semibold text-white">
              x{winMultiplier*3 >27 ? 27 : winMultiplier*3}
            </div>
          </div>

          {/* 게임 보드 및 애니메이션 */}
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
