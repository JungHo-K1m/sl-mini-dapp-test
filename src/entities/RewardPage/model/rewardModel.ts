// src/entities/RewardPage/model/rewardModel.ts

import { create } from 'zustand';
import { fetchLeaderHomeAPI, fetchLeaderboardPageAPI } from '../api/rewardsAPI';
import {
  LeaderHomeData,
  LeaderboardPage,
  LeaderBoardEntry,
  RankingAward,
  DrawAward,
} from '../types';

// 리워드 및 리더보드 상태 인터페이스
interface RewardState {
  // 리워드 및 리더보드 데이터
  rankingAwards: RankingAward[];
  drawAwards: DrawAward[];
  rank: {
    rank: number;
    star: number;
    ticket: number;
    slToken: number;
    diceRefilledAt: string | null;
  };
  leaderBoard: LeaderBoardEntry[];

  // 리더보드 페이징 상태
  currentPage: number;
  totalPages: number;
  isLoadingHome: boolean;
  errorHome: string | null;
  isLoadingLeaderboard: boolean;
  errorLeaderboard: string | null;

  // 액션
  fetchLeaderHome: () => Promise<void>;
  fetchLeaderboardPage: (pageNum: number) => Promise<void>;
  fetchNextLeaderboardPage: () => Promise<void>;
}

export const useRewardStore = create<RewardState>((set, get) => ({
  // 초기 상태
  rankingAwards: [],
  drawAwards: [],
  rank: {
    rank: 0,
    star: 0,
    ticket: 0,
    slToken: 0,
    diceRefilledAt: null,
  },
  leaderBoard: [],

  currentPage: 0,
  totalPages: 0,
  isLoadingHome: false,
  errorHome: null,
  isLoadingLeaderboard: false,
  errorLeaderboard: null,

  // 액션 구현
  fetchLeaderHome: async () => {
    set({ isLoadingHome: true, errorHome: null });
    try {
      const data: LeaderHomeData = await fetchLeaderHomeAPI();

      console.log(data);
      set({
        rankingAwards: data.rankingAwards,
        drawAwards: data.drawAwards,
        rank: data.rank,
        leaderBoard: data.leaderBoard,
        isLoadingHome: false,
        errorHome: null,
        totalPages: 3, // 예시: 실제 API 응답에 따라 동적으로 설정
      });
    } catch (error: any) {
      set({ isLoadingHome: false, errorHome: error.message || 'Failed to fetch leader home data' });
    }
  },

  fetchLeaderboardPage: async (pageNum: number) => {
    set({ isLoadingLeaderboard: true, errorLeaderboard: null });
    try {
      const pageData: LeaderboardPage = await fetchLeaderboardPageAPI(pageNum);
      
      // 페이지 크기 (페이지당 항목 수)
      const pageSize = pageData.size;

      // 리더보드 엔트리에 rank 추가
      const newEntries: LeaderBoardEntry[] = pageData.content.map((entry, index) => ({
        ...entry,
        rank: pageNum * pageSize + index + 1,
      }));

      set((state) => ({
        leaderBoard: [...state.leaderBoard, ...newEntries],
        currentPage: pageNum,
        isLoadingLeaderboard: false,
        errorLeaderboard: null,
        totalPages: pageData.totalPages, // 실제 API 응답에서 totalPages 가져오기
      }));
    } catch (error: any) {
      set({ isLoadingLeaderboard: false, errorLeaderboard: error.message || 'Failed to fetch leaderboard data' });
    }
  },

  fetchNextLeaderboardPage: async () => {
    const { currentPage, totalPages, isLoadingLeaderboard } = get();
    if (isLoadingLeaderboard) return;
    if (currentPage + 1 >= totalPages) return; // 더 이상 페이지가 없을 경우
    await get().fetchLeaderboardPage(currentPage + 1);
  },
}));
