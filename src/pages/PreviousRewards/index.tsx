// src/pages/PreviousRewards/index.tsx

import React, { useEffect, useState } from "react";
import { TopTitle } from "@/shared/components/ui";
import "./PreviousRewards.css";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import RankingSection from "@/widgets/PreviousRewards/ui/RankingSection";
import RaffleSection from "@/widgets/PreviousRewards/ui/RaffleSection";
import RewardSelectionDialog from "@/widgets/PreviousRewards/ui/RewardSelectionDialog";
import { usePreviousRewardsEntityStore } from '@/entities/PreviousRewards/model/previousRewardsModel';
import { usePreviousRewardsFeatureStore } from '@/features/PreviousRewards/model/previousRewardsModel';
import { useRaffleEntityStore } from '@/entities/PreviousRewards/model/raffleEntityModel';
import { useRaffleFeatureStore } from '@/features/PreviousRewards/model/raffleFeatureModel';

import { selectRankingReward, selectRaffleReward } from "@/features/PreviousRewards/api/rewardApi";

import { PlayerData } from "@/features/PreviousRewards/types/PlayerData";

import LoadingSpinner from "@/shared/components/ui/loadingSpinner"; // LoadingSpinner 임포트
import ErrorMessage from "@/shared/components/ui/ErrorMessage"; // 에러 메시지 컴포넌트 임포트 (선택 사항)

interface RewardData {
  rank: number;
  userId: string;
  slRewards: number;
  usdtRewards: number;
  nftType: string | null;
  selectedRewardType: string | null;
  itsMe?: boolean; // 추가된 필드
}

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

  const {
    myRankings: raffleMyRankings, // 이름 충돌 방지를 위해 별칭 사용
    topRankings: raffleTopRankings,
    isLoadingInitialRaffle,
    errorInitialRaffle,
    loadInitialRaffle,
  } = useRaffleEntityStore();

  const {
    dialogRaffleRankings,
    isLoadingRaffleRange,
    raffleRangeError,
    loadRaffleRangeRanking,
  } = useRaffleFeatureStore();

  const [currentTab, setCurrentTab] = useState<"ranking" | "raffle">("ranking");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [currentRaffleIndex, setCurrentRaffleIndex] = useState(0);

  const [rewardDialogOpen, setRewardDialogOpen] = useState(false);
  const [selectedMyData, setSelectedMyData] = useState<RewardData | null>(null);

  const round = 1; // 예시 라운드 번호. 실제 라운드 번호로 대체하세요.

  useEffect(() => {
    loadInitialRanking();
  }, [loadInitialRanking]);

  useEffect(() => {
    // 래플 탭 진입 시 데이터 없으면 로딩
    if (currentTab === "raffle") {
      if (!raffleMyRankings || raffleMyRankings.length === 0 || !raffleTopRankings || raffleTopRankings.length === 0) {
        loadInitialRaffle();
      }
    }
  }, [currentTab, loadInitialRaffle, raffleMyRankings, raffleTopRankings]);

  const handleRangeClick = async (start: number, end: number) => {
    if (currentTab === "ranking") {
      await loadRangeRanking(start, end);
    } else {
      await loadRaffleRangeRanking(start, end);
    }
    setDialogTitle(`${start}-${end}`);
    setDialogOpen(true);
  };

  const myData = myRanking && myRanking.length > 0 ? myRanking[0] : null;
  const isReceived = myData?.selectedRewardType === "USDT" || myData?.selectedRewardType === "SL";

  const currentRaffleItem = raffleMyRankings && raffleMyRankings.length > 0 ? raffleMyRankings[currentRaffleIndex] : null;
  const raffleIsReceived = currentRaffleItem?.selectedRewardType === "USDT" || currentRaffleItem?.selectedRewardType === "SL";

  // dialogRankings, dialogRaffleRankings -> PlayerData 형태 변환
  const dialogRankingsPlayerData = dialogRankings.map(r => ({
    ...r,
    nftType: r.nftType ?? null,
    selectedRewardType: r.selectedRewardType ?? null,
    // itsMe는 서버에서 이미 설정됨
  }));

  const dialogRaffleRankingsPlayerData = dialogRaffleRankings.map(r => ({
    ...r,
    nftType: r.nftType ?? null,
    selectedRewardType: r.selectedRewardType ?? null,
    // itsMe는 서버에서 이미 설정됨
  }));

  const handleGetReward = async (data: RewardData) => {
    if (data.selectedRewardType !== null) {
      alert("이미 보상을 선택하셨습니다!");
      return;
    }

    if (data.rank <= 20) {
      setSelectedMyData(data);
      setRewardDialogOpen(true);
    } else {
      await handleSelectRewardType("SL", data);
    }
  };

  const handleSelectRewardType = async (type: "USDT" | "SL", overrideData?: RewardData) => {
    const targetData = overrideData ?? selectedMyData;
    if (!targetData) return;

    let updatedData: PlayerData;
    if (currentTab === "ranking") {
      updatedData = await selectRankingReward(round, targetData.rank, type);
      // 상태 업데이트 (Zustand)
      usePreviousRewardsEntityStore.setState((state) => {
        const newMyRanking = state.myRanking ? [...state.myRanking] : [];
        if (newMyRanking.length > 0 && newMyRanking[0].rank === updatedData.rank) {
          newMyRanking[0] = { ...newMyRanking[0], selectedRewardType: updatedData.selectedRewardType };
        }

        const newTopRankings = [...state.topRankings];
        const idx = newTopRankings.findIndex(r => r.rank === updatedData.rank);
        if (idx > -1) {
          newTopRankings[idx] = { ...newTopRankings[idx], selectedRewardType: updatedData.selectedRewardType };
        }

        return {
          myRanking: newMyRanking,
          topRankings: newTopRankings
        };
      });
    } else {
      updatedData = await selectRaffleReward(round, targetData.rank, type);
      // 상태 업데이트 (Zustand)
      useRaffleEntityStore.setState((state) => {
        const newMyRankings = state.myRankings ? [...state.myRankings] : [];
        const idx = newMyRankings.findIndex(r => r.rank === updatedData.rank);
        if (idx > -1) {
          newMyRankings[idx] = { ...newMyRankings[idx], selectedRewardType: updatedData.selectedRewardType };
        }

        const newRaffleTopRankings = [...state.topRankings];
        const topIdx = newRaffleTopRankings.findIndex(r => r.rank === updatedData.rank);
        if (topIdx > -1) {
          newRaffleTopRankings[topIdx] = { ...newRaffleTopRankings[topIdx], selectedRewardType: updatedData.selectedRewardType };
        }

        return {
          myRankings: newMyRankings,
          topRankings: newRaffleTopRankings
        };
      });
    }

    alert("보상을 성공적으로 받았습니다!");
    setSelectedMyData((prev) => prev ? { ...prev, ...updatedData } : null);
    setRewardDialogOpen(false);
  };

  // 로딩/에러 처리
  if (currentTab === "ranking") {
    if (isLoadingInitial) return <LoadingSpinner />;
    if (errorInitial) return <ErrorMessage message={errorInitial} />;
  } else {
    if (isLoadingInitialRaffle) return <LoadingSpinner />;
    if (errorInitialRaffle) return <ErrorMessage message={errorInitialRaffle} />;
  }

  return (
    <div className="flex flex-col mb-44 text-white items-center w-full">
      <TopTitle title="Last month's results" back={true} />

      <RewardSelectionDialog
        open={rewardDialogOpen}
        onClose={() => setRewardDialogOpen(false)}
        data={selectedMyData}
        onSelect={(type) => handleSelectRewardType(type)}
      />

      <Tabs defaultValue="ranking" className="w-full rounded-none" onValueChange={(val) => setCurrentTab(val as "ranking" | "raffle")}>
        <TabsList className="grid w-full grid-cols-2 rounded-none outline-none bg-[#0D1226]">
          <TabsTrigger
            value="ranking"
            className="rounded-none bg-[#0D1226] data-[state=active]:border-b-2 data-[state=active]:border-[#0147E5] data-[state=active]:bg-[#0D1226] text-[#A3A3A3] data-[state=active]:text-white font-normal data-[state=active]:font-semibold text-lg transition-colors border-b-2 border-transparent duration-300 ease-in-out"
          >
            Ranking
          </TabsTrigger>
          <TabsTrigger
            value="raffle"
            className="rounded-none bg-[#0D1226] data-[state=active]:border-b-2 data-[state=active]:border-[#0147E5] data-[state=active]:bg-[#0D1226] text-[#A3A3A3] data-[state=active]:text-white font-normal data-[state=active]:font-semibold text-lg transition-colors border-b-2 border-transparent duration-300 ease-in-out"
          >
            Raffle
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ranking">
          <RankingSection
            myData={myData ? {
              ...myData,
              nftType: myData.nftType ?? null,
              selectedRewardType: myData.selectedRewardType ?? null,
              itsMe: myData.itsMe ?? false, // 추가된 필드
            } : null}
            topRankings={topRankings.map(r => ({
              ...r,
              nftType: r.nftType ?? null,
              selectedRewardType: r.selectedRewardType ?? null,
              itsMe: r.itsMe ?? false, // 추가된 필드
            }))}
            isReceived={isReceived}
            onGetReward={() => {
              if (!myData) return;
              handleGetReward({
                rank: myData.rank,
                userId: myData.userId,
                slRewards: myData.slRewards ?? 0,
                usdtRewards: myData.usdtRewards ?? 0,
                nftType: myData.nftType ?? null,
                selectedRewardType: myData.selectedRewardType ?? null,
                itsMe: myData.itsMe ?? false, // 추가된 필드
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

        <TabsContent value="raffle">
          <RaffleSection
            myRankings={(raffleMyRankings ?? []).map(r => ({
              ...r,
              nftType: r.nftType ?? null,
              selectedRewardType: r.selectedRewardType ?? null,
              itsMe: r.itsMe ?? false, // 추가된 필드
            }))}
            raffleTopRankings={(raffleTopRankings ?? []).map(r => ({
              ...r,
              nftType: r.nftType ?? null,
              selectedRewardType: r.selectedRewardType ?? null,
              itsMe: r.itsMe ?? false, // 추가된 필드
            }))}
            currentRaffleIndex={currentRaffleIndex}
            setCurrentRaffleIndex={setCurrentRaffleIndex}
            raffleIsReceived={raffleIsReceived}
            currentRaffleItem={currentRaffleItem ? {
              ...currentRaffleItem,
              nftType: currentRaffleItem.nftType ?? null,
              selectedRewardType: currentRaffleItem.selectedRewardType ?? null,
              itsMe: currentRaffleItem.itsMe ?? false, // 추가된 필드
            } : null}
            onGetReward={() => {
              if (!currentRaffleItem) return;
              handleGetReward({
                rank: currentRaffleItem.rank,
                userId: currentRaffleItem.userId,
                slRewards: currentRaffleItem.slRewards,
                usdtRewards: currentRaffleItem.usdtRewards,
                nftType: currentRaffleItem.nftType ?? null,
                selectedRewardType: currentRaffleItem.selectedRewardType ?? null,
                itsMe: currentRaffleItem.itsMe ?? false, // 추가된 필드
              });
            }}
            dialogOpen={dialogOpen}
            onDialogOpenChange={setDialogOpen}
            dialogTitle={dialogTitle}
            dialogRaffleRankings={dialogRaffleRankingsPlayerData}
            isLoadingRaffleRange={isLoadingRaffleRange}
            raffleRangeError={raffleRangeError}
            handleRangeClick={handleRangeClick}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PreviousRewards;
