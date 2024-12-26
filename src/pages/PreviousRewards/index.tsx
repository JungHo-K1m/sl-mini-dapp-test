/** src/pages/PreviousRewards/index.tsx */

import React, { useEffect, useState } from "react";
import { TopTitle } from "@/shared/components/ui";
import "./PreviousRewards.css";

// Tabs
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

// Ranking
import RankingSection from "@/widgets/PreviousRewards/ui/RankingSection";
import {
  usePreviousRewardsEntityStore,
} from "@/entities/PreviousRewards/model/previousRewardsModel";
import {
  usePreviousRewardsFeatureStore,
} from "@/features/PreviousRewards/model/previousRewardsModel";

// Raffle
import RaffleSection from "@/widgets/PreviousRewards/ui/RaffleSection";
import { useRaffleEntityStore } from "@/entities/PreviousRewards/model/raffleEntityModel";
import { useRaffleFeatureStore } from "@/features/PreviousRewards/model/raffleFeatureModel";

// Airdrop
import AirdropSection from "@/widgets/PreviousRewards/ui/AirdropSection";
import { useAirdropEntityStore } from "@/entities/PreviousRewards/model/airdropEntityModel";

// Reward selection dialog
import RewardSelectionDialog from "@/widgets/PreviousRewards/ui/RewardSelectionDialog";
import { selectRankingReward, selectRaffleReward } from "@/features/PreviousRewards/api/rewardApi";

// Types
import { PlayerData } from "@/features/PreviousRewards/types/PlayerData";

// 임시 인터페이스(RewardSelectionDialog에서 쓰이는 형태)
interface RewardData {
  rank: number;
  userId: string;
  slRewards: number;
  usdcRewards: number;
  nftType: string | null;
  selectedRewardType: string | null;
  itsMe?: boolean;
}

const PreviousRewards: React.FC = () => {
  // -----------------------------
  // 1) Ranking 관련 Zustand
  // -----------------------------
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

  // -----------------------------
  // 2) Raffle 관련 Zustand
  // -----------------------------
  const {
    myRankings: raffleMyRankings,
    topRankings: raffleTopRankings,
    isLoadingInitialRaffle,
    errorInitialRaffle,
    hasLoadedInitialRaffle,
    loadInitialRaffle,
  } = useRaffleEntityStore();

  const {
    dialogRaffleRankings,
    isLoadingRaffleRange,
    raffleRangeError,
    loadRaffleRangeRanking,
  } = useRaffleFeatureStore();

  // -----------------------------
  // 3) Airdrop 관련 Zustand
  // -----------------------------
  const {
    winners,
    myReward,
    isLoadingAirdrop,
    errorAirdrop,
    hasLoadedAirdrop,
    loadAirdrop,
  } = useAirdropEntityStore();

  // -----------------------------
  // 탭 전환 관리
  // -----------------------------
  const [currentTab, setCurrentTab] = useState<"ranking" | "raffle" | "airdrop">("ranking");

  // -----------------------------
  // 랭킹/래플 보상 선택 다이얼로그 관련
  // -----------------------------
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false);
  const [selectedMyData, setSelectedMyData] = useState<RewardData | null>(null);

  // -----------------------------
  // 래플 슬라이드 인덱스
  // -----------------------------
  const [currentRaffleIndex, setCurrentRaffleIndex] = useState(0);

  // -----------------------------
  // Range 랭킹 모달 다이얼로그
  // -----------------------------
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");

  // 라운드 번호 (예시)
  const round = 1;

  // -----------------------------
  // 페이지 진입 시 Ranking 데이터 로딩
  // -----------------------------
  useEffect(() => {
    loadInitialRanking();
  }, [loadInitialRanking]);

  // -----------------------------
  // 래플 탭 진입 시, 아직 로딩 안 했다면 Raffle 데이터 로딩
  // -----------------------------
  useEffect(() => {
    if (currentTab === "raffle" && !hasLoadedInitialRaffle) {
      loadInitialRaffle();
    }
  }, [currentTab, hasLoadedInitialRaffle, loadInitialRaffle]);

  // -----------------------------
  // 에어드롭 탭 진입 시, 아직 로딩 안 했다면 Airdrop 데이터 로딩
  // -----------------------------
  useEffect(() => {
    if (currentTab === "airdrop" && !hasLoadedAirdrop) {
      loadAirdrop();
    }
  }, [currentTab, hasLoadedAirdrop, loadAirdrop]);

  // ------------------------------------------------------
  // Range 랭킹 모달 열기 (Ranking or Raffle 탭에서 공용 사용)
  // ------------------------------------------------------
  const handleRangeClick = async (start: number, end: number) => {
    if (currentTab === "ranking") {
      await loadRangeRanking(start, end);
    } else if (currentTab === "raffle") {
      await loadRaffleRangeRanking(start, end);
    }
    setDialogTitle(`${start}-${end}`);
    setDialogOpen(true);
  };

  // -----------------------------
  // 랭킹 탭 - 내 정보
  // -----------------------------
  const myData = myRanking && myRanking.length > 0 ? myRanking[0] : null;
  const isReceived =
    myData?.selectedRewardType === "USDC" ||
    myData?.selectedRewardType === "SL";

  // -----------------------------
  // 래플 탭 - 내 데이터 슬라이드
  // -----------------------------
  const currentRaffleItem =
    raffleMyRankings && raffleMyRankings.length > 0
      ? raffleMyRankings[currentRaffleIndex]
      : null;

  const raffleIsReceived =
    currentRaffleItem?.selectedRewardType === "USDC" ||
    currentRaffleItem?.selectedRewardType === "SL";

  // -----------------------------
  // 모달에 뿌릴 데이터 (Ranking/Raffle)
  // -----------------------------
  const dialogRankingsPlayerData: PlayerData[] = dialogRankings.map(r => ({
    ...r,
    nftType: r.nftType ?? null,
    selectedRewardType: r.selectedRewardType ?? null,
  }));

  const dialogRaffleRankingsPlayerData: PlayerData[] = dialogRaffleRankings.map(r => ({
    ...r,
    nftType: r.nftType ?? null,
    selectedRewardType: r.selectedRewardType ?? null,
  }));

  // ------------------------------------------------------
  // 보상 수령(랭킹/래플 공용)
  // ------------------------------------------------------
  const handleGetReward = async (data: RewardData) => {
    if (data.selectedRewardType !== null) {
      alert("이미 보상을 선택하셨습니다!");
      return;
    }
    // 1~20등인 경우, 보상 선택 다이얼로그 표시
    if (data.rank <= 20) {
      setSelectedMyData(data);
      setRewardDialogOpen(true);
    } 
    // 21등 이상인 경우, SL로 자동 지급
    else {
      await handleSelectRewardType("SL", data);
    }
  };

  // ------------------------------------------------------
  // 보상 선택(랭킹/래플)
  // ------------------------------------------------------
  const handleSelectRewardType = async (
    type: "USDC" | "SL",
    overrideData?: RewardData
  ) => {
    const targetData = overrideData ?? selectedMyData;
    if (!targetData) return;

    let updatedData: PlayerData;

    // 랭킹 탭
    if (currentTab === "ranking") {
      updatedData = await selectRankingReward(round, targetData.rank, type);

      // Zustand로 상태 업데이트
      usePreviousRewardsEntityStore.setState((state) => {
        const newMyRanking = state.myRanking ? [...state.myRanking] : [];
        // 내 랭킹(배열 첫 번째 요소) 갱신
        if (newMyRanking.length > 0 && newMyRanking[0].rank === updatedData.rank) {
          newMyRanking[0] = { 
            ...newMyRanking[0],
            selectedRewardType: updatedData.selectedRewardType,
          };
        }
        // topRankings 갱신
        const newTopRankings = [...state.topRankings];
        const idx = newTopRankings.findIndex(r => r.rank === updatedData.rank);
        if (idx > -1) {
          newTopRankings[idx] = { 
            ...newTopRankings[idx],
            selectedRewardType: updatedData.selectedRewardType,
          };
        }
        return {
          myRanking: newMyRanking,
          topRankings: newTopRankings,
        };
      });
    } 
    // 래플 탭
    else if (currentTab === "raffle") {
      updatedData = await selectRaffleReward(round, targetData.rank, type);

      // Zustand로 상태 업데이트
      useRaffleEntityStore.setState((state) => {
        // myRankings 갱신
        const newMyRankings = state.myRankings ? [...state.myRankings] : [];
        const idx = newMyRankings.findIndex(r => r.rank === updatedData.rank);
        if (idx > -1) {
          newMyRankings[idx] = {
            ...newMyRankings[idx],
            selectedRewardType: updatedData.selectedRewardType,
          };
        }
        // topRankings 갱신
        const newRaffleTopRankings = [...state.topRankings];
        const topIdx = newRaffleTopRankings.findIndex(r => r.rank === updatedData.rank);
        if (topIdx > -1) {
          newRaffleTopRankings[topIdx] = {
            ...newRaffleTopRankings[topIdx],
            selectedRewardType: updatedData.selectedRewardType,
          };
        }
        return {
          myRankings: newMyRankings,
          topRankings: newRaffleTopRankings,
        };
      });
    } else {
      return;
    }

    alert("Reward received successfully!");
    setSelectedMyData((prev) => prev ? { ...prev, ...updatedData } : null);
    setRewardDialogOpen(false);
  };

  // -----------------------------
  // JSX 리턴
  // -----------------------------
  return (
    <div className="flex flex-col mb-44 text-white items-center w-full ">
      <TopTitle title="Last month's results" className="px-6" back={true} />

      {/* 보상 선택 다이얼로그 (랭킹 or 래플) */}
      <RewardSelectionDialog
        open={rewardDialogOpen}
        onClose={() => setRewardDialogOpen(false)}
        data={selectedMyData}
        onSelect={(type) => handleSelectRewardType(type)}
      />

      {/* Tabs */}
      <Tabs
        defaultValue="ranking"
        className="w-full rounded-none"
        onValueChange={(val) => 
          setCurrentTab(val as "ranking" | "raffle" | "airdrop")
        }
      >
        <TabsList className="grid w-full grid-cols-3 rounded-none outline-none bg-[#0D1226]">
          {/* 1. Ranking 탭 */}
          <TabsTrigger
            value="ranking"
            className="rounded-none bg-[#0D1226]
              data-[state=active]:border-b-2 data-[state=active]:border-[#0147E5]
              data-[state=active]:bg-[#0D1226] text-[#A3A3A3]
              data-[state=active]:text-white font-normal data-[state=active]:font-semibold
              text-lg transition-colors border-b-2 border-transparent duration-300 ease-in-out"
          >
            Ranking
          </TabsTrigger>

          {/* 2. Raffle 탭 */}
          <TabsTrigger
            value="raffle"
            className="rounded-none bg-[#0D1226]
              data-[state=active]:border-b-2 data-[state=active]:border-[#0147E5]
              data-[state=active]:bg-[#0D1226] text-[#A3A3A3]
              data-[state=active]:text-white font-normal data-[state=active]:font-semibold
              text-lg transition-colors border-b-2 border-transparent duration-300 ease-in-out"
          >
            Raffle
          </TabsTrigger>

          {/* 3. Airdrop 탭 */}
          <TabsTrigger
            value="airdrop"
            className="rounded-none bg-[#0D1226]
              data-[state=active]:border-b-2 data-[state=active]:border-[#0147E5]
              data-[state=active]:bg-[#0D1226] text-[#A3A3A3]
              data-[state=active]:text-white font-normal data-[state=active]:font-semibold
              text-lg transition-colors border-b-2 border-transparent duration-300 ease-in-out"
          >
            Airdrop
          </TabsTrigger>
        </TabsList>

        {/* 1) Ranking 탭 내용 */}
        <TabsContent value="ranking">
          <RankingSection
            myData={
              myData
                ? {
                    ...myData,
                    nftType: myData.nftType ?? null,
                    selectedRewardType: myData.selectedRewardType ?? null,
                    itsMe: myData.itsMe ?? false,
                  }
                : null
            }
            topRankings={topRankings.map((r) => ({
              ...r,
              nftType: r.nftType ?? null,
              selectedRewardType: r.selectedRewardType ?? null,
              itsMe: r.itsMe ?? false,
            }))}
            isReceived={isReceived}
            onGetReward={() => {
              if (!myData) return;
              handleGetReward({
                rank: myData.rank,
                userId: myData.userId,
                slRewards: myData.slRewards ?? 0,
                usdcRewards: myData.usdcRewards ?? 0,
                nftType: myData.nftType ?? null,
                selectedRewardType: myData.selectedRewardType ?? null,
                itsMe: myData.itsMe ?? false,
              });
            }}
            dialogOpen={dialogOpen}
            onDialogOpenChange={setDialogOpen}
            dialogTitle={dialogTitle}
            dialogRankings={dialogRankingsPlayerData}
            isLoadingRange={isLoadingRange}
            rangeError={rangeError}
            handleRangeClick={handleRangeClick}
          />
        </TabsContent>

        {/* 2) Raffle 탭 내용 */}
        <TabsContent value="raffle">
          <RaffleSection
            myRankings={
              (raffleMyRankings ?? []).map((r) => ({
                ...r,
                nftType: r.nftType ?? null,
                selectedRewardType: r.selectedRewardType ?? null,
                itsMe: r.itsMe ?? false,
              }))
            }
            raffleTopRankings={
              (raffleTopRankings ?? []).map((r) => ({
                ...r,
                nftType: r.nftType ?? null,
                selectedRewardType: r.selectedRewardType ?? null,
                itsMe: r.itsMe ?? false,
              }))
            }
            currentRaffleIndex={currentRaffleIndex}
            setCurrentRaffleIndex={setCurrentRaffleIndex}
            raffleIsReceived={raffleIsReceived}
            currentRaffleItem={
              currentRaffleItem
                ? {
                    ...currentRaffleItem,
                    nftType: currentRaffleItem.nftType ?? null,
                    selectedRewardType:
                      currentRaffleItem.selectedRewardType ?? null,
                    itsMe: currentRaffleItem.itsMe ?? false,
                  }
                : null
            }
            onGetReward={() => {
              if (!currentRaffleItem) return;
              handleGetReward({
                rank: currentRaffleItem.rank,
                userId: currentRaffleItem.userId,
                slRewards: currentRaffleItem.slRewards,
                usdcRewards: currentRaffleItem.usdcRewards,
                nftType: currentRaffleItem.nftType ?? null,
                selectedRewardType:
                  currentRaffleItem.selectedRewardType ?? null,
                itsMe: currentRaffleItem.itsMe ?? false,
              });
            }}
            dialogOpen={dialogOpen}
            onDialogOpenChange={setDialogOpen}
            dialogTitle={dialogTitle}
            dialogRaffleRankings={dialogRaffleRankingsPlayerData}
            isLoadingRaffleRange={isLoadingRaffleRange}
            raffleRangeError={raffleRangeError}
            handleRangeClick={handleRangeClick}
            isLoadingInitialRaffle={isLoadingInitialRaffle}
          />
        </TabsContent>

        {/* 3) Airdrop 탭 내용 */}
        <TabsContent value="airdrop">
          <AirdropSection
            winners={winners}
            myReward={myReward}
            isLoadingAirdrop={isLoadingAirdrop}
            errorAirdrop={errorAirdrop}
            onLoadAirdrop={loadAirdrop}
            hasLoadedAirdrop={hasLoadedAirdrop}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PreviousRewards;
