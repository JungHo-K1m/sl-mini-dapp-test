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
  currentPage: 0, // 초기 페이지 번호 (0)
  totalPages: Infinity, // 초기값 설정 (무한대로 설정하여 "View More" 버튼을 초기화)
  isLoading: false,
  error: null,

  /**
   * 리더보드 데이터를 초기화하고 상위 10명을 가져옵니다.
   */
  fetchLeaderboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const data: LeaderTabData = await fetchLeaderTabAPI();

      set({
        leaderBoard: data.leaderBoard,
        currentPage: 0, // 다음 페이지는 1부터 시작
        isLoading: false,
        error: null,
        // totalPages는 Infinity로 유지하여 초기 "View More" 버튼 표시
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
    if (currentPage + 1 >= totalPages) return; // 더 이상 페이지가 없을 경우

    set({ isLoading: true });
    try {
      const nextPageNum = currentPage + 1; // 다음 페이지 번호 (1부터 시작)

      const data: LeaderboardPage = await fetchLeaderboardPageAPI(nextPageNum);

      // 리더보드 엔트리에 rank 추가
      const newEntries: LeaderBoardEntry[] = data.content.map((entry, index) => ({
        ...entry,
        rank: nextPageNum * data.size + index + 1,
      }));

      set({
        leaderBoard: [...leaderBoard, ...newEntries],
        currentPage: nextPageNum,
        totalPages: data.totalPages,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Failed to fetch leaderboard data' });
    }
  },
}));
