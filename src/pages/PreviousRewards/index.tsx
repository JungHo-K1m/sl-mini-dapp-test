// src/pages/PreviousRewards/index.tsx

import React, { useEffect, useState } from "react";
import { TopTitle } from "@/shared/components/ui";
import Images from "@/shared/assets/images";
import "./PreviousRewards.css";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { IoCaretDown } from "react-icons/io5";

// 초기 데이터는 entities에서 관리
import { usePreviousRewardsEntityStore } from '@/entities/PreviousRewards/model/previousRewardsModel';
// 범위별 조회는 features에서 관리
import { usePreviousRewardsFeatureStore } from '@/features/PreviousRewards/model/previousRewardsModel';

const PreviousRewards: React.FC = () => {
  const {
    myRanking,
    topRankings,
    isLoadingInitial,
    errorInitial,
    loadInitialRanking,
  } = usePreviousRewardsEntityStore();

  const {
    dialogRankings,
    isLoadingRange,
    rangeError,
    loadRangeRanking,
  } = usePreviousRewardsFeatureStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");

  useEffect(() => {
    // 페이지 로드시 초기 데이터 로딩 (entities store)
    loadInitialRanking();
  }, [loadInitialRanking]);

  const handleGetReward = () => {
    alert("Rewarded! (예시)");
  };

  const handleRangeClick = async (start: number, end: number) => {
    // range 데이터는 features store에서 관리
    await loadRangeRanking(start, end);
    setDialogTitle(`${start}-${end}`);
    setDialogOpen(true);
  };

  if (isLoadingInitial) {
    return <div className="text-white">Loading...</div>;
  }
  if (errorInitial) {
    return <div className="text-red-500">{errorInitial}</div>;
  }

  const myData = myRanking && myRanking[0] ? myRanking[0] : null;
  const myRank = myData?.rank;
  const myUserId = myData?.userId;
  const mySl = myData?.slRewards;
  const myUsdt = myData?.usdtRewards;
  const myNft = myData?.nftType;
  const mySelectedRewardType = myData?.selectedRewardType;

  return (
    <div className="flex flex-col  mb-44 text-white items-center w-full ">
      <TopTitle title="Last month's results" />

      <Tabs defaultValue="ranking" className=" w-full rounded-none">
        <TabsList className="grid w-full grid-cols-2 rounded-none outline-none bg-[#0D1226]">
          <TabsTrigger
            value="ranking"
            className="rounded-none bg-[#0D1226] data-[state=active]:border-b-2 data-[state=active]:border-[#0147E5] data-[state=active]:bg-#0D1226 text-[#A3A3A3] data-[state=active]:text-white font-normal data-[state=active]:font-semibold text-lg transition-colors border-b-2 border-transparent duration-300 ease-in-out"
          >
            Ranking
          </TabsTrigger>
          <TabsTrigger
            value="raffle"
            className="rounded-none bg-[#0D1226] data-[state=active]:border-b-2 data-[state=active]:border-[#0147E5] data-[state=active]:bg-#0D1226 text-[#A3A3A3] data-[state=active]:text-white font-normal data-[state=active]:font-semibold text-lg transition-colors border-b-2 border-transparent duration-300 ease-in-out"
          >
            Raffle
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="ranking"
          className="p-6  bg-[#0D1226] text-white w-full h-full"
        >
          <div>
            {myData && myRank && (
              <>
                <p className=" font-semibold">
                  {myUserId === null
                    ? "No ranking data for you."
                    : "Congratulations! Here’s your reward : "}
                </p>
                {myUserId && (
                  <div className="flex flex-row items-center box-bg rounded-3xl h-24 border-2 border-[#0147E5] mt-3 p-5 gap-3 ">
                    <p>{myRank}</p>
                    <div className="flex flex-col gap-1">
                      <p>{myUserId}</p>
                      <div className="flex flex-row items-center gap-1">
                        <img
                          src={Images.TokenReward}
                          alt="token"
                          className="w-5 h-5"
                        />
                        <p className="text-sm font-semibold">
                          {mySl?.toLocaleString()}{" "}
                          <span className="font-normal text-[#a3a3a3]">
                            (or {myUsdt?.toLocaleString()} USDT)
                          </span>{" "}
                          {myNft ? `+ ${myNft} NFT` : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {myUserId && (
                  <button
                    className="bg-[#0147E5] rounded-full w-full h-14 mt-3 font-medium"
                    onClick={handleGetReward}
                    disabled={mySelectedRewardType === "USDT" || mySelectedRewardType === "SL"}
                  >
                    {mySelectedRewardType === null
                      ? "Get Rewarded"
                      : `Reward Selected (${mySelectedRewardType})`}
                  </button>
                )}
              </>
            )}
          </div>
          <div className="flex flex-col mt-8">
            {/* 1위~20위 랭킹 표시 */}
            {topRankings.slice(0, 20).map((r) => (
              <div
                key={r.rank}
                className="flex flex-row items-center p-4 border-b  gap-4 "
              >
                <p>{r.rank}</p>
                <div className="flex flex-col gap-1">
                  <p>{r.userId}</p>
                  <div className="flex flex-row items-center gap-1">
                    <img
                      src={Images.TokenReward}
                      alt="token"
                      className="w-5 h-5"
                    />
                    <p
                      className={`text-sm font-semibold ${
                        r.itsMe ? "text-[#fde047]" : ""
                      }`}
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
            ))}
          </div>
          <div className=" mt-14 space-y-4">
            {/* 21-100 */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                      <span className="font-normal text-[#a3a3a3]">
                        (or 50 USDT)
                      </span>{" "}
                    </p>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="  text-white rounded-3xl w-[80%] md:w-full border-none bg-[#21212F] max-h-[80%] overflow-y-auto text-sm">
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
                      className={`flex flex-row gap-10 border-b pb-2 truncate ${
                        r.userId === myUserId ? "text-[#fde047] font-bold" : ""
                      }`}
                    >
                      <p>{r.rank}</p>
                      <p>{r.userId}</p>
                    </div>
                  ))}
              </DialogContent>
            </Dialog>

            <div className="w-full border-b"></div>
            {/* 101-500 */}
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
                  <span className="font-normal text-[#a3a3a3]">
                    (or 2.5 USDT)
                  </span>{" "}
                </p>
              </div>
            </div>
            <div className="w-full border-b"></div>
            {/* 501-1000 */}
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
                  <span className="font-normal text-[#a3a3a3]">
                    (or 1 USDT)
                  </span>{" "}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="raffle" className="p-6 bg-[#0D1226]  text-white">
          {/* raffle 탭 구현 부분. 추후 raffle용 API 존재 시 비슷하게 처리 */}
          <p>Raffle Results Placeholder</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PreviousRewards;
