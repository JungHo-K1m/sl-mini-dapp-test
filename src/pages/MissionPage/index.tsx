import { TopTitle } from '@/shared/components/ui';
import './MissionPage.css';
import React, { useState, useEffect } from 'react';
import Images from '@/shared/assets/images';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import LoadingSpinner from '@/shared/components/ui/loadingSpinner';

interface OneTimeMissionCardProps {
  title: string;
  alt: string;
  image: string;
  diceNumber: number;
  starNumber: number;
  className: string;
}

const OneTimeMissionCard: React.FC<OneTimeMissionCardProps> = ({
  title,
  alt,
  image,
  diceNumber,
  starNumber,
  className,
}) => {
  return (
    <div
      className={` flex flex-col rounded-3xl  h-36 items-center justify-center gap-3  ${
        className && className
      }`}
    >
      <img src={image} alt={alt} className=" w-9 h-9" />
      <div className="flex flex-col items-center justify-center">
        <p className=" text-sm font-medium">{title}</p>
        <p className=" font-semibold text-base">
          +{diceNumber} Dice, +{starNumber} Star
        </p>
      </div>
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
  const { t } = useTranslation(); 
  return (
    <div className="basic-mission-card h-36 rounded-3xl flex flex-row items-center pl-8 pr-5 justify-between mb-3 ">
      <div className=" space-y-3">
        <p className="text-xl font-semibold">{title}</p>
        <p className=" text-sm">
          {t("mission_page.Earn_various_rewards")} 
          <br className="md:hidden" />
          {t("mission_page.such_as_dice,_points,_SL_coins")} 
        </p>
      </div>
      <img src={image} alt={alt} className=" w-24 h-24" />
    </div>
  );
};

const MissionPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  // 페이지 진입 후 0.2초 뒤 loading을 false로 변경
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200); 
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    // 로딩 중일 때는 로딩스피너만 보여줌
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col text-white mx-6 min-h-screen">
      <TopTitle title={t("mission_page.Mission")} />
      <h1 className=" font-semibold text-lg ml-[2px] mb-4">
        {t("mission_page.One_Time_Mission")}{' '}
      </h1>
      <div className="grid grid-cols-2 gap-3">
        <OneTimeMissionCard
          title={t("mission_page.Follow_on_X")}
          image={Images.Twitter}
          alt="Twitter"
          diceNumber={2}
          starNumber={50}
          className="follow-on-x-mission-card"
        />
        <OneTimeMissionCard
          title={t("mission_page.Join_telegram")}
          image={Images.Telegram}
          alt="telegram"
          diceNumber={2}
          starNumber={50}
          className="join-telegram-mission-card"
        />
        <OneTimeMissionCard
          title={t("mission_page.Subscribe_to_email")}
          image={Images.Email}
          alt="Email"
          diceNumber={2}
          starNumber={50}
          className="subscribe-to-email-mission-card"
        />
        <OneTimeMissionCard
          title={t("mission_page.join_the_SL_discord")}
          image={Images.Discord}
          alt="Discrod"
          diceNumber={2}
          starNumber={50}
          className="join-the-sl-discord-mission-card"
        />
        <div className=" col-span-2 basic-mission-card h-36 rounded-3xl flex flex-row items-center pl-8 pr-5 justify-between">
          <div className=" md:space-y-3">
            <p className="text-sm font-medium">
              {t("mission_page.leave_a_supportive_comment_on_SL_X")}
            </p>

            <p className=" font-semibold">+2 Dice, +100 Star</p>
          </div>
          <img
            src={Images.LargeTwitter}
            alt="large-twitter"
            className=" w-20 h-20"
          />
        </div>
        <p className=" col-span-2 text-xs mb-8">
          {t("mission_page.*_If_the_mission_is_not_performed_correctly,_you_may_be_excluded_from_the_final_reward.")}
        </p>
      </div>
      <h1 className=" font-semibold text-lg ml-[2px] mb-4">{t("mission_page.Daily_Mission")}</h1>

      <Link to="/invite-friends">
        <DailyMissionCard
          title={t("mission_page.Invite_friends")}
          alt="invite-image"
          image={Images.InviteFriend}
        />
      </Link>
      <br /> <br /> <br /> <br />
      <br />
    </div>
  );
};

export default MissionPage;
