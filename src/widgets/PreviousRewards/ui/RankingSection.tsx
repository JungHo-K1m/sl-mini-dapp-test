// src/widgets/PreviousRewards/ui/RankingSection.tsx

import React, { useEffect } from "react";
import Images from "@/shared/assets/images";
import { IoCaretDown } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { PlayerData } from "@/features/PreviousRewards/types/PlayerData";
import LoadingSpinner from "@/shared/components/ui/loadingSpinner";
import ErrorMessage from "@/shared/components/ui/ErrorMessage";

interface RankingSectionProps {
  myData: PlayerData | null;
  topRankings: PlayerData[];
  isReceived: boolean;
  onGetReward: () => void;
  dialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  dialogTitle: string;
  dialogRankings: PlayerData[];
  isLoadingRange: boolean;
  rangeError: string | null;
  handleRangeClick: (start: number, end: number) => void;
}

const RankingSection: React.FC<RankingSectionProps> = ({
  myData = null, // 기본값 설정
  topRankings = [], // 기본값 설정
  isReceived,
  onGetReward,
  dialogOpen,
  onDialogOpenChange,
  dialogTitle,
  dialogRankings,
  isLoadingRange,
  rangeError,
  handleRangeClick,
}) => {
  useEffect(() => {
    console.log("RankingSection myData:", myData);
  }, [myData]);

  return (
    <div className="p-6 bg-[#0D1226] text-white w-full ">
      {myData ? (
        <>
          {/* 여기서부터 랭킹 조건 분기 */}
          {myData.rank > 1000 ? (
            // 1000등 밖인 경우
            <div className="relative flex flex-col box-bg rounded-3xl border-2 border-[#0147E5] p-5 h-24 justify-center items-center">
              <p className="font-semibold text-sm text-center">
                Your Rank: #
                <span className="text-[#FDE047] font-bold">{myData.rank}</span>
                <br />
                Keep playing and try again next time!
              </p>
            </div>
          ) : myData.rank <= 20 ? (
            // 1~20등까지 보상 버튼 노출
            <>
              <p className="font-semibold">
                Congratulations! Here’s your reward:
              </p>
              <div className="relative flex flex-row items-center box-bg rounded-3xl h-24 border-2 border-[#0147E5] mt-3 p-5 gap-3">
                {isReceived && (
                  <div className="absolute top-2 right-2 bg-[#0147E5] rounded-full px-3 py-1 text-sm">
                    Received
                  </div>
                )}
                <p>#{myData.rank}</p>
                <div className="flex flex-col gap-1">
                  <p>{myData.userId}</p>
                  <div className="flex flex-row items-center gap-1">
                    <img
                      src={
                        myData.selectedRewardType === "USDC"
                          ? Images.USDC
                          : Images.TokenReward
                      }
                      alt="token"
                      className="w-5 h-5"
                    />
                    <p className="text-sm font-semibold">
                      {(myData.slRewards ?? 0).toLocaleString()}{" "}
                      <span className="font-normal text-[#a3a3a3]">
                        (or {(myData.usdcRewards ?? 0).toLocaleString()} USDC)
                      </span>{" "}
                      {myData.nftType ? `+ ${myData.nftType} NFT` : ""}
                    </p>
                  </div>
                </div>
              </div>
              {/* 보상 버튼 */}
              <button
                className={`bg-[#0147E5] rounded-full w-full h-14 mt-3 font-medium ${
                  isReceived ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={onGetReward}
                disabled={isReceived}
              >
                {myData.selectedRewardType === null
                  ? "Select your reward"
                  : `Reward Issued (${myData.selectedRewardType})`}
              </button>
            </>
          ) : (
            // 21~1000등 사이인 경우 (보상 버튼 비노출)
            <div className="relative flex flex-col box-bg rounded-3xl border-2 border-[#0147E5] p-5 h-full justify-center items-center">
              <p className="font-semibold text-sm text-center">
                Your Rank: #
                <span className="text-[#FDE047] font-bold">{myData.rank}</span>
                <br />
                Keep playing and try again next time!
              </p>
            </div>
          )}
        </>
      ) : (
        // myData가 null인 경우 (랭킹 데이터 자체가 없는 경우)
        <div className="relative flex flex-col box-bg rounded-3xl border-2 border-[#0147E5] p-5 h-full justify-center items-center">
          <p className="font-semibold text-sm text-center">
            You didn't rank this time. <br />
            Keep playing and try again next time!
          </p>
        </div>
      )}

      {/* Top Rankings */}
      <div className="flex flex-col mt-8">
      <p className="font-semibold">Ranking Reward Winner</p>
        {topRankings.length > 0 ? (
          topRankings.slice(0, 20).map((r) => {
            return (
              <div
                key={r.rank}
                className={`relative flex flex-row items-center p-4 border-b gap-4`}
              >
                <p>#{r.rank}</p>
                <div className="flex flex-col gap-1">
                  <p>{r.userId}</p>
                  <div className="flex flex-row items-center gap-1">
                    {r.selectedRewardType === "USDC" ? (
                      <>
                        <img src={Images.USDC} alt="token" className="w-5 h-5" />
                        <p className="text-sm font-semibold">
                          {(r.usdcRewards ?? 0).toLocaleString()}{" "}
                          <span className="font-normal text-[#a3a3a3]">
                            (or {(r.slRewards ?? 0).toLocaleString()} SL)
                          </span>
                          {r.nftType ? ` + ${r.nftType} NFT` : ""}
                        </p>
                      </>
                    ) : (
                      <>
                        <img
                          src={Images.TokenReward}
                          alt="token"
                          className="w-5 h-5"
                        />
                        <p className="text-sm font-semibold">
                          {(r.slRewards ?? 0).toLocaleString()}{" "}
                          <span className="font-normal text-[#a3a3a3]">
                            (or {(r.usdcRewards ?? 0).toLocaleString()} USDC)
                          </span>
                          {r.nftType ? ` + ${r.nftType} NFT` : ""}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-sm">No rankings available</p>
        )}
      </div>

      {/* Dialogs */}
      <div className="mt-14 space-y-4">
        <Dialog open={dialogOpen} onOpenChange={onDialogOpenChange}>
          <DialogTrigger
            className="w-full cursor-pointer"
            onClick={() => handleRangeClick(21, 100)}
          >
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row items-center gap-2">
                21-100 <IoCaretDown className={"w-5 h-5"} />
              </div>
              <div className="flex flex-row items-center gap-1">
                <img src={Images.TokenReward} alt="token" className="w-5 h-5" />
                <p className="text-sm font-semibold">500 </p>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="text-white rounded-3xl w-[80%] md:w-full border-none bg-[#21212F] max-h-[80%] overflow-y-auto text-sm">
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
            </DialogHeader>
            {isLoadingRange && <LoadingSpinner className="h-screen"/>}
            {rangeError && <ErrorMessage message={rangeError} />}
            {!isLoadingRange &&
              !rangeError &&
              dialogRankings.map((r) => (
                <div
                  key={r.rank}
                  className={`flex flex-row gap-10 border-b pb-2 truncate ${
                    r.itsMe ? "text-[#FDE047] font-bold" : ""
                  }`}
                >
                  <p>#{r.rank}</p>
                  <p>{r.userId}</p>
                </div>
              ))}
          </DialogContent>
        </Dialog>

        <div className="w-full border-b"></div>
        <div
          className="flex flex-row justify-between items-center cursor-pointer"
          onClick={() => handleRangeClick(101, 500)}
        >
          <div className="flex flex-row items-center gap-2">
            101-500 <IoCaretDown className={"w-5 h-5"} />
          </div>
          <div className="flex flex-row items-center gap-1">
            <img src={Images.TokenReward} alt="token" className="w-5 h-5" />
            <p className="text-sm font-semibold">25 </p>
          </div>
        </div>
        <div className="w-full border-b"></div>
        <div
          className="flex flex-row justify-between items-center cursor-pointer"
          onClick={() => handleRangeClick(501, 1000)}
        >
          <div className="flex flex-row items-center gap-2">
            501-1000 <IoCaretDown className={"w-5 h-5"} />
          </div>
          <div className="flex flex-row items-center gap-1">
            <img src={Images.TokenReward} alt="token" className="w-5 h-5" />
            <p className="text-sm font-semibold">10 </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingSection;
