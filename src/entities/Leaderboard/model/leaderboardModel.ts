// src/entities/Leaderboard/model/leaderboardModel.ts

import create from 'zustand';
import { fetchLeaderTabAPI, fetchLeaderboardPageAPI } from '../api/leaderboardAPI';
import { LeaderBoardEntry, LeaderTabData, LeaderboardPage } from '../types';

interface LeaderboardState {
  leaderBoard: LeaderBoardEntry[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;

  fetchLeaderboard: () => Promise<void>;
  fetchNextPage: () => Promise<void>;
}

export const useLeaderboardStore = create<LeaderboardState>((set, get) => ({
  leaderBoard: [],
  currentPage: 0,
  totalPages: 1, // 기본값 설정
  isLoading: false,
  error: null,

  /**
   * 리더보드 데이터를 초기화하고 첫 페이지를 가져옵니다.
   */
  fetchLeaderboard: async () => {
    set({ isLoading: true, error: null });
    try {
      // 초기 로드: /leader/tab 사용
      const data: LeaderTabData = await fetchLeaderTabAPI();

      // 페이지당 항목 수
      const entriesPerPage = 10;
      const totalPages = Math.ceil(data.leaderBoard.length / entriesPerPage);

      set({
        leaderBoard: data.leaderBoard,
        currentPage: 1, // 다음 페이지는 1부터 시작
        totalPages,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Failed to fetch leaderboard data' });
    }
  },

  /**
   * 다음 페이지의 리더보드 데이터를 가져옵니다.
   */
  fetchNextPage: async () => {
    const { currentPage, totalPages, isLoading, leaderBoard } = get();
    if (isLoading) return;
    if (currentPage >= totalPages) return; // 더 이상 페이지가 없을 경우

    set({ isLoading: true });
    try {
      const nextPageNum = currentPage; // 다음 페이지 번호 (0부터 시작)

      const data: LeaderboardPage = await fetchLeaderboardPageAPI(nextPageNum);

      set({
        leaderBoard: [...leaderBoard, ...data.content],
        currentPage: currentPage + 1,
        totalPages: data.totalPages,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Failed to fetch next leaderboard page' });
    }
  },
}));
