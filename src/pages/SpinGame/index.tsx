// src/pages/SpinGame/index.tsx

import React, { useEffect, useState } from "react";
import Images from "@/shared/assets/images";
import { preloadImages } from "@/shared/utils/preloadImages";
import LoadingSpinner from "@/shared/components/ui/loadingSpinner"; // ★ 이 로딩 스피너 사용
import { motion } from "framer-motion";
import { useUserStore } from "@/entities/User/model/userModel";
import { useTranslation } from "react-i18next";
import { formatNumber } from "@/shared/utils/formatNumber";
import { IoGameController } from "react-icons/io5";
import { Wheel } from "react-custom-roulette";
import {
  AlertDialog,
  AlertDialogContent,
} from "@/shared/components/ui";
import api from "@/shared/api/axiosInstance";
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";

const data = [
  {
    option: "2000 Stars",
    image: {
      uri: `${Images.spinStar2000}`,
      sizeMultiplier: 0.7,
      offsetY: 150,
    },
    prize: { type: "STAR", amount: 2000 },
    style: { backgroundColor: "#FBA629" },
  },
  {
    option: "1 Raffle Ticket",
    image: {
      uri: `${Images.SpinRapple1Black}`,
      sizeMultiplier: 0.7,
      offsetY: 150,
    },
    prize: { type: "TICKET", amount: 1 },
    style: { backgroundColor: "#F3F3E9" },
  },
  {
    option: "4000 Stars",
    image: {
      uri: `${Images.spinStar4000}`,
      sizeMultiplier: 0.7,
      offsetY: 150,
    },
    prize: { type: "STAR", amount: 4000 },
    style: { backgroundColor: "#2FAF74" },
  },
  {
    option: "1 Raffle Ticket",
    image: {
      uri: `${Images.spinRapple1}`,
      sizeMultiplier: 0.7,
      offsetY: 150,
    },
    prize: { type: "TICKET", amount: 1 },
    style: { backgroundColor: "#39A1E8" },
  },
  {
    option: "1000 Stars",
    image: {
      uri: `${Images.spinStar1000}`,
      sizeMultiplier: 0.7,
      offsetY: 150,
    },
    prize: { type: "STAR", amount: 1000 },
    style: { backgroundColor: "#CA3D77" },
  },
  {
    option: "1 Raffle Ticket",
    image: {
      uri: `${Images.spinRapple1}`,
      sizeMultiplier: 0.7,
      offsetY: 150,
    },
    prize: { type: "TICKET", amount: 1 },
    style: { backgroundColor: "#FBA629" },
  },
  {
    option: "5000 Stars",
    image: {
      uri: `${Images.spinStar5000}`,
      sizeMultiplier: 0.7,
      offsetY: 150,
    },
    prize: { type: "STAR", amount: 5000 },
    style: { backgroundColor: "#F3F3E9" },
  },
  {
    option: "1 Dice",
    image: {
      uri: `${Images.SpinDice1}`,
      sizeMultiplier: 0.7,
      offsetY: 150,
    },
    prize: { type: "DICE", amount: 1 },
    style: { backgroundColor: "#2FAF74" },
  },
  {
    option: "10 Coins",
    image: {
      uri: `${Images.spinToken10}`,
      sizeMultiplier: 0.7,
      offsetY: 150,
    },
    prize: { type: "SL", amount: 10 },
    style: { backgroundColor: "#39A1E8" },
  },
  {
    option: "1 Raffle Ticket",
    image: {
      uri: `${Images.spinRapple1}`,
      sizeMultiplier: 0.7,
      offsetY: 150,
    },
    prize: { type: "TICKET", amount: 1 },
    style: { backgroundColor: "#CA3D77" },
  },
  {
    option: "Boom!",
    image: {
      uri: `${Images.Boom}`,
      sizeMultiplier: 0.7,
      offsetY: 150,
    },
    prize: { type: "BOOM", amount: 0 },
    style: { backgroundColor: "#333333" },
  },
];

// 스핀 시작 컴포넌트
const SpinGameStart: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const { t } = useTranslation();
  return (
    <div
      className="flex flex-col items-center justify-center px-12 pb-8 h-full w-full"
      style={{
        backgroundImage: `url(${Images.BGSpinGame})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-[#fde047] font-jalnan text-center text-[36px] mt-8 ">
        {t("dice_event.spin_game.spin_wheel")}
        <br />
        {t("dice_event.spin_game.win_prize")}
      </h1>

      <img
        src={Images.SpinExample}
        alt="spin-example"
        className="md:w-[306px] md:h-[372px] w-[230px] mt-4 self-center"
      />
      <div className="border-2 border-[#21212f] rounded-3xl text-center bg-white text-[#171717] font-medium w-[342px] h-[110px] flex items-center justify-center mt-4">
        <p>
          ※ {t("dice_event.spin_game.note")} ※
          <br /> {t("dice_event.spin_game.if_you")} <br />
          {t("dice_event.spin_game.lose_turn")}
        </p>
      </div>
      <button
        className="flex items-center justify-center bg-[#21212f] text-white h-14 mt-4 w-[342px] rounded-full font-medium"
        onClick={onStart}
      >
        {t("dice_event.spin_game.start")}
      </button>
    </div>
  );
};

// 실제 스핀 컴포넌트
const Spin: React.FC<{ onSpinEnd: () => void }> = ({ onSpinEnd }) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [prizeData, setPrizeData] = useState<{
    spinType: string;
    amount: number;
  } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const { playSfx } = useSound();
  const { t } = useTranslation();

  const { setStarPoints, setDiceCount, setSlToken, setLotteryCount, items } =
    useUserStore();

  const handleSpinClick = async () => {
    playSfx(Audios.button_click);

    if (isSpinning) return;

    try {
      setIsSpinning(true);

      playSfx(Audios.spin_game);

      // /play-spin API 호출
      const response = await api.get("/play-spin");
      console.log("Server response:", response.data);
      if (response.data.code === "OK") {
        const { spinType, amount, baseAmount } = response.data.data;
        console.log(
          "Received spinType:",
          spinType,
          "amount:",
          amount,
          "baseAmount:",
          baseAmount
        );

        // data 배열에서 spinType과 baseAmount 가 모두 일치하는 인덱스 찾기
        const foundIndex = data.findIndex(
          (item) =>
            item.prize.type === spinType.toUpperCase() &&
            item.prize.amount === baseAmount
        );

        if (foundIndex !== -1) {
          console.log("Prize index found:", foundIndex);
          setPrizeNumber(foundIndex);
          setPrizeData({ spinType, amount });
          setMustSpin(true);
        } else {
          console.error(
            "No matching prize found for given spinType and baseAmount"
          );
          window.location.reload();
        }
      } else {
        console.error("Error in play-spin API:", response.data.message);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error calling play-spin API:", error);
      window.location.reload();
    } finally {
      setIsSpinning(false);
    }
  };

  const handleSpinEnd = () => {
    setMustSpin(false);
    // 사용자 상태 업데이트
    if (prizeData) {
      console.log("Prize data:", prizeData);
      const { spinType, amount } = prizeData;

      const normalizedSpinType = spinType.trim().toUpperCase();

      // 결과 사운드 처리
      if (normalizedSpinType === "BOOM") {
        // 붐(꽝)이면 패배 사운드
        playSfx(Audios.rps_lose);
        console.log("Boom! Better luck next time!");
      } else {
        // 그 외엔 보상 사운드
        playSfx(Audios.reward);
      }

      if (normalizedSpinType === "STAR") {
        setStarPoints((prev: number) => prev + amount);
      } else if (normalizedSpinType === "DICE") {
        setDiceCount((prev: number) => prev + amount);
      } else if (normalizedSpinType === "SL") {
        setSlToken((prev: number) => prev + amount);
      } else if (normalizedSpinType === "TICKET") {
        setLotteryCount((prev: number) => prev + amount);
      } else if (normalizedSpinType === "BOOM") {
        console.log("Boom! Better luck next time!");
      }
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    playSfx(Audios.button_click);
    setPrizeData(null);
    setIsDialogOpen(false);
    onSpinEnd();
    setIsSpinning(false);
  };

  const getPrizeDisplayName = (spinType: string | undefined) => {
    if (!spinType) return "Unknown";
    const normalizedSpinType = spinType.trim().toUpperCase();

    switch (normalizedSpinType) {
      case "STAR":
        return "Stars";
      case "DICE":
        return "Dice";
      case "SL":
        return "Coins";
      case "TICKET":
        return "Raffle Ticket";
      case "BOOM":
        return "Boom! Try Again";
      default:
        return "Unknown";
    }
  };

  // spinType에 따라 이미지 선택
  const getPrizeImage = (spinType: string | undefined) => {
    if (!spinType) return Images.Dice;
    const normalizedSpinType = spinType.trim().toUpperCase();
    switch (normalizedSpinType) {
      case "STAR":
        return Images.Star; // 별 대표 이미지
      case "DICE":
        return Images.Dice; // 주사위 이미지
      case "SL":
        return Images.TokenReward; // 코인 이미지
      case "TICKET":
        return Images.LotteryTicket; // 래플 티켓 이미지
      case "BOOM":
        return Images.Boom; // 붐 이미지
      default:
        return Images.Dice;
    }
  };

  return (
    <div
      className="relative flex flex-col items-center h-screen justify-center w-full"
      style={{
        backgroundImage: `url(${Images.BGSpinGame})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-[#fde047] font-jalnan text-center text-[36px] mt-8 md:mb-12">
        {t("dice_event.spin_game.spin_wheel")}
        <br />
        {t("dice_event.spin_game.win_prize")}
      </h1>

      <motion.div
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
      >
        <img
          src={Images.Spin}
          alt="Spin-game"
          className="w-[320px] md:w-[360px] md:mt-16"
          loading="lazy"
        />
      </motion.div>

      <motion.img
        src={Images.SpinPin}
        alt="Spin-game"
        className="w-[126px] h-[142px] absolute z-10 transform rotate-45"
        loading="lazy"
        initial={{ x: -200 }}
        animate={{ x: 0, rotate: "45deg" }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
      />

      <div className="absolute top-[1/2] left-1/2 transform -translate-x-1/2 z-0">
        <motion.div
          initial={{ x: -200 }}
          animate={{ x: 0 }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        >
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={data}
            outerBorderColor="#E52025"
            onStopSpinning={handleSpinEnd}
            spinDuration={0.3}
            outerBorderWidth={20}
            radiusLineColor="none"
            pointerProps={{
              style: {
                width: "0px",
                height: "0px",
              },
            }}
          />
        </motion.div>
      </div>

      <button
        onClick={handleSpinClick}
        disabled={isSpinning || mustSpin}
        className={`flex items-center justify-center h-14 mt-4 w-[342px] rounded-full font-medium ${
          isSpinning || mustSpin
            ? "bg-[#21212f] opacity-65 text-white cursor-not-allowed"
            : "bg-[#21212f] text-white"
        }`}
      >
        {isSpinning ? "Spinning..." : "Spin the Wheel"}
      </button>

      <AlertDialog open={isDialogOpen}>
        <AlertDialogContent className="rounded-3xl bg-[#21212F] text-white border-none max-w-[90%] md:max-w-lg">
          <div className="flex flex-col items-center justify-center w-full h-full gap-4">
            <h1 className="mt-10 font-jalnan">{t("dice_event.spin_game.get_reward")}</h1>
            <div className="w-32 h-32 bg-gradient-to-b from-[#2660f4] to-[#3937a3] rounded-[24px] flex items-center justify-center">
              <div className="w-[126px] h-[126px] logo-bg rounded-[24px] flex items-center justify-center flex-col gap-2">
                <img
                  src={getPrizeImage(prizeData?.spinType)}
                  className="w-12 h-12"
                  alt="Prize"
                />
              </div>
            </div>
            <div className="text-center space-y-2">
              {prizeData?.spinType?.toUpperCase() === "BOOM" ? (
                <>
                  <p className="text-xl font-semibold">{t("dice_event.spin_game.boom")}</p>
                  <p className="text-[#a3a3a3]">{t("dice_event.spin_game.better_luck")}</p>
                </>
              ) : (
                <>
                  <p className="text-xl font-semibold">
                    {t("dice_event.spin_game.congrate")} <br />
                    {t("dice_event.spin_game.you_won")} {prizeData && formatNumber(prizeData?.amount)}{" "}
                    {getPrizeDisplayName(prizeData?.spinType)}!
                  </p>
                </>
              )}
            </div>
            <div className="flex flex-col w-full mt-4">
              <p>{t("dice_event.spin_game.include")} : </p>
              <div className="rounded-3xl border-2 border-[#35383f] bg-[#1f1e27] p-5 mt-2">
                <div className="flex flex-row items-center gap-2">
                  <img
                    src={Images.RewardNFT}
                    alt="rewardBooster"
                    className="w-6 h-6"
                  />
                  <p className="font-semibold">{t("dice_event.spin_game.booster")}</p>
                </div>
                <div className="flex flex-row items-center gap-1 mt-2 ml-6">
                  <IoGameController className="text-xl" />
                  <p className="text-sm">{t("dice_event.spin_game.spin_reward")} : x{items.spinTimes}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 w-[165px] mt-4">
              <button
                className="w-full h-14 rounded-full bg-[#0147e5]"
                onClick={handleCloseDialog}
              >
                {t("dice_event.spin_game.ok")}
              </button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// 메인 SpinGame 컴포넌트
const SpinGame: React.FC<{ onSpinEnd: () => void }> = ({ onSpinEnd }) => {
  const [showSpin, setShowSpin] = useState(false);
  const { playSfx } = useSound();

  // 이미지 로딩 여부 (true일 때 로딩 중)
  const [isLoading, setIsLoading] = useState(true);

  // preload할 이미지 목록
  const imagesToLoad = [
    Images.BGSpinGame,
    Images.SpinExample,
    Images.Spin,
    Images.SpinPin,
    Images.RewardNFT,
    Images.Star,
    Images.Dice,
    Images.TokenReward,
    Images.LotteryTicket,
    Images.Boom,
    // data 객체 안에 쓰인 이미지들도 모두 추가
    Images.spinStar2000,
    Images.SpinDice10,
    Images.spinStar4000,
    Images.SpinDice5,
    Images.spinStar1000,
    Images.SpinDice2,
    Images.spinStar5000,
    Images.SpinDice1,
    Images.spinToken10,
    Images.spinRapple1,
    Images.SpinRapple1Black,
    // 필요한 이미지가 더 있다면 모두 추가...
  ];

  useEffect(() => {
    // 컴포넌트가 마운트되면 이미지 모두 로딩
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
  }, []);

  const handleStartClick = () => {
    playSfx(Audios.button_click);
    setShowSpin(true);
  };

  // 로딩 중이면 LoadingSpinner 보여주고, 끝나면 실제 화면
  if (isLoading) {
    return <LoadingSpinner className="h-screen"/>;
  }

  return (
    <div className="flex flex-col z-50 h-screen w-full items-center min-w-[600px]">
      {showSpin ? (
        <Spin onSpinEnd={onSpinEnd} />
      ) : (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="flex h-full w-full"
        >
          <SpinGameStart onStart={handleStartClick} />
        </motion.div>
      )}
    </div>
  );
};

export default SpinGame;
