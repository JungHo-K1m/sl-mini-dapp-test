// src/pages/RPSGame/store/index.tsx

import { create } from "zustand";
import api from "@/shared/api/axiosInstance";
import { useUserStore } from "@/entities/User/model/userModel";

interface SlotResult {
  userChoice: string;
  computerChoice: string;
}

interface PlayRoundResponse {
  computerChoice: string;
  result: "win" | "lose";
  reward: number;
}

interface RPSGameState {
  betAmount: number;
  allowedBetting: number;
  currentRound: number;
  totalRounds: number;
  isSpinning: boolean;
  slotResults: SlotResult[];
  isGameStarted: boolean;
  isDialogOpen: boolean;
  gameResult: "win" | "lose" | null;
  consecutiveWins: number;
  lastReward: number;
  winMultiplier: number;

  setBetAmount: (amount: number) => void;
  setAllowedBetting: (amount: number) => void;
  startGame: () => void;
  spin: () => void;
  stopSpin: (userChoice: string, computerChoice: string) => void;
  continueGame: () => void;
  endGame: () => void;
  openDialog: () => void;
  closeDialog: () => void;
  fetchAllowedBetting: () => Promise<void>;
  playRound: (userChoice: string) => Promise<PlayRoundResponse | null>;
  handleRPSGameEnd: (result: "win" | "lose", winnings: number) => void;
}

export const useRPSGameStore = create<RPSGameState>((set, get) => ({
  betAmount: 0,
  allowedBetting: 0,
  currentRound: 1,
  totalRounds: 3,
  isSpinning: false,
  slotResults: [],
  isGameStarted: false,
  isDialogOpen: false,
  gameResult: null,
  consecutiveWins: 0,
  lastReward: 0,
  winMultiplier: 1,

  setBetAmount: (amount: number) => {
    console.log(`Setting betAmount to: ${amount}`);
    set({ betAmount: amount });
  },
  
  setAllowedBetting: (amount: number) => set({ allowedBetting: amount }),

  startGame: () => {
    console.log("Starting game");
    set({
      isGameStarted: true,
      currentRound: 1,
      slotResults: [],
      consecutiveWins: 0,
      gameResult: null,
      lastReward: 0,
      winMultiplier: 1,
    });
  },

  spin: () => set({ isSpinning: true }),

  stopSpin: (userChoice: string, computerChoice: string) =>
    set((state) => ({
      isSpinning: false,
      slotResults: [...state.slotResults, { userChoice, computerChoice }],
    })),

  continueGame: () =>
    set((state) => ({
      isDialogOpen: false,
      gameResult: null,
      lastReward: 0,
      // 'consecutiveWins'와 'winMultiplier'는 playRound에서 관리
    })),

  endGame: () =>
    set({
      isGameStarted: false,
      betAmount: 0,
      currentRound: 1,
      slotResults: [],
      gameResult: null,
      isDialogOpen: false,
      consecutiveWins: 0,
      lastReward: 0,
      winMultiplier: 1,
    }),

  openDialog: () => set({ isDialogOpen: true }),

  closeDialog: () => set({ isDialogOpen: false }),

  // 베팅 가능 금액 및 현재 포인트 조회
  fetchAllowedBetting: async () => {
    try {
      console.log("Fetching allowed betting");
      const response = await api.get("/rps/star");
      console.log("Allowed betting response:", response);
      if (response.data.code === "OK") {
        const { starCount, allowedBetting } = response.data.data;
        set({ allowedBetting });
        useUserStore.getState().setStarPoints(starCount);
      } else {
        console.error("Error fetching allowed betting:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching allowed betting:", error);
    }
  },

  // 가위바위보 게임 진행
  playRound: async (userChoice: string): Promise<PlayRoundResponse | null> => {
    const bettingAmount = get().betAmount;
    console.log("Current betAmount:", bettingAmount);

    if (bettingAmount <= 0) {
      console.error("Betting amount must be greater than 0.");
      return null;
    }

    try {
      // 서버로 보낼 데이터 로그
      const requestData = {
        bettingAmount: bettingAmount,
        value: userChoice === "rock" ? 1 : userChoice === "paper" ? 2 : 0, // scissors는 0으로 설정
      };
      console.log("Sending POST /play-rps with data:", requestData);

      const response = await api.post("/play-rps", requestData);
      console.log("Received response from POST /play-rps:", response);

      if (response.data.code === "OK") {
        const { reward, result, pcValue } = response.data.data;
        const computerChoice =
          pcValue === 1 ? "rock" : pcValue === 2 ? "paper" : "scissors";

        let winnings = 0;
        let newConsecutiveWins = get().consecutiveWins;
        let newWinMultiplier = get().winMultiplier;

        if (result === "WIN") {
          newConsecutiveWins += 1;
          newWinMultiplier = Math.pow(3, newConsecutiveWins); // 3^n 배수
          winnings = bettingAmount * 3; // 이긴 금액을 3배로 설정

          // 사용자 포인트 업데이트
          useUserStore.getState().setStarPoints(
            useUserStore.getState().starPoints + winnings
          );

          console.log(`Round ${get().currentRound}: WIN! Winnings: +${winnings}`);

          // 상태 업데이트
          set({
            slotResults: [...get().slotResults, { userChoice, computerChoice }],
            gameResult: "win",
            isDialogOpen: true,
            consecutiveWins: newConsecutiveWins,
            lastReward: winnings,
            winMultiplier: newWinMultiplier,
            betAmount: winnings, // 다음 라운드에 베팅할 금액을 업데이트
            currentRound: get().currentRound + 1,
          });

          console.log(`Proceeding to round ${get().currentRound} with betAmount: ${winnings} and winMultiplier: ${newWinMultiplier}`);

          // 최대 연속 승리 시 게임 종료
          if (newConsecutiveWins >= get().totalRounds) {
            console.log("Maximum consecutive wins reached. Ending game.");
            setTimeout(() => {
              set({
                isDialogOpen: false,
                isGameStarted: false,
                betAmount: 0, // 베팅 금액 초기화
                currentRound: 1,
                consecutiveWins: 0,
                winMultiplier: 1,
                gameResult: null,
                lastReward: 0,
                slotResults: [],
              });
              // 게임 종료 후 콜백 호출 (RPSGame 컴포넌트에서 처리)
              // 예: onGameEnd 호출 (이 부분은 컴포넌트에서 처리)
            }, 2000); // 2초 후 게임 종료
          }
        } else {
          // 패배 시
          newConsecutiveWins = 0;
          newWinMultiplier = 1; // 배율을 초기화
          winnings = -bettingAmount;

          // 사용자 포인트 업데이트
          useUserStore.getState().setStarPoints(
            useUserStore.getState().starPoints + winnings
          );

          set({
            slotResults: [...get().slotResults, { userChoice, computerChoice }],
            gameResult: "lose",
            isDialogOpen: true,
            consecutiveWins: newConsecutiveWins,
            lastReward: winnings,
            winMultiplier: newWinMultiplier,
            betAmount: 0, // 패배 시 베팅 금액 초기화
          });
          console.log(`Round ${get().currentRound}: LOSE! Winnings: ${winnings}`);
        }

        console.log("Round result:", result, "computerChoice:", computerChoice, "winnings:", winnings);

        return {
          computerChoice,
          result: result === "WIN" ? "win" : "lose",
          reward: winnings,
        };
      } else {
        console.error("Error playing RPS:", response.data.message);
        return null;
      }
    } catch (error: any) {
      console.error("Error playing RPS:", error);
      return null;
    }
  },

  // RPS 게임 종료 처리 함수 추가
  handleRPSGameEnd: (result: "win" | "lose", winnings: number) => {
    console.log(`useRPSGameStore - handleRPSGameEnd called with: ${result}, ${winnings}`);
    set({
      isDialogOpen: false,
      isGameStarted: false,
      consecutiveWins: 0,
      winMultiplier: 1,
      gameResult: null,
      lastReward: 0,
      slotResults: [],
      betAmount: 0,
      currentRound: 1,
    });
  },
}));

export default useRPSGameStore;
