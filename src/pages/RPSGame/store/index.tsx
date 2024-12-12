// src/pages/RPSGame/store/index.tsx

import create from "zustand";
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
    set({ betAmount: amount });
  },
  
  setAllowedBetting: (amount: number) => set({ allowedBetting: amount }),

  startGame: () => {
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
    set({
      isDialogOpen: false,
      gameResult: null,
      lastReward: 0,
    }),

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

  fetchAllowedBetting: async () => {
    try {
      const response = await api.get("/rps/star");
      if (response.data.code === "OK") {
        const { starCount, allowedBetting } = response.data.data;
        set({ allowedBetting });
        useUserStore.getState().setStarPoints(starCount);
      }
    } catch (error) {}
  },

  playRound: async (userChoice: string): Promise<PlayRoundResponse | null> => {
    const bettingAmount = get().betAmount;
    if (bettingAmount <= 0) {
      return null;
    }
    try {
      const requestData = {
        bettingAmount: bettingAmount,
        value: userChoice === "rock" ? 1 : userChoice === "paper" ? 2 : 0,
      };
      const response = await api.post("/play-rps", requestData);

      if (response.data.code === "OK") {
        const { reward, result, pcValue } = response.data.data;
        const computerChoice =
          pcValue === 1 ? "rock" : pcValue === 2 ? "paper" : "scissors";

        let winnings = 0;
        let newConsecutiveWins = get().consecutiveWins;
        let newWinMultiplier = get().winMultiplier;

        if (result === "WIN") {
          newConsecutiveWins += 1;
          newWinMultiplier = Math.pow(3, newConsecutiveWins);
          winnings = bettingAmount * 3;
          useUserStore.getState().setStarPoints(
            useUserStore.getState().starPoints + winnings
          );
          set({
            gameResult: "win",
            consecutiveWins: newConsecutiveWins,
            lastReward: winnings,
            winMultiplier: newWinMultiplier,
            betAmount: winnings,
            currentRound: get().currentRound + 1,
          });
          // 변경사항: 3연승에도 바로 다이얼로그를 띄우지 않고 지연 후 띄움
          // 이렇게 하면 마지막 승부 결과도 화면에 보인 뒤 다이얼로그가 뜸
          if (newConsecutiveWins >= get().totalRounds) {
            setTimeout(() => {
              set({ isDialogOpen: true });
            }, 450);
          } else {
            setTimeout(() => {
              set({ isDialogOpen: true });
            }, 450);
          }
        } else {
          newConsecutiveWins = 0;
          newWinMultiplier = 1;
          winnings = -bettingAmount;
          useUserStore.getState().setStarPoints(
            useUserStore.getState().starPoints + winnings
          );
          set({
            gameResult: "lose",
            consecutiveWins: newConsecutiveWins,
            lastReward: winnings,
            winMultiplier: newWinMultiplier,
            betAmount: 0,
          });
          setTimeout(() => {
            set({ isDialogOpen: true });
          }, 450);
        }

        return {
          computerChoice,
          result: result === "WIN" ? "win" : "lose",
          reward: winnings,
        };
      } else {
        return null;
      }
    } catch (error: any) {
      return null;
    }
  },
  
  handleRPSGameEnd: (result: "win" | "lose", winnings: number) => {
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
