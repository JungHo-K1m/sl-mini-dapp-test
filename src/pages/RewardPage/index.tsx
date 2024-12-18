// src/pages/RewardPage/index.tsx

import React, { useEffect } from "react";
import { TopTitle } from "@/shared/components/ui";
import "./Reward.css";
import Images from "@/shared/assets/images";
import { useRewardStore } from "@/entities/RewardPage/model/rewardModel";
import LoadingSpinner from "@/shared/components/ui/loadingSpinner";
import RewardItem from "@/widgets/RewardItem"; // RewardItem 컴포넌트 임포트
import { Link } from "react-router-dom"; // Link 임포트 추가
import { formatNumber } from "@/shared/utils/formatNumber";

const Reward: React.FC = () => {
  const {
    fetchLeaderHome,
    rankingAwards,
    drawAwards,
    airDropAwards,
    rank,
    isLoadingHome,
    errorHome,
  } = useRewardStore();

  useEffect(() => {
    // Reward 페이지가 로드될 때 리워드 데이터를 불러옵니다.
    fetchLeaderHome();
  }, [fetchLeaderHome]);

  if (isLoadingHome ) {
    return <LoadingSpinner />;
  }

  if (errorHome) {
    return <div className="text-center text-red-500">Error: {errorHome}</div>;
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

      {/** 클릭 시 이전 랭킹(상품)결과로 이동 */}
      <Link to="/previous-rewards" className="first-to-third-pace-box h-36 rounded-3xl mb-14 flex flex-row items-center justify-around p-5 cursor-pointer">
        <div className="flex flex-col gap-2">
          <p className="text-xl font-semibold">Previous Rewards</p>
          <p className="text-sm">
            See your rankings and rewards from last month!
          </p>
        </div>
        <img src={Images.Trophy} alt="trophy" className="w-24 h-24" />
      </Link>

      {/** 이번달 경품 보여주기 */}
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
        {rankingProducts.map((award, index) =>
          <RewardItem
            key={`${award.rangeStart}-${award.rangeEnd}-${index}`}
            rank={index + 1}
            award={award}
            isTop={true}
          />
        )}

        {/* 4위 이후 랭킹 보상 */}
        {rankingOthers.map((award, index) =>
          <RewardItem
            key={`${award.rangeStart}-${award.rangeEnd}-${index}`}
            rank={award.rangeStart === award.rangeEnd ? award.rangeStart : `${award.rangeStart}-${award.rangeEnd}`}
            award={award}
            isTop={false}
          />
        )}
      </div>

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
        {raffleProducts.map((award, index) =>
          <RewardItem
            key={`${award.rangeStart}-${award.rangeEnd}-${index}`}
            rank={index + 1}
            award={award}
            isTop={true}
          />
        )}

        {/* 4위 이후 래플 보상 */}
        {raffleOthers.map((award, index) =>
          <RewardItem
            key={`${award.rangeStart}-${award.rangeEnd}-${index}`}
            rank={award.rangeStart === award.rangeEnd ? award.rangeStart : `${award.rangeStart}-${award.rangeEnd}`}
            award={award}
            isTop={false}
          />
        )}
      
      </div>

      {/** 이번달 에어드랍 보상 : 있는 경우만 보여주기 */}
      {airDropAwards && airDropAwards.length > 0 && (
        <div className="flex flex-col gap-3 justify-center items-center mb-14 text-sm font-medium">
          <div className="relative text-center font-jalnan text-3xl z-10">
            <h1 className="z-30">
              This Month's
              <br />
              NFT AirDrop!
            </h1>
            <img
              src={Images.AirDrop}
              alt="Airdrop"
              className="absolute -top-1 -left-[64px] w-[70px] h-[70px] -z-10"
            />
          </div>
          <div className="w-full">
            {airDropAwards.map((award, index) => (
              <div
                key={`airdrop-${award.winnerNum}-${index}`}
                className="flex flex-row justify-between py-5 border-b border-[#e5e5e5] w-full"
              >
                <p>
                  {award.winnerNum
                    ? award.winnerNum === 1
                      ? "Grand Prize Winner"
                      : award.winnerNum <= 5
                        ? "Top 5 Winners"
                        : award.winnerNum <= 10
                          ? "Lucky 10 Winners"
                          : "Remaining NFT Holders"
                    : "Remaining NFT Holders & Top 100 AI Users"}
                </p>
                <div className="flex flex-row gap-1 items-center">
                  <img src={Images.TokenReward} alt="token-reward" className="w-6 h-6" />
                  <p>{formatNumber(award.slRewards)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Reward;
