// src/widgets/PreviousRewards/ui/RaffleSection.tsx

import React from "react";
import Images from "@/shared/assets/images";
import { IoCaretDown } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { PlayerData } from "@/features/PreviousRewards/types/PlayerData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import "swiper/css";
import "swiper/css/pagination";
import LoadingSpinner from "@/shared/components/ui/loadingSpinner";
import ErrorMessage from "@/shared/components/ui/ErrorMessage"; // 에러 메시지 컴포넌트 임포트
import { useTranslation } from "react-i18next";



interface RaffleSectionProps {
  myRankings: PlayerData[];
  raffleTopRankings: PlayerData[];
  currentRaffleIndex: number;
  setCurrentRaffleIndex: (index: number) => void;
  raffleIsReceived: boolean;
  currentRaffleItem: PlayerData | null;
  onGetReward: () => void;
  dialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  dialogTitle: string;
  dialogRaffleRankings: PlayerData[];
  isLoadingRaffleRange: boolean;
  raffleRangeError: string | null;
  handleRangeClick: (start: number, end: number) => void;
  currentUserId?: string;
  isLoadingInitialRaffle: boolean; // 추가된 prop
}

const RaffleSection: React.FC<RaffleSectionProps> = ({
  myRankings = [], // 기본값 설정
  raffleTopRankings = [], // 기본값 설정
  currentRaffleIndex,
  setCurrentRaffleIndex,
  raffleIsReceived,
  currentRaffleItem,
  onGetReward,
  dialogOpen,
  onDialogOpenChange,
  dialogTitle,
  dialogRaffleRankings,
  isLoadingRaffleRange,
  raffleRangeError,
  handleRangeClick,
  currentUserId,
  isLoadingInitialRaffle,
}) => {
  // 총 보상 개수
  const totalRewards = myRankings.length;
  const { t } = useTranslation();

  // 아직 받지 않은 보상 개수
  const leftRewards = myRankings.filter(
    (r) => r.selectedRewardType === null
  ).length;

  if (isLoadingInitialRaffle) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner className="h-screen"/> {/* 로딩 스피너 컴포넌트 사용 */}
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#0D1226] text-white w-full h-full">
      {myRankings && myRankings.length > 0 ? (
        <>
          {/* 보상 정보 표시 */}
          <p className="font-semibold text-sm">
            {totalRewards} Rewards. Swipe to Check! {leftRewards} Left.
          </p>
          <div className="mt-4">
            <Swiper
              modules={[Pagination]}
              pagination={{
                el: ".my-pagination",
                clickable: true,
              }}
              spaceBetween={16}
              slidesPerView={1}
              onSlideChange={(swiper) => {
                setCurrentRaffleIndex(swiper.activeIndex);
              }}
            >
              {myRankings.map((item, index) => {
                const isRaffleReceived =
                  item.selectedRewardType === "USDC" ||
                  item.selectedRewardType === "SL";
                return (
                  <SwiperSlide key={index}>
                    <div className="relative flex flex-col box-bg rounded-3xl border-2 border-[#0147E5] p-5  h-24 justify-between">
                      {isRaffleReceived && (
                        <div className="absolute top-2 right-2 bg-[#0147E5] rounded-full px-3 py-1 text-sm">
                          {t("reward_page.recieved")}
                        </div>
                      )}
                      <div className="flex flex-row items-center gap-3">
                        <p>#{item.rank}</p>
                        <div className="flex flex-col gap-1">
                          <p>{item.userId}</p>
                          <div className="flex flex-row items-center gap-1">
                            <img
                              src={
                                item.selectedRewardType === "USDC"
                                  ? Images.USDC
                                  : Images.TokenReward
                              }
                              alt="token"
                              className="w-5 h-5"
                            />
                            <p className="text-sm font-semibold">
                              {(item.slRewards ?? 0).toLocaleString()}{" "}
                              <span className="font-normal text-[#a3a3a3]">
                                (or {(item.usdcRewards ?? 0).toLocaleString()} USDC)
                              </span>{" "}
                              {item.nftType ? `+ ${item.nftType} NFT` : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
          <div className="my-pagination w-full flex items-center justify-center mt-4"></div>

          {/*
            현재 슬라이드로 선택된 래플 아이템이 존재하며,
            그 랭킹이 20등 이내일 때만 보상 버튼 노출
          */}
          {currentRaffleItem && currentRaffleItem.rank <= 20 && (
            <button
              className={`bg-[#0147E5] rounded-full w-full h-14 mt-6 font-medium ${
                raffleIsReceived ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={onGetReward}
              disabled={raffleIsReceived}
            >
              {currentRaffleItem.selectedRewardType === null
                ? "Select your reward"
                : `Reward Issued (${currentRaffleItem.selectedRewardType})`}
            </button>
          )}
        </>
      ) : (
        // 보상 데이터가 없는 경우
        <div className="relative flex flex-col box-bg rounded-3xl border-2 border-[#0147E5] p-5 h-full justify-between">
          <p className="font-semibold text-sm text-center">
            {t("reward_page.better_luck")} <br />
            {t("reward_page.next_raffle")}
          </p>
        </div>
      )}

      {/* Top Rankings */}
      <div className="flex flex-col mt-8">
      <p className="font-semibold">{t("reward_page.raffle_winner")}</p>
        {raffleTopRankings.length > 0 ? (
          raffleTopRankings.slice(0, 20).map((r) => {
            const raffleTopReceived =
              r.selectedRewardType === "USDC" || r.selectedRewardType === "SL";
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
                        <img
                          src={Images.USDC}
                          alt="token"
                          className="w-5 h-5"
                        />
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
          <p className="text-center text-sm">{t("reward_page.no_ranking")}</p>
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
                <p className="text-sm font-semibold">500</p>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="text-white rounded-3xl w-[80%] md:w-full border-none bg-[#21212F] max-h-[80%] overflow-y-auto text-sm">
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
            </DialogHeader>
            {isLoadingRaffleRange && <LoadingSpinner className="h-screen"/>}
            {raffleRangeError && <ErrorMessage message={raffleRangeError} />}
            {!isLoadingRaffleRange &&
              !raffleRangeError &&
              dialogRaffleRankings.map((r) => (
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
            <p className="text-sm font-semibold">25</p>
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
            <p className="text-sm font-semibold">10</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaffleSection;
