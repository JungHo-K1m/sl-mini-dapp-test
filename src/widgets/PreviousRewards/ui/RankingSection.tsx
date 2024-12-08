import React from "react";
import Images from "@/shared/assets/images";
import { IoCaretDown } from "react-icons/io5";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { PlayerData } from "@/features/PreviousRewards/types/PlayerData";

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
  myData,
  topRankings,
  isReceived,
  onGetReward,
  dialogOpen,
  onDialogOpenChange,
  dialogTitle,
  dialogRankings,
  isLoadingRange,
  rangeError,
  handleRangeClick
}) => {

  return (
    <div className="p-6 bg-[#0D1226] text-white w-full h-full">
      <div>
        {myData && myData.rank && (
          <>
            <p className=" font-semibold">
              {myData.userId === null
                ? "No ranking data for you."
                : "Congratulations! Here’s your reward : "}
            </p>
            {myData.userId && (
              <div className="relative flex flex-row items-center box-bg rounded-3xl h-24 border-2 border-[#0147E5] mt-3 p-5 gap-3 ">
                {isReceived && (
                  <div className="absolute top-2 right-2 bg-[#0147E5] rounded-full px-3 py-1 text-sm">
                    Received
                  </div>
                )}
                <p>{myData.rank}</p>
                <div className="flex flex-col gap-1">
                  <p>{myData.userId}</p>
                  <div className="flex flex-row items-center gap-1">
                    <img
                      src={myData.selectedRewardType === "USDT" ? Images.Usdt : Images.TokenReward}
                      alt="token"
                      className="w-5 h-5"
                    />
                    <p className="text-sm font-semibold">
                      {(myData.slRewards ?? 0).toLocaleString()}{" "}
                      <span className="font-normal text-[#a3a3a3]">
                        (or {(myData.usdtRewards ?? 0).toLocaleString()} USDT)
                      </span>{" "}
                      {myData.nftType ? `+ ${myData.nftType} NFT` : ""}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {myData.userId && (
              <button
                className={`bg-[#0147E5] rounded-full w-full h-14 mt-3 font-medium ${
                  isReceived ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={onGetReward}
                disabled={isReceived}
              >
                {myData.selectedRewardType === null
                  ? "Get Rewarded"
                  : `Reward Selected (${myData.selectedRewardType})`}
              </button>
            )}
          </>
        )}
      </div>
      <div className="flex flex-col mt-8">
        {topRankings.slice(0, 20).map((r) => {
          const rReceived = r.selectedRewardType === "USDT" || r.selectedRewardType === "SL";
          return (
            <div
              key={r.rank}
              className={`relative flex flex-row items-center p-4 border-b gap-4 `}
            >
              <p>{r.rank}</p>
              <div className="flex flex-col gap-1">
                <p>{r.userId}</p>
                <div className={`flex flex-row items-center gap-1 `}>
                  <img
                    src={r.selectedRewardType === "USDT" ? Images.Usdt : Images.TokenReward}
                    alt="token"
                    className="w-5 h-5"
                  />
                  <p
                    className={`text-sm font-semibold `}
                  >
                    {r.slRewards.toLocaleString()}{" "}
                    <span className="font-normal text-[#a3a3a3]">
                      (or {r.usdtRewards.toLocaleString()} USDT)
                    </span>{" "}
                    {r.nftType ? `+ ${r.nftType} NFT` : ""}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-14 space-y-4">
        <Dialog open={dialogOpen} onOpenChange={onDialogOpenChange}>
          <DialogTrigger
            className="w-full"
            onClick={() => handleRangeClick(21, 100)}
          >
            <div className="flex flex-row justify-between items-center ">
              <div className="flex flex-row items-center gap-2">
                21-100 <IoCaretDown className={"w-5 h-5"} />
              </div>
              <div className="flex flex-row items-center gap-1">
                <img
                  src={Images.TokenReward}
                  alt="token"
                  className="w-5 h-5"
                />
                <p className="text-sm font-semibold">
                  500{" "}
            
                </p>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="text-white rounded-3xl w-[80%] md:w-full border-none bg-[#21212F] max-h-[80%] overflow-y-auto text-sm">
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
            </DialogHeader>
            {isLoadingRange && <div>Loading...</div>}
            {rangeError && <div className="text-red-500">{rangeError}</div>}
            {!isLoadingRange &&
              !rangeError &&
              dialogRankings.map((r) => (
                <div
                  key={r.rank}
                  className={`flex flex-row gap-10 border-b pb-2 truncate ${r.itsMe ? "text-[#FDE047] font-bold" : ""}`}
                >
                  <p>{r.rank}</p>
                  <p>{r.userId}</p>
                </div>
              ))}
          </DialogContent>
        </Dialog>

        <div className="w-full border-b"></div>
        <div
          className="flex flex-row justify-between items-center  cursor-pointer"
          onClick={() => handleRangeClick(101, 500)}
        >
          <div className="flex flex-row items-center gap-2">
            101-500 <IoCaretDown className={"w-5 h-5"} />
          </div>
          <div className="flex flex-row items-center gap-1">
            <img src={Images.TokenReward} alt="token" className="w-5 h-5" />
            <p className="text-sm font-semibold">
              25{" "}
            
            </p>
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
            <p className="text-sm font-semibold">
              10{" "}
          
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingSection;
