// src/pages/RPSGame/ui/RPSGameStart.tsx

import React, { useState } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui";
import Images from "@/shared/assets/images";
import { formatNumber } from "@/shared/utils/formatNumber";
import { useRPSGameStore } from "../store";
import { useTranslation } from "react-i18next";

interface RPSGameStartProps {
  onStart: () => void;
  allowedBetting: number;
  onCancel: () => void;
}

const RPSGameStart: React.FC<RPSGameStartProps> = ({
  onStart,
  allowedBetting,
  onCancel,
}) => {
  const [betAmount, setBetAmount] = useState<string>("");
  const setBetAmountStore = useRPSGameStore((state) => state.setBetAmount);
  const { t } = useTranslation();
  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numericValue = parseInt(value);
    if (
      value === "" ||
      (/^\d+$/.test(value) && numericValue <= allowedBetting+1)
    ) {
      setBetAmount(value);
      console.log(`betAmount set to: ${value}`);
    }
  };

  const handleStartClick = (
    event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault(); // 기본 폼 제출을 막습니다.
    const amount = parseInt(betAmount);
    console.log(`handleStartClick called with amount: ${amount}`);
    if (amount > 0 && amount <= allowedBetting+1) {
      console.log("Starting game with betAmount:", amount);
      setBetAmountStore(amount); // betAmount를 설정
      onStart(); // 게임 시작
    } else {
      alert(`The betting amount must be at least 1 star and up to a maximum of ${allowedBetting + 1} stars.`);
    }
  };

  const handleCancelClick = () => {
    onCancel(); // 취소 시 호출하여 주사위 게임으로 돌아감
    console.log("Game canceled by user");
  };

  return (
    <div className="h-screen md:min-w-[600px] flex flex-col items-center justify-center px-12">
      <h1 className="text-[#E20100] font-jalnan text-center text-[26px] mt-4 whitespace-nowrap">
        {t("dice_event.rps_game.title_1")}
        <br />
        {t("dice_event.rps_game.title_2")}
      </h1>

      <div className="flex flex-col items-center justify-center mt-4">
        <img
          src={Images.RPSGameExample}
          alt="RPSGameExample"
          className="w-[240px]"
        />

        <div className="flex flex-row gap-3 mt-4">
          <Popover>
            <PopoverTrigger className="flex flex-row gap-1 border-2 border-[#21212f] rounded-3xl text-center bg-white text-[#171717] font-medium w-[165px] h-[72px] items-center justify-center">
              <AiFillQuestionCircle className="w-6 h-6" />
              <p>{t("dice_event.rps_game.how_to")}</p>
            </PopoverTrigger>
            <PopoverContent
              className="rounded-3xl border-2 border-[#21212f] bg-white"
              style={{
                maxHeight: "65vh",
                overflowY: "auto",
              }}
            >
              <div className="text-black p-4 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-bold text-center mb-4">
                  ✼ {t("dice_event.rps_game.instruction")} ✼
                </h2>
                <ol className="text-sm leading-loose space-y-4">
                  <li>
                    <strong>{t("dice_event.rps_game.enter")}</strong>
                    <ul className="list-disc pl-5">
                      <li>{t("dice_event.rps_game.max")}</li>
                    </ul>
                  </li>
                  <li>
                    <strong>{t("dice_event.rps_game.play")}</strong>
                    <ul className="list-disc pl-5">
                      <li>{t("dice_event.rps_game.choose")}</li>
                      <li>{t("dice_event.rps_game.3_rounds")}</li>
                    </ul>
                  </li>
                  <li>
                    <strong>{t("dice_event.rps_game.win")}</strong>
                    <ul className="list-disc pl-5">
                      <li>{t("dice_event.rps_game.tripled")}</li>
                      <li>{t("dice_event.rps_game.multifly")}</li>
                    </ul>
                  </li>
                  <li>
                    <strong>{t("dice_event.rps_game.continue")}</strong>
                    <ul className="list-disc pl-5">
                      <li>{t("dice_event.rps_game.cash_out")}</li>
                      <li>{t("dice_event.rps_game.losing")}</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </PopoverContent>
          </Popover>
          <div className="flex flex-col gap-1 border-2 border-[#21212f] rounded-3xl text-center bg-white text-[#171717] font-medium w-[165px] h-[72px] items-center justify-center">
            <p className="text-xs text-[#737373]">{t("dice_event.rps_game.allowed")}</p>
            <div className="flex flex-row items-center justify-center gap-3">
              <img src={Images.Star} alt="Star" className="w-6 h-6" />
              <p>{formatNumber(allowedBetting)}</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleStartClick}>
          <input
            placeholder="How many stars would you like to bet?"
            type="number"
            value={betAmount}
            onChange={handleInputChange}
            max={allowedBetting+1} // 입력값 제한
            className="border-2 border-[#21212f] rounded-2xl h-12 text-sm font-medium px-4 mt-4 w-[342px]"
          />

          <div className="flex flex-row mt-4 gap-3">
            <button
              className="flex items-center justify-center bg-gray-200 text-[#171717] rounded-full font-medium h-14 w-[165px]"
              type="button"
              onClick={handleCancelClick}
            >
              {t("dice_event.rps_game.cancel")}
            </button>
            <button
              type="submit"
              className={`${
                betAmount && parseInt(betAmount) > 0
                  ? "bg-[#21212F] text-white"
                  : "bg-[#21212F] opacity-70 text-white cursor-not-allowed"
              } rounded-full font-medium h-14 w-[165px]`}
              disabled={
                !betAmount ||
                parseInt(betAmount) <= 0 ||
                parseInt(betAmount) > allowedBetting+1
              }
              // onClick={handleStartClick} // 이미 onSubmit에서 처리하므로 제거
            >
              {t("dice_event.rps_game.bet")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RPSGameStart;
