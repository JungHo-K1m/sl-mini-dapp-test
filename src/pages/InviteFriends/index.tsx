// InviteFriends.tsx
import React, { useState } from 'react';
import { TopTitle } from '@/shared/components/ui';
import './InviteFriends.css';
import Images from '@/shared/assets/images';
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { BiCopy } from 'react-icons/bi';
import { useTranslation } from "react-i18next";

const InviteFriends: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [copySuccess, setCopySuccess] = useState<string>('');

  const referralLink = 'https://pwa-slapp-13cs.vercel.app/telegramideded';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopySuccess('Copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 2000); // 2초 후에 알림 메시지 제거
    } catch (err) {
      setCopySuccess('Failed to copy!');
    }
  };

  return (
    <div className="flex flex-col mx-6 mb-44 text-white items-center min-h-screen">
      <div className="flex items-center w-full mt-7 mb-8 relative">
          {/* 뒤로가기 버튼 */}
          <FaChevronLeft
            className="text-xl cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <h1 className="text-xl font-bold flex-1 text-center">{t("mission_page.Invite_Friend")}</h1>
          <div className="w-5"></div>
        </div>
      <p>{t("mission_page.Referral_Code")}</p>
      <button
        className="flex flex-row gap-2 items-center border border-white rounded-full w-56 md:w-80 h-16 justify-center mt-2 px-4"
        onClick={copyToClipboard}
      >
        <p className="truncate">{referralLink}</p>
        <BiCopy className="min-w-5 min-h-5" />
      </button>
      {copySuccess && (
        <p className="text-sm text-green-500 mt-2">{copySuccess}</p>
      )}
      <div className="invite-reward-box w-[342px] md:w-[500px] h-72 rounded-3xl flex flex-col items-center justify-center mt-9 gap-4">
        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-col items-center gap-2 justify-center">
            <img src={Images.Dices} alt="dice" className="h-11" />
            <p className="font-medium text-sm">5 Dice</p>
          </div>
          <p className="text-[40px]">+</p>
          <div className="flex flex-col items-center gap-2 justify-center">
            <img src={Images.Star} alt="star" className="h-11" />
            <p className="font-medium text-sm">3000 P</p>
          </div>
        </div>
        <p className="text-sm ">
          {t("mission_page.You_can_receive_an")}{' '}
          <span className="text-2xl font-semibold">{t("mission_page.additional_10%")}</span> <br />
          {t("mission_page.of_your_invited_friend's_reward.")}
        </p>
        <button className="h-14 w-[302px] rounded-full bg-[#21212f]">
          {t("mission_page.Invite_Friends_and_Get_Reward")}
        </button>
      </div>
      <div className="flex flex-col mt-8 w-full gap-3">
        <div className="flex flex-row justify-between items-center mb-[6px]">
          <p className="text-lg font-medium">{t("mission_page.Invited_Friends")}</p>
          <div className="flex items-center justify-center text-sm font-medium w-[72px] h-8 rounded-full bg-[#21212f]">
            total : 3
          </div>
        </div>
        <div className="bg-white rounded-3xl flex flex-row items-center justify-start gap-4 h-16 text-[#171717] font-medium px-5">
          <p className="text-[#737373]">1</p>
          <p>Olivia Smith</p>
        </div>
      </div>
    </div>
  );
};

export default InviteFriends;
