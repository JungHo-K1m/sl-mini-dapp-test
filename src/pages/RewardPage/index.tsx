// src/pages/RewardPage/index.tsx

import React, { useEffect } from "react";
import { TopTitle } from "@/shared/components/ui";
import MyRankingWidget from "@/widgets/MyRanking/MyRankingWidget";
import "./Reward.css";
import Images from "@/shared/assets/images";
import { useRewardStore } from "@/entities/RewardPage/model/rewardModel";
import LoadingSpinner from "@/shared/components/ui/loadingSpinner";
import { LeaderBoardEntry, Award } from "@/entities/RewardPage/types"; // 필요한 타입만 임포트
import RewardItem from "@/widgets/RewardItem"; // RewardItem 컴포넌트 임포트
import { Link as ScrollLink, Element as ScrollElement } from "react-scroll"; // react-scroll 임포트
import { useNavigate } from "react-router-dom"; // React Router 훅
import { useUserStore } from "@/entities/User/model/userModel"; // useUserStore 임포트

const Reward: React.FC = () => {
  const {
    fetchLeaderHome,
    fetchNextLeaderboardPage,
    rankingAwards,
    drawAwards,
    leaderBoard,
    currentPage,
    totalPages,
    isLoadingHome,
    errorHome,
    isLoadingLeaderboard,
    errorLeaderboard,
  } = useRewardStore();

  const navigate = useNavigate(); // React Router 훅

  // useUserStore에서 필요한 데이터 가져오기
  const {
    rank,
    starPoints,
    lotteryCount,
    slToken,
    fetchUserData,
    isLoading: isUserLoading,
    error: userError,
  } = useUserStore();

  useEffect(() => {
    // Reward 페이지가 로드될 때 리워드 데이터와 사용자 데이터를 불러옵니다.
    fetchLeaderHome();
    fetchUserData();
  }, [fetchLeaderHome, fetchUserData]);

  // "View More" 버튼 핸들러
  const handleViewMore = () => {
    if (currentPage + 1 < totalPages) {
      fetchNextLeaderboardPage();
    }
  };

  if (isLoadingHome || isUserLoading) {
    return <LoadingSpinner />;
  }

  if (errorHome) {
    return <div className="text-center text-red-500">Error: {errorHome}</div>;
  }

  if (userError) {
    return <div className="text-center text-red-500">Error: {userError}</div>;
  }

  // 랭킹 상품 데이터 배열 정의
  const rankingProducts = rankingAwards.slice(0, 3); // 상위 3개
  const rankingOthers = rankingAwards.slice(3); // 그 외

  // 추첨권 경품 데이터 배열 정의
  const raffleProducts = drawAwards.slice(0, 3); // 상위 3개
  const raffleOthers = drawAwards.slice(3); // 그 외

  // 문자열을 자르는 헬퍼 함수
  const truncateString = (str: string, num: number): string => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '...';
  };

  return (
    <div className="flex flex-col px-6 md:px-0 text-white mb-44 w-full ">
      <TopTitle title="Rewards" />
      <div className="flex flex-row items-center justify-between mb-11">
        {/* "Last month's Results" 클릭 시 다른 페이지로 이동 */}
        <div
          className="text-center cursor-pointer"
          onClick={() => navigate('/previous-rewards')}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => { if (e.key === 'Enter') navigate('/previous-rewards'); }}
        >
          Last month's
          <br />
          Results
        </div>

        {/* "This month's Awards" 클릭 시 랭킹 어워드 섹션으로 스크롤 */}
        <ScrollLink
          to="rankingAwardsSection"
          smooth={true}
          duration={500}
          className="text-center cursor-pointer"
          role="button"
          tabIndex={0}
        >
          This month's
          <br />
          Awards
        </ScrollLink>

        {/* "Ranking Status" 클릭 시 리더보드 섹션으로 스크롤 */}
        <ScrollLink
          to="leaderBoardSection"
          smooth={true}
          duration={500}
          className="text-center cursor-pointer"
          role="button"
          tabIndex={0}
        >
          Ranking
          <br />
          Status
        </ScrollLink>
      </div>

      {/** 클릭 시 이전 랭킹(상품)결과로 이동 */}
      <div
        className="first-to-third-pace-box h-36 rounded-3xl mb-14 flex flex-row items-center justify-around p-5 cursor-pointer"
        onClick={() => navigate('/previous-rewards')}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => { if (e.key === 'Enter') navigate('/previous-rewards'); }}
      >
        <div className="flex flex-col gap-2">
          <p className="text-xl font-semibold">Previous Rewards</p>
          <p className="text-sm">
            See your rankings and rewards from last month!
          </p>
        </div>
        <img src={Images.Trophy} alt="trophy" className="w-24 h-24" />
      </div>

      {/** 이번달 경품 보여주기 */}
      <ScrollElement name="rankingAwardsSection" className="w-full">
        <div className="flex flex-col gap-3 justify-center items-center mb-14">
          {/* This Month's Ranking Awards */}
          <div className="relative text-center font-jalnan text-3xl mb-6 z-10">
            <h1 className="z-30">
              This Month's
              <br />
              Ranking Awards
            </h1>
            <img
              src={Images.GoldMedal}
              alt="gold-medal"
              className="absolute -top-1 -left-11 w-[70px] h-[70px] -z-10"
            />
          </div>

          {/* 상위 3위 랭킹 보상 */}
          {rankingProducts.map((award: Award, index: number) =>
            <RewardItem
              key={`${award.rangeStart}-${award.rangeEnd}-${index}`}
              rank={index + 1}
              award={award}
              isTop={true}
            />
          )}

          {/* 4위 이후 랭킹 보상 */}
          {rankingOthers.map((award: Award, index: any) =>
            <RewardItem
              key={`${award.rangeStart}-${award.rangeEnd}-${index}`}
              rank={award.rangeStart === award.rangeEnd ? award.rangeStart : `${award.rangeStart}-${award.rangeEnd}`}
              award={award}
              isTop={false}
            />
          )}
        </div>
      </ScrollElement>

      {/** 이번달 추첨권 경품 보여주기 */}
      <div className="flex flex-col gap-3 justify-center items-center mb-14">
        <div className="relative text-center font-jalnan text-3xl mb-6 z-10">
          <h1 className="z-30">
            This Month's
            <br />
            Raffle Awards
          </h1>
          <img
            src={Images.LotteryTicket}
            alt="Raffle"
            className="absolute -top-1 -right-12 w-[68px] h-[68px] -z-10"
          />
        </div>
      
          {/* 상위 3위 래플 보상 */}
          {raffleProducts.map((award: Award, index: number) =>
            <RewardItem
              key={`${award.rangeStart}-${award.rangeEnd}-${index}`}
              rank={index + 1}
              award={award}
              isTop={true}
            />
          )}

          {/* 4위 이후 래플 보상 */}
          {raffleOthers.map((award: Award, index: any) =>
            <RewardItem
              key={`${award.rangeStart}-${award.rangeEnd}-${index}`}
              rank={award.rangeStart === award.rangeEnd ? award.rangeStart : `${award.rangeStart}-${award.rangeEnd}`}
              award={award}
              isTop={false}
            />
          )}
        
      </div>

      {/* My Ranking Widget */}
      <MyRankingWidget />

      {/** Leader Board */}
      <ScrollElement name="leaderBoardSection" className="w-full">
        <div className="mt-14 flex flex-col items-center">
          <h1 className="font-jalnan text-3xl mb-4">Leader Board</h1>

          {/* Top 3 Leader Board Entries */}
          <div className="flex flex-col gap-3 w-full justify-center items-center">
            {leaderBoard.slice(0, 3).map((entry: LeaderBoardEntry) => (
              <div
                key={entry.userId}
                className="h-16 w-full rounded-3xl first-to-third-pace-box flex flex-row items-center justify-around"
              >
                <div className="flex flex-row gap-4  font-medium items-center">
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
          <div className="flex flex-col gap-2 w-full justify-center items-center mt-4 text-sm">
            {leaderBoard.slice(3).map((entry: LeaderBoardEntry) => (
              <div
                key={entry.userId}
                className="h-16 w-full flex flex-row items-center justify-between border-b"
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
          {currentPage + 1 < totalPages && (
            <button
              onClick={handleViewMore}
              className={`border rounded-full mt-6 flex items-center justify-center w-[80px] h-7 font-medium text-xs mb-8 ${
                isLoadingLeaderboard
                  ? "bg-gray-500 cursor-not-allowed"
                  : " hover:bg-blue-500"
              } text-white`}
              disabled={isLoadingLeaderboard}
            >
              {isLoadingLeaderboard ? "Loading..." : "View More"}
            </button>
          )}

          {errorLeaderboard && (
            <div className="text-center text-red-500">Error: {errorLeaderboard}</div>
          )}
        </div>
      </ScrollElement>
    </div>
  );
};

export default Reward;
