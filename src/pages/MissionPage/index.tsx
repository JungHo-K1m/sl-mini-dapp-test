// src/pages/MissionPage.tsx

import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui";
import { HiX } from "react-icons/hi"; // Ensure react-icons is installed
import { TopTitle } from "@/shared/components/ui";
import "./MissionPage.css";
import Images from "@/shared/assets/images";
import missionImageMap from "@/shared/assets/images/missionImageMap";
import { Link } from "react-router-dom";
import {
  useMissionStore,
  Mission,
} from "@/entities/Mission/model/missionModel";
import { formatNumber } from "@/shared/utils/formatNumber";
import LoadingSpinner from "@/shared/components/ui/loadingSpinner";

interface OneTimeMissionCardProps {
  mission: Mission;
  onClear: (id: number) => void;
  onMissionCleared: (mission: Mission) => void; // New prop
}

const OneTimeMissionCard: React.FC<OneTimeMissionCardProps> = ({
  mission,
  onClear,
  onMissionCleared,
}) => {
  const mapping = missionImageMap[mission.name];
  const imageSrc = mapping ? Images[mapping.imageKey] : Images.TokenReward;
  const className = mapping ? mapping.className : "";

  const handleClick = () => {
    if (!mission.isCleared) {
      // Open the redirect URL in a new tab
      if (mission.redirectUrl) {
        window.open(mission.redirectUrl, "_blank");
      }

      // Call the API to clear the mission
      onClear(mission.id);

      // Trigger the dialog with reward data
      onMissionCleared(mission);
    }
  };

  return (
    <div
      className={`relative flex flex-col rounded-3xl h-36 items-center justify-center gap-3 cursor-pointer ${className} ${
        mission.isCleared ? "pointer-events-none" : ""
      }`}
      onClick={handleClick}
      role="button"
      aria-label={`Mission: ${mission.name}`}
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter") handleClick();
      }}
    >
      {/* Semi-transparent background layer */}
      {mission.isCleared && (
        <div className="absolute inset-0 bg-gray-950 bg-opacity-60 rounded-3xl z-10"></div>
      )}

      <div className="relative flex flex-col items-center justify-center z-0">
        <img src={imageSrc} alt={mission.name} className="w-9 h-9" />
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm font-medium">{mission.name}</p>
          <p className="font-semibold text-sm flex flex-row items-center gap-1">
            +{mission.diceReward}{" "}
            <img src={Images.Dice} alt="dice" className="w-4 h-4" /> +
            {formatNumber(mission.starReward)}{" "}
            <img src={Images.Star} alt="star" className="w-4 h-4" />
          </p>
        </div>
      </div>

      {/* "Completed" Badge */}
      {mission.isCleared && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  text-white font-semibold rounded-full px-4 py-2 z-20 flex items-center justify-center gap-2">
          <img
            src={Images.MissionCompleted}
            alt="Mission Completed"
            className="w-5 h-5"
          />
          <p>Completed</p>
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

const DailyMissionCard: React.FC<DailyMissionProps> = ({
  title,
  image,
  alt,
}) => {
  return (
    <div className="basic-mission-card h-36 rounded-3xl flex flex-row items-center pl-8 pr-5 justify-between mb-3">
      <div className="space-y-3">
        <p className="text-xl font-semibold">{title}</p>
        <p className="text-sm">
          Earn various rewards <br className="md:hidden" /> such as dice,
          points, SL coins
        </p>
      </div>
      <img src={image} alt={alt} className="w-24 h-24" />
    </div>
  );
};

const MissionPage: React.FC = () => {
  const { missions, loading, error, fetchMissions, clearMission } =
    useMissionStore();

  // State for AlertDialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rewardData, setRewardData] = useState<{
    diceReward: number;
    starReward: number;
    amount?: number; // For monetary rewards if any
    spinType: string;
  } | null>(null);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  // Handler to open dialog with reward data
  const handleMissionCleared = (mission: Mission) => {
    setRewardData({
      diceReward: mission.diceReward,
      starReward: mission.starReward,
      spinType: "MISSION", // Adjust based on your logic
    });
    setIsDialogOpen(true);
  };

  // Handler to close dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setRewardData(null);
  };

  // Modify clearMission to accept a callback
  const handleClearMission = async (id: number) => {
    await clearMission(id);
    const clearedMission = missions.find((m) => m.id === id);
    if (clearedMission) {
      handleMissionCleared(clearedMission);
    }
  };

  // Utility function to get prize display name
  const getPrizeDisplayName = (spinType: string | undefined) => {
    switch (spinType) {
      case "DICE":
        return "Dice";
      case "STAR":
        return "Star";
      // Add more cases as needed
      default:
        return "Reward";
    }
  };

  return (
    <div className="flex flex-col text-white mx-6 mb-20 md:mb-96">
      <TopTitle title="Mission" />

      <h1 className="font-semibold text-lg ml-[2px] mb-4">One-Time Missions</h1>

      {loading && <LoadingSpinner/>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        {missions.map((mission) =>
          mission.name !== "Leave a Supportive Comment on SL X" ? (
            <OneTimeMissionCard
              key={mission.id}
              mission={mission}
              onClear={handleClearMission}
              onMissionCleared={handleMissionCleared} // Pass the handler
            />
          ) : (
            <div className="col-span-2" key={mission.id}>
              <div
                className={`basic-mission-card h-36 rounded-3xl flex flex-row items-center pl-8 pr-5 justify-between relative cursor-pointer ${
                  mission.isCleared ? "pointer-events-none" : ""
                }`}
                onClick={() => {
                  if (!mission.isCleared) {
                    // Open the redirect URL in a new tab
                    if (mission.redirectUrl) {
                      window.open(mission.redirectUrl, "_blank");
                    }

                    // Call the API to clear the mission
                    handleClearMission(mission.id);
                  }
                }}
                role="button"
                aria-label={`Mission: ${mission.name}`}
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !mission.isCleared) {
                    // Open the redirect URL in a new tab
                    if (mission.redirectUrl) {
                      window.open(mission.redirectUrl, "_blank");
                    }

                    // Call the API to clear the mission
                    handleClearMission(mission.id);
                  }
                }}
              >
                {/* Semi-transparent background layer */}
                {mission.isCleared && (
                  <div className="absolute inset-0 bg-gray-950 bg-opacity-60 rounded-3xl z-10"></div>
                )}

                <div className="relative flex flex-row items-center justify-between z-0 w-full">
                  <div className="md:space-y-3">
                    <p className="text-sm font-medium">{mission.name}</p>
                    <p className="font-semibold flex flex-row items-center gap-1 mt-2">
                      +{mission.diceReward}{" "}
                      <img src={Images.Dice} alt="dice" className="w-5 h-5" />
                      &nbsp; +{formatNumber(mission.starReward)}{" "}
                      <img src={Images.Star} alt="star" className="w-5 h-5" />
                    </p>
                  </div>
                  <img
                    src={Images.LargeTwitter}
                    alt="Large Twitter"
                    className="w-20 h-20"
                  />
                </div>

                {/* "Completed" Badge */}
                {mission.isCleared && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  text-white font-semibold rounded-full px-4 py-2 z-20 flex items-center justify-center gap-2">
                    <img
                      src={Images.MissionCompleted}
                      alt="Mission Completed"
                      className="w-5 h-5"
                    />
                    <p>Completed</p>
                  </div>
                )}
              </div>

             
                <p className="text-xs mb-8 mt-2 text-white">
                  * If the mission is not performed correctly, you may be excluded
                  from the final reward.
                </p>
        
            </div>
          )
        )}
      </div>

      <h1 className="font-semibold text-lg ml-[2px] mb-4">Daily Missions</h1>

      <Link to="/invite-friends">
        <DailyMissionCard
          title="Invite Friends"
          alt="Invite Friend"
          image={Images.InviteFriend}
        />
      </Link>

      {/* Added spacing for layout purposes */}
      <div className="my-10"></div>

      {/* AlertDialog for Rewards */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="rounded-3xl bg-[#21212F] text-white border-none max-w-[90%] md:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center font-bold text-xl">
              <div className="flex flex-row items-center justify-between">
                <div>&nbsp;</div>
                <p>Mission Reward</p>
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
                    src={Images.Dice} // Dice image
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
                    src={Images.Star} // Star image
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
              <p className="text-xl font-semibold">
                Congratulations! <br />
              </p>
              <p className="text-[#a3a3a3]">
                This reward has been added to <br />
                your account.
              </p>
            </div>
            <div className="space-y-3 w-full">
              <button
                className="w-full h-14 rounded-full bg-[#0147e5]"
                onClick={handleCloseDialog}
              >
                OK
              </button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MissionPage;
