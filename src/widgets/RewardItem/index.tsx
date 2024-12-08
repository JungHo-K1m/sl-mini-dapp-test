// src\widgets\RewardItem\index.tsx

import React from "react";
import Images from "@/shared/assets/images";
import { Award } from "@/entities/RewardPage/types";

interface RewardItemProps {
  rank: number | string;
  award: Award;
  isTop: boolean;
}

const RewardItem: React.FC<RewardItemProps> = ({ rank, award, isTop }) => {
  return isTop ? (
    <div className="h-16 w-full rounded-3xl first-to-third-pace-box flex flex-row items-center justify-center gap-4 ">
      <p>{rank}</p>
      <div className="flex flex-row gap-1 font-medium items-center">
        <img src={Images.TokenReward} alt="token-reward" className="w-6 h-6" />
        <p>
          {award.slRewards.toLocaleString()}{" "}
          <span className="text-[#A3A3A3]">(or {award.usdtRewards} USDT)</span>
          {award.nftType && ` + ${award.nftType} NFT`}
        </p>
      </div>
    </div>
  ) : (
    <div className="h-16 w-full flex flex-row items-center justify-between border-b text-sm">
      <p>{rank}</p>
      <div className="flex flex-row items-center gap-2">
        <img src={Images.TokenReward} alt="token-reward" className="w-6 h-6" />
        <p>
          {award.slRewards.toLocaleString()}{" "}
          <span className="text-[#A3A3A3]">(or {award.usdtRewards} USDT)</span>
          {award.nftType && ` + ${award.nftType} NFT`}
        </p>
      </div>
    </div>
  );
};

export default RewardItem;
