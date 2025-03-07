// src/pages/MissionPage.tsx

import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui";
import { HiX } from "react-icons/hi";
import { TopTitle } from "@/shared/components/ui";
import "./MissionPage.css";
import Images from "@/shared/assets/images";
import missionImageMap from "@/shared/assets/images/missionImageMap";
// ★ 미션 이름 번역용 매핑 테이블
import { missionNamesMap } from "./missionNameMap";
import { Link } from "react-router-dom";
import {
  useMissionStore,
  Mission,
} from "@/entities/Mission/model/missionModel";
import { formatNumber } from "@/shared/utils/formatNumber";
import LoadingSpinner from "@/shared/components/ui/loadingSpinner"; // 로딩 스피너
import { preloadImages } from "@/shared/utils/preloadImages"; // 이미지 프리로딩 함수
import { useTranslation } from "react-i18next";
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";
import Attendance from "@/widgets/Attendance";


interface OneTimeMissionCardProps {
  mission: Mission;
  onClear: (id: number) => void;
  onMissionCleared: (mission: Mission) => void;
}

const OneTimeMissionCard: React.FC<OneTimeMissionCardProps> = ({
  mission,
  onClear,
  onMissionCleared,
}) => {
  const mapping = missionImageMap[mission.name];
  const imageSrc = mapping ? Images[mapping.imageKey] : Images.TokenReward;
  const className = mapping ? mapping.className : "";
  const { t } = useTranslation();
  const { playSfx } = useSound();

  // 번역 키로부터 실제 번역된 문자열을 가져옴
  const translatedName = missionNamesMap[mission.name]
    ? t(missionNamesMap[mission.name])
    : mission.name;

  // 추가: status가 "pending" 인지 체크
  const isPending = mission.status === "PENDING";

  const handleClick = () => {
    playSfx(Audios.button_click);

    if (!mission.isCleared && !isPending) {
      if (mission.redirectUrl) {
        window.open(mission.redirectUrl, "_blank");
      }
      onClear(mission.id);
      onMissionCleared(mission);
    }
  };

  return (
    <div
      className={`relative flex flex-col rounded-3xl h-36 items-center justify-center gap-3 cursor-pointer ${className} ${
        mission.isCleared || isPending ? "pointer-events-none" : ""
      }`}
      onClick={handleClick}
      role="button"
      aria-label={`Mission: ${mission.name}`}
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter") handleClick();
      }}
    >
      {/* 미션이 완료되었거나 pending이면 어둡게 처리 */}
      {(mission.isCleared || isPending) && (
        <div className="absolute inset-0 bg-gray-950 bg-opacity-60 rounded-3xl z-10" />
      )}

      <div className="relative flex flex-col items-center justify-center z-0">
        <img src={imageSrc} alt={mission.name} className="w-9 h-9" />
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm font-medium">{translatedName}</p>
          <p className="font-semibold text-sm flex flex-row items-center gap-1">
            +{mission.diceReward}{" "}
            <img src={Images.Dice} alt="dice" className="w-4 h-4" /> +
            {formatNumber(mission.starReward)}{" "}
            <img src={Images.Star} alt="star" className="w-4 h-4" />
          </p>
        </div>
      </div>

      {/* 완료된 미션이면 Completed 배지 표시 */}
      {mission.isCleared && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-white text-sm font-semibold rounded-full px-4 py-2 z-20 flex items-center justify-center gap-2">
          <img
            src={Images.MissionCompleted}
            alt="Mission Completed"
            className="w-5 h-5"
          />
          <p>{t("mission_page.Completed")}</p>
        </div>
      )}

      {/* pending 상태이면 로딩 스피너 오버레이 (어둡게 처리된 위에 표시) */}
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

interface DailyMissionProps {
  title: string;
  image: string;
  alt: string;
}

const DailyMissionCard: React.FC<DailyMissionProps> = ({ title, image, alt }) => {
  const { t } = useTranslation();
  return (
    <div className="basic-mission-card h-36 rounded-3xl flex flex-row items-center pl-8 pr-5 justify-between mb-3">
      <div className="space-y-3">
        <p className="text-xl font-semibold">{title}</p>
        <p className="text-sm">
          {t("mission_page.Earn_various_rewards")} <br className="md:hidden" />
          {t("mission_page.such_as_dice,_points,_SL_coins")}
        </p>
      </div>
      <img src={image} alt={alt} className="w-24 h-24" />
    </div>
  );
};

const MissionPage: React.FC = () => {
  // 1) 이미지 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const { playSfx } = useSound();

  // 이벤트 배너 표시 여부
  const [eventShow, setEventShow] = useState(true);

  // 2) 미션 스토어
  const { missions, loading, error, fetchMissions, clearMission } =
    useMissionStore();

  // 3) 보상 다이얼로그
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rewardData, setRewardData] = useState<{
    diceReward: number;
    starReward: number;
    amount?: number;
    spinType: string;
  } | null>(null);

  // 4) Preload할 이미지 목록 구성
  const mappedImages = Object.values(missionImageMap).flatMap((item) => {
    return Images[item.imageKey] ? [Images[item.imageKey]] : [];
  });

  const imagesToLoad = [
    Images.MissionCompleted,
    Images.TokenReward,
    Images.LargeTwitter,
    Images.Star,
    Images.Dice,
    Images.InviteFriend,
    ...mappedImages,
  ];

  // 5) 이미지 프리로딩 후 isLoading = false
  useEffect(() => {
    const loadAllImages = async () => {
      try {
        await preloadImages(imagesToLoad);
      } catch (error) {
        console.error("이미지 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAllImages();
  }, [imagesToLoad]);

  // 6) 미션 데이터 불러오기
  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  // 7) 미션 클리어 시 보상 처리
  const handleMissionCleared = (mission: Mission) => {
    setRewardData({
      diceReward: mission.diceReward,
      starReward: mission.starReward,
      spinType: "MISSION",
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    playSfx(Audios.button_click);
    setIsDialogOpen(false);
    setRewardData(null);
  };

  const handleClearMission = async (id: number) => {
    await clearMission(id);
    const clearedMission = missions.find((m) => m.id === id);
    if (clearedMission) {
      handleMissionCleared(clearedMission);
    }
  };

  // 8) 이미지 로딩 중이면 Spinner 표시
  if (isLoading) {
    return <LoadingSpinner className="h-screen" />;
  }

  // 미션 배열을 완료/미완료로 분리
  const incompleteMissions = missions.filter((m) => !m.isCleared);
  const completedMissions = missions.filter((m) => m.isCleared);

  // 9) 로딩 끝난 후 실제 페이지 렌더
  return (
    <div className="flex flex-col text-white mb-20 md:mb-96">
      <TopTitle title={t("mission_page.Mission")} />

      {/* 이벤트 배너 표시 */}
      {eventShow && (
        <div
          className="w-full h-[150px] bg-cover bg-center flex items-center justify-between px-6 mb-4"
          style={{
            backgroundImage: `url(${Images.eventBanner})`,
          }}
        >
          <div className="text-white">
            <p className="font-bold text-2xl">{t("mission_page.air_drop")}</p>
            <p className="font-bold text-2xl">{t("mission_page.grab")}</p>
          </div>
          <img
            src={Images.eventBox}
            alt="Event Box"
            className="w-[100px] h-[108px]"
          />
        </div>
      )}

      {/* 출석 위젯 */}
      <h1 className="font-semibold text-lg ml-7">
        {t("dice_event.attendance")}
      </h1>
      <div className="mx-6">
        <Attendance />
      </div>

      {/* 미완료 미션 */}
      <h1 className="font-semibold text-lg mb-4 ml-7 mt-5">
        {t("mission_page.One_Time_Mission")}
      </h1>

      <div className="grid grid-cols-2 gap-3 mx-6">
        {incompleteMissions.map((mission) => {
          if (mission.name !== "Leave a Supportive Comment on SL X") {
            return (
              <OneTimeMissionCard
                key={mission.id}
                mission={mission}
                onClear={handleClearMission}
                onMissionCleared={handleMissionCleared}
              />
            );
          } else {
            const translatedName = missionNamesMap[mission.name]
              ? t(missionNamesMap[mission.name])
              : mission.name;
            return (
              <div className="col-span-2" key={mission.id}>
                <div
                  className={`basic-mission-card h-36 rounded-3xl flex flex-row items-center pl-8 pr-5 justify-between relative cursor-pointer ${
                    mission.isCleared || mission.status === "PENDING"
                      ? "pointer-events-none"
                      : ""
                  }`}
                  onClick={() => {
                    playSfx(Audios.button_click);
                    if (!mission.isCleared && mission.status !== "PENDING") {
                      if (mission.redirectUrl) {
                        window.open(mission.redirectUrl, "_blank");
                      }
                      handleClearMission(mission.id);
                    }
                  }}
                  role="button"
                  aria-label={`Mission: ${mission.name}`}
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (
                      e.key === "Enter" &&
                      !mission.isCleared &&
                      mission.status !== "PENDING"
                    ) {
                      if (mission.redirectUrl) {
                        window.open(mission.redirectUrl, "_blank");
                      }
                      handleClearMission(mission.id);
                    }
                  }}
                >
                  {(mission.isCleared || mission.status === "PENDING") && (
                    <div className="absolute inset-0 bg-gray-950 bg-opacity-60 rounded-3xl z-10" />
                  )}

                  <div className="relative flex flex-row items-center justify-between z-0 w-full">
                    <div className="md:space-y-3">
                      <p className="text-sm font-medium">{translatedName}</p>
                      <p className="font-semibold flex flex-row items-center gap-1 mt-2">
                        +{mission.diceReward}{" "}
                        <img
                          src={Images.Dice}
                          alt="dice"
                          className="w-5 h-5"
                        />
                        &nbsp; +{formatNumber(mission.starReward)}{" "}
                        <img
                          src={Images.Star}
                          alt="star"
                          className="w-5 h-5"
                        />
                      </p>
                    </div>
                    <img
                      src={Images.LargeTwitter}
                      alt="Large Twitter"
                      className="w-20 h-20"
                    />
                  </div>

                  {mission.isCleared && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm font-semibold rounded-full px-4 py-2 z-20 flex items-center justify-center gap-2">
                      <img
                        src={Images.MissionCompleted}
                        alt="Mission Completed"
                        className="w-5 h-5"
                      />
                      <p>{t("mission_page.Completed")}</p>
                    </div>
                  )}

                  {mission.status === "PENDING" && (
                    <div className="absolute inset-0 flex items-center justify-center z-30">
                      <LoadingSpinner />
                    </div>
                  )}
                </div>
                <p className="text-xs mb-8 mt-2 text-white">
                  {t(
                    "mission_page.*_If_the_mission_is_not_performed_correctly,_you_may_be_excluded_from_the_final_reward."
                  )}
                </p>
              </div>
            );
          }
        })}
      </div>

      {/* 일일 미션 */}
      <h1 className="font-semibold text-lg my-4 ml-7">
        {t("mission_page.Daily_Mission")}
      </h1>
      <div className="mx-6 mb-8">
        <Link to="/invite-friends" onClick={() => playSfx(Audios.button_click)}>
          <DailyMissionCard
            title={t("mission_page.Invite_friends")}
            alt="Invite Friend"
            image={Images.InviteFriend}
          />
        </Link>
      </div>

      {/* 완료된 미션 */}
      {completedMissions.length > 0 && (
        <>
          <h1 className="font-semibold text-lg mb-4 ml-7">{t("mission_page.Completed_mission")}</h1>
          <div className="grid grid-cols-2 gap-3 mx-6">
            {completedMissions.map((mission) => {
              if (mission.name !== "Leave a Supportive Comment on SL X") {
                return (
                  <OneTimeMissionCard
                    key={mission.id}
                    mission={mission}
                    onClear={handleClearMission}
                    onMissionCleared={handleMissionCleared}
                  />
                );
              } else {
                const translatedName = missionNamesMap[mission.name]
                  ? t(missionNamesMap[mission.name])
                  : mission.name;
                return (
                  <div className="col-span-2" key={mission.id}>
                    <div
                      className={`basic-mission-card h-36 rounded-3xl flex flex-row items-center pl-8 pr-5 justify-between relative cursor-pointer ${
                        mission.isCleared || mission.status === "PENDING"
                          ? "pointer-events-none"
                          : ""
                      }`}
                      onClick={() => {
                        playSfx(Audios.button_click);
                        if (!mission.isCleared && mission.status !== "PENDING") {
                          if (mission.redirectUrl) {
                            window.open(mission.redirectUrl, "_blank");
                          }
                          handleClearMission(mission.id);
                        }
                      }}
                      role="button"
                      aria-label={`Mission: ${mission.name}`}
                      tabIndex={0}
                      onKeyPress={(e) => {
                        if (
                          e.key === "Enter" &&
                          !mission.isCleared &&
                          mission.status !== "PENDING"
                        ) {
                          if (mission.redirectUrl) {
                            window.open(mission.redirectUrl, "_blank");
                          }
                          handleClearMission(mission.id);
                        }
                      }}
                    >
                      {(mission.isCleared || mission.status === "PENDING") && (
                        <div className="absolute inset-0 bg-gray-950 bg-opacity-60 rounded-3xl z-10" />
                      )}

                      <div className="relative flex flex-row items-center justify-between z-0 w-full">
                        <div className="md:space-y-3">
                          <p className="text-sm font-medium">{translatedName}</p>
                          <p className="font-semibold flex flex-row items-center gap-1 mt-2">
                            +{mission.diceReward}{" "}
                            <img
                              src={Images.Dice}
                              alt="dice"
                              className="w-5 h-5"
                            />
                            &nbsp; +{formatNumber(mission.starReward)}{" "}
                            <img
                              src={Images.Star}
                              alt="star"
                              className="w-5 h-5"
                            />
                          </p>
                        </div>
                        <img
                          src={Images.LargeTwitter}
                          alt="Large Twitter"
                          className="w-20 h-20"
                        />
                      </div>

                      {mission.isCleared && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm font-semibold rounded-full px-4 py-2 z-20 flex items-center justify-center gap-2">
                          <img
                            src={Images.MissionCompleted}
                            alt="Mission Completed"
                            className="w-5 h-5"
                          />
                          <p>{t("mission_page.Completed")}</p>
                        </div>
                      )}

                      {mission.status === "PENDING" && (
                        <div className="absolute inset-0 flex items-center justify-center z-30">
                          <LoadingSpinner />
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </>
      )}

      {/* 페이지 하단 여백 */}
      <div className="my-10"></div>

      {/* 미션 보상 다이얼로그 */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="rounded-3xl bg-[#21212F] text-white border-none max-w-[90%] md:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center font-bold text-xl">
              <div className="flex flex-row items-center justify-between">
                <div>&nbsp;</div>
                <p>{t("mission_page.mission_reward")}</p>
                <HiX
                  className="w-6 h-6 cursor-pointer"
                  onClick={handleCloseDialog}
                />
              </div>
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex flex-col items-center justify-center w-full h-full gap-10">
            <div className="flex flex-row items-center justify-center gap-4">
              <div className="mt-20 w-28 h-28 bg-gradient-to-b from-[#2660f4] to-[#3937a3] rounded-[24px] flex items-center justify-center">
                <div className="w-[110px] h-[110px] logo-bg rounded-[24px] flex items-center flex-col justify-center gap-2">
                  <img
                    src={Images.Dice}
                    className="w-10 h-10"
                    alt="Dice Reward"
                  />
                  <p className="font-semibold text-lg">
                    +{rewardData && formatNumber(rewardData.diceReward)}
                  </p>
                </div>
              </div>
              <div className="mt-20 w-28 h-28 bg-gradient-to-b from-[#2660f4] to-[#3937a3] rounded-[24px] flex items-center justify-center">
                <div className="w-[110px] h-[110px] logo-bg rounded-[24px] flex items-center flex-col justify-center gap-2">
                  <img
                    src={Images.Star}
                    className="w-10 h-10"
                    alt="Star Reward"
                  />
                  <p className="font-semibold text-lg">
                    +{rewardData && formatNumber(rewardData.starReward)}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-semibold">{t("mission_page.congrate")}</p>
              <p className="text-[#a3a3a3]">
                {t("mission_page.reward_added")}
              </p>
            </div>
            <div className="space-y-3 w-full">
              <button
                className="w-full h-14 rounded-full bg-[#0147e5]"
                onClick={handleCloseDialog}
              >
                {t("mission_page.ok")}
              </button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MissionPage;
