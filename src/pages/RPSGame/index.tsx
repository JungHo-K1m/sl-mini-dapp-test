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
    handleRPSGameEnd, // handleRPSGameEnd 추가
  } = useRPSGameStore();

  const { starPoints } = useUserStore();

  // 애니메이션 상태
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // 핸들러: 사용자가 선택한 가위/바위/보로 스핀 시작
  const handleSpin = async (userChoice: string) => {
    if (isSpinning || isAnimating) return;

    spin(); // 스핀 상태 활성화
    setIsAnimating(true); // 애니메이션 상태 활성화

    console.log("Spinning with choice:", userChoice, "current betAmount:", betAmount);

    // 애니메이션 시간 (예: 2초) 동안 대기
    setTimeout(async () => {
      try {
        // 서버 요청을 통해 결과 가져오기
        const response = await playRound(userChoice);
        if (response) {
          // 스핀 중지 및 슬롯 결과 업데이트
          stopSpin(userChoice, response.computerChoice);
        } else {
          // playRound가 null을 반환한 경우 에러로 간주
          throw new Error("Failed to play round.");
        }
      } catch (error) {
        console.error("Error during RPS playRound:", error);
        alert("An error occurred while playing Rock-Paper-Scissors. The page will reload.");
        window.location.reload();
      } finally {
        setIsAnimating(false); // 애니메이션 상태 비활성화
        console.log("Spin completed");
      }
    }, 2000); // 2초 후 서버 요청
  };

  const handleGameStart = () => {
    startGame();
    console.log("Game started with betAmount:", betAmount);
  };

  const handleContinue = () => {
    if (consecutiveWins >= 3) {
      // 최대 3라운드 승리 시 자동 종료
      handleQuit();
    } else {
      continueGame();
      console.log("Continuing game with betAmount:", betAmount);
    }
  };

  const handleQuit = () => {
    endGame();
    onGameEnd(gameResult!, lastReward); // gameResult가 null이 아님을 확신할 수 있도록 '!' 추가
    console.log(`Game ended with ${gameResult}:`, lastReward);
  };

  useEffect(() => {
    console.log("Component mounted");
    fetchAllowedBetting();
  }, []);

  const fetchAllowedBetting = useRPSGameStore((state) => state.fetchAllowedBetting);

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
        <RPSGameStart
          onStart={handleGameStart}
          allowedBetting={allowedBetting}
          onCancel={() => {
            onCancel(); // 기존 onCancel 호출
            handleRPSGameEnd("lose", 0); // 상태 업데이트 및 페이지 복귀
          }}
        />
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
              x{winMultiplier}
            </div>
          </div>

          {/* 게임 보드 및 애니메이션 */}
          <div className="mt-8 relative">
            <img
              src={Images.RPSGame}
              alt="RPS Game"
              className="w-[352px] mx-auto"
            />
            {/* Computer's choice slots */}
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                style={{
                  left: `${32 + index * 88}px`,
                  position: "absolute",
                  bottom: "204px",
                }}
                className="gap-2 flex flex-row items-center justify-center pl-1 w-[87px] overflow-y-hidden h-[80px] transform"
              >
                <motion.div
                  className="flex flex-col items-center justify-center h-full"
                  initial={{ y: 0 }}
                  animate={{
                    // 현재 라운드에 해당하는 슬롯만 애니메이션 실행
                    y:
                      isAnimating && currentRound === index + 1
                        ? ["-100%", "0%"]
                        : "0%",
                  }}
                  transition={{
                    duration:
                      isAnimating && currentRound === index + 1 ? 0.1 : 0.5,
                    ease: "linear",
                    repeat:
                      isAnimating && currentRound === index + 1 ? Infinity : 0,
                  }}
                >
                  {isAnimating && currentRound === index + 1 ? (
                    <div className="slot-item text-5xl flex items-center justify-center">
                      {/* 회전 애니메이션 제거 */}
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
                              useRPSGameStore.getState().slotResults[index].computerChoice as keyof typeof rpsImages
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
            {/* 하단 버튼을 절대 위치로 설정하여 동일한 위치에 표시 */}
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
                  isSpinning || isAnimating
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => handleSpin("rock")}
              />
              <img
                src={Images.PaperButton}
                alt="Paper"
                className={`w-[68px] h-[68px] cursor-pointer ${
                  isSpinning || isAnimating
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => handleSpin("paper")}
              />
              <img
                src={Images.ScissorsButton}
                alt="Scissors"
                className={`w-[68px] h-[68px] cursor-pointer ${
                  isSpinning || isAnimating
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => handleSpin("scissors")}
              />
            </div>
          </div>
        </div>
      )}
      <RPSResultDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        result={gameResult}
        winnings={lastReward} // lastReward은 이미 +/-
        onContinue={handleContinue}
        onQuit={handleQuit}
        consecutiveWins={consecutiveWins}
        winMultiplier={winMultiplier}
      />
    </div>
  );
};

export default RPSGame;
