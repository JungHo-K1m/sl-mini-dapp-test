import React, { useState, useEffect } from 'react';
import { TopTitle } from '@/shared/components/ui';
import './InviteFriends.css';
import Images from '@/shared/assets/images';
import { BiCopy } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import getFriends from '@/entities/Mission/api/friends'; // 외부 API 호출 함수

interface Friend {
  userId: string;
}

const InviteFriends: React.FC = () => {
  const { t } = useTranslation();
  const [copySuccess, setCopySuccess] = useState<string>(''); // 클립보드 복사 결과 메시지
  const [referralLink, setReferralLink] = useState<string>(''); // 레퍼럴 코드 상태
  const [friends, setFriends] = useState<Friend[]>([]); // 친구 목록 상태
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태

  // 클립보드 복사 함수
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopySuccess('Copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 2000); // 2초 후에 알림 메시지 제거
    } catch (err) {
      setCopySuccess('Failed to copy!');
    }
  };

  // 페이지 로드 시 API 호출
  useEffect(() => {
    const fetchFriendsData = async () => {
      try {
        const data = await getFriends(); // API 호출
        setReferralLink(data.referralUrl); // 레퍼럴 코드 설정
        setFriends(data.friends || []); // 친구 목록 설정 (없으면 빈 배열)
        setLoading(false); // 로딩 완료
      } catch (error) {
        console.error('Error fetching friends data:', error);
        setLoading(false); // 에러 시 로딩 종료
      }
    };

    fetchFriendsData();
  }, []);

  // 로딩 상태 처리
  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col mx-6 mb-44 text-white items-center min-h-screen">
      <TopTitle title={t('mission_page.Invite_Friend')} back={true} />
      <p>{t('mission_page.Referral_Code')}</p>
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
          {t('mission_page.You_can_receive_an')}{' '}
          <span className="text-2xl font-semibold">
            {t('mission_page.additional_10%')}
          </span>{' '}
          <br />
          {t("mission_page.of_your_invited_friend's_reward.")}
        </p>
        <button className="h-14 w-[302px] rounded-full bg-[#21212f]">
          {t('mission_page.Invite_Friends_and_Get_Reward')}
        </button>
      </div>
      {friends.length > 0 ? ( // 친구 목록이 존재하는 경우에만 렌더링
        <div className="flex flex-col mt-8 w-full gap-3">
          <div className="flex flex-row justify-between items-center mb-[6px]">
            <p className="text-lg font-medium">{t('mission_page.Invited_Friends')}</p>
            <div className="flex items-center justify-center text-sm font-medium w-[72px] h-8 rounded-full bg-[#21212f]">
              total : {friends.length}
            </div>
          </div>
          {friends.map((friend, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl flex flex-row items-center justify-start gap-4 h-16 text-[#171717] font-medium px-5"
            >
              <p className="text-[#737373]">{index + 1}</p>
              <p>{friend.userId}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 mt-8">{t('mission_page.No_Friends')}</p> // 친구가 없을 경우
      )}
    </div>
  );
};

export default InviteFriends;
