// src/pages/LeaderboardPage/index.tsx

import React, { useEffect } from 'react';
import { useLeaderboardStore } from '@/entities/Leaderboard/model/leaderboardModel';
import LoadingSpinner from '@/shared/components/ui/loadingSpinner';
import { LeaderBoardEntry } from '@/entities/Leaderboard/types';

const Leaderboard: React.FC = () => {
  const {
    leaderBoard,
    currentPage,
    totalPages,
    isLoading,
    error,
    fetchLeaderboard,
    fetchNextPage,
  } = useLeaderboardStore();

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleViewMore = () => {
    fetchNextPage();
  };

  const truncateString = (str: string, num: number): string => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '...';
  };

  if (isLoading && leaderBoard.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="leaderboard-container flex flex-col md:px-0 text-white mb-44 w-full mt-7">
      <h1 className="font-jalnan text-3xl mb-6 text-center">Leader Board</h1>

      {/* Top 3 Leader Board Entries */}
      <div className="top-leaders flex flex-col gap-3 w-full justify-center items-center">
        {leaderBoard.slice(0, 3).map((entry: LeaderBoardEntry, index: number) => (
          <div
            key={`${entry.userId}-${index}`}
            className="leader-entry h-16 w-full rounded-3xl first-to-third-pace-box flex flex-row items-center justify-around"
          >
            <div className="flex flex-row gap-4 font-medium items-center">
              <p>{entry.rank}</p>
              <p className="truncate max-w-[120px]" title={entry.userId}>
                {truncateString(entry.userId, 10)}
              </p>
            </div>
            <p className="text-[#fde047] font-semibold text-lg">
              {entry.starCount.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* 4등 ~ n등 Leader Board Entries */}
      <div className="other-leaders flex flex-col gap-2 w-full justify-center items-center mt-4 text-sm">
        {leaderBoard.slice(3).map((entry: LeaderBoardEntry, index: number) => (
          <div
            key={`${entry.userId}-${index}`}
            className="leader-entry h-16 w-full flex flex-row items-center justify-between border-b"
          >
            <p>{entry.rank}</p>
            <p className="truncate max-w-[120px]" title={entry.userId}>
              {truncateString(entry.userId, 10)}
            </p>
            <p className="font-semibold">
              {entry.starCount.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* View More Button */}
      {currentPage < totalPages && (
        <button
          onClick={handleViewMore}
          className={`border rounded-full mt-6 flex items-center justify-center w-[80px] h-7 font-medium text-xs mb-8 ${
            isLoading ? 'bg-gray-500 cursor-not-allowed' : 'hover:bg-blue-500'
          } text-white`}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'View More'}
        </button>
      )}

      {/* 추가적인 로딩 스피너 (View More 클릭 시) */}
      {isLoading && leaderBoard.length > 0 && <LoadingSpinner />}
    </div>
  );
};

export default Leaderboard;
