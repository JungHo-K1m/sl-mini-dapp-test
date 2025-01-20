// src/pages/RPSGame/ui/RPSResultDialog.tsx

import React, { useEffect } from "react";
import { AlertDialog, AlertDialogContent } from "@/shared/components/ui";
import Images from "@/shared/assets/images";
import { formatNumber } from "@/shared/utils/formatNumber";
import { useTranslation } from "react-i18next";
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";

interface ResultWinProps {
  winnings: number;
  onContinue: () => void;
  onQuit: () => void;
  consecutiveWins: number;
  winMultiplier: number;
}

interface ResultLoseProps {
  winnings: number;
  onQuit: () => void;
}

const ResultWin: React.FC<ResultWinProps> = ({
  winnings,
  onContinue,
  onQuit,
  consecutiveWins,
  winMultiplier,
}) => {
  const isFinalWin = consecutiveWins >= 3;
  const { t } = useTranslation();
  const { playSfx } = useSound();

  // 승리 효과음 재생
  useEffect(() => {
    playSfx(Audios.rps_win);
  }, []);

  return (
    <div>
      <img
        src={Images.Victory}
        alt="rps-result"
        className="w-[250px] h-[157px] absolute -top-[96px] left-1/2 transform -translate-x-1/2"
      />
      <div className="flex flex-col items-center justify-center w-full h-full gap-2">
        <div className="flex bg-white rounded-3xl w-[264px] h-[86px] border-2 border-[#21212f] flex-row items-center justify-center gap-1">
          <p className="font-semibold text-[30px] text-[#171717]">
            +{formatNumber(winnings)}
          </p>
          <img src={Images.Star} className="w-9 h-9" />
        </div>
        {isFinalWin ? (
          <div className="font-jalnan text-[24px] text-center">
            {t("dice_event.rps_game.congrate")}
            <br />
            {t("dice_event.rps_game.27x")}
          </div>
        ) : (
          <div className="font-jalnan text-[30px] text-center">
            <div className="flex flex-col justify-center items-center">
              {t("dice_event.rps_game.continue_with")} <br />
              <div className="flex flex-row items-center justify-center">
                <div className="flex flex-row items-center justify-center font-semibold text-base w-12 h-8 bg-[#21212F] rounded-full">
                  <p>x{winMultiplier}</p>
                </div>
                ?
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-row gap-2">
          {isFinalWin ? (
            <button
              className="rounded-full h-14 w-32 bg-[#21212f] text-white font-medium"
              onClick={onQuit}
            >
              {t("dice_event.rps_game.finish")}
            </button>
          ) : (
            <>
              <button
                className="rounded-full h-14 w-32 bg-gray-200 text-[#171717] font-medium"
                onClick={onQuit}
              >
                {t("dice_event.rps_game.collect")}
              </button>
              <button
                className="rounded-full h-14 w-32 bg-[#21212f] text-white font-medium"
                onClick={onContinue}
              >
                {t("dice_event.rps_game.gamble")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ResultLose: React.FC<ResultLoseProps> = ({ winnings, onQuit }) => {
  const { t } = useTranslation();
  const { playSfx } = useSound();

  // 패배 효과음 재생
  useEffect(() => {
    playSfx(Audios.rps_lose);
  }, []);

  return (
    <div>
      <img
        src={Images.Defeat}
        alt="rps-result"
        className="w-[250px] h-[157px] absolute -top-[96px] left-1/2 transform -translate-x-1/2"
      />
      <div className="flex flex-col items-center justify-center w-full h-full gap-4">
        <div className="flex bg-white rounded-3xl w-[264px] h-[86px] border-2 border-[#21212f] flex-row items-center justify-center gap-1">
          <p className="font-semibold text-[30px] text-[#171717]">
            {formatNumber(winnings)}
          </p>
          <img src={Images.Star} className="w-9 h-9" />
        </div>
        <div className="font-jalnan text-[20px] text-center">
          <p>
            {t("dice_event.rps_game.better_luck")} <br />
            {t("dice_event.rps_game.next_time")}
          </p>
        </div>

        <button
          className="rounded-full h-14 w-32 bg-[#21212f] text-white font-medium"
          onClick={onQuit}
        >
          {t("dice_event.rps_game.quit")}
        </button>
      </div>
    </div>
  );
};

interface RPSResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  result: "win" | "lose" | null;
  winnings: number;
  onContinue: () => void;
  onQuit: () => void;
  consecutiveWins: number;
  winMultiplier: number;
}

const RPSResultDialog: React.FC<RPSResultDialogProps> = ({
  isOpen,
  onClose,
  result,
  winnings,
  onContinue,
  onQuit,
  consecutiveWins,
  winMultiplier,
}) => {

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent
        className="rounded-3xl bg-[#21212F] text-white border-none w-[342px] h-[384px]"
        style={{
          background: `url(${Images.RPSResultBG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {result === "win" ? (
          <ResultWin
            winnings={winnings}
            onContinue={onContinue}
            onQuit={onQuit}
            consecutiveWins={consecutiveWins}
            winMultiplier={winMultiplier*3}
          />
        ) : result === "lose" ? (
          <ResultLose winnings={winnings} onQuit={onQuit} />
        ) : null}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RPSResultDialog;
