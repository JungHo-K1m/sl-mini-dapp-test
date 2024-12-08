// src/widgets/PreviousRewards/ui/RewardSelectionDialog.tsx

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/shared/components/ui/dialog";
import { PlayerData } from "@/features/PreviousRewards/types/PlayerData";
import { BsFillQuestionSquareFill } from 'react-icons/bs';
import Images from '@/shared/assets/images';
import { FaPlus } from "react-icons/fa6";

interface RewardSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  data: PlayerData | null;
  onSelect: (type: "USDT" | "SL") => void;
}

const RewardSelectionDialog: React.FC<RewardSelectionDialogProps> = ({ open, onClose, data, onSelect }) => {
  const [selectedReward, setSelectedReward] = useState<"USDT" | "SL" | null>(null);

  // 다이어로그가 닫힐 때 selectedReward를 초기화
  useEffect(() => {
    if (!open) {
      setSelectedReward(null);
    }
  }, [open]);

  const handleRewardClick = (type: "USDT" | "SL") => {
    setSelectedReward(type); // 선택한 보상을 상태에 저장
  };

  const isRewardSelected = selectedReward !== null;

  // NFT 보상이 있는지 여부 판단
  const showNFT = data?.nftType !== null;

  const handleButtonClick = () => {
    if (isRewardSelected && selectedReward) {
      onSelect(selectedReward);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="text-white rounded-3xl w-[80%] md:w-full border-none bg-[#21212F] max-h-[80%] overflow-y-auto text-sm p-6 flex flex-col gap-4">
        <h1 className='text-center font-jalnan text-[#fde047] text-3xl mt-8'>Choose<br/>your reward!</h1>

        <div className='flex flex-col bg-[#181a20] p-5 rounded-2xl border-2 border-[#35383f] gap-1'>
          {/* SL 보상 선택 영역 */}
          <div
            className={`flex flex-row p-5 items-center justify-around border-2 rounded-2xl cursor-pointer ${
              selectedReward === "SL" ? "border-[#0147E5] box-bg" : "border-[#737373]"
            }`}
            onClick={() => handleRewardClick("SL")}
          >
            <div className='flex flex-col items-center gap-1 justify-center'>
              <img src={Images.TokenReward} alt="token" className="w-7 h-7" />
              <p className='text-sm font-semibold'>+{data && (data.slRewards ?? 0).toLocaleString()}</p>
            </div>
            {/* NFT 보상이 있는 경우에만 + 아이콘과 NFT 정보 표시 */}
            {showNFT && (
              <>
                <FaPlus className='w-6 h-6' />
                <div className='flex flex-col items-center gap-1 justify-center'>
                  <BsFillQuestionSquareFill className="w-7 h-7" />
                  <p className='text-sm font-semibold'>+{data && data.nftType}</p>
                </div>
              </>
            )}
          </div>

          <p className='text-center font-semibold text-xl'>OR</p>

          {/* USDT 보상 선택 영역 */}
          <div
            className={`flex flex-row p-5 items-center justify-around border-2 rounded-2xl cursor-pointer ${
              selectedReward === "USDT" ? "border-[#0147E5] box-bg" : "border-[#737373]"
            }`}
            onClick={() => handleRewardClick("USDT")}
          >
            <div className='flex flex-col items-center gap-1 justify-center'>
              <img src={Images.Usdt} alt="usdt" className="w-7 h-7" />
              <p className='text-sm font-semibold'>+{data && (data.usdtRewards ?? 0).toLocaleString()}</p>
            </div>
            {/* NFT 보상이 있는 경우에만 + 아이콘과 NFT 정보 표시 */}
            {showNFT && (
              <>
                <FaPlus className='w-6 h-6' />
                <div className='flex flex-col items-center gap-1 justify-center'>
                  <BsFillQuestionSquareFill className="w-7 h-7" />
                  <p className='text-sm font-semibold'>+{data && data.nftType}</p>
                </div>
              </>
            )}
          </div>
        </div>

        <p className='text-center'>We're rewarding you with <br/>the following for being #{data && data.rank} last month</p>
        <div className="flex flex-col gap-4 justify-center items-center w-full mt-4">
          <button
            className={`rounded-full w-40 h-12 font-medium ${
              isRewardSelected ? "bg-[#0147E5]" : "bg-gray-500 cursor-not-allowed"
            }`}
            onClick={handleButtonClick}
            disabled={!isRewardSelected} // 보상이 선택되지 않으면 비활성화
          >
            Get Rewarded
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RewardSelectionDialog;
