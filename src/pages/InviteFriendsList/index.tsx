import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { TopTitle } from '@/shared/components/ui';
import LoadingSpinner from '@/shared/components/ui/loadingSpinner';
import Images from '@/shared/assets/images';
import { FaChevronRight } from "react-icons/fa";
import getFriends from '@/entities/Mission/api/friends';
import getFriendsReward from '@/entities/Asset/api/friendsReward';
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";

interface Friend {
    userId: string;
}

const InviteFriendsList: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { playSfx } = useSound();
    const [friends, setFriends] = useState<Friend[]>([]); // 친구 목록 상태
    const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
    const [star, setStar] = useState(0.0);
    const [sl, setSL] = useState(0.0);
    const [usdc, setUsdc] = useState(0.0);


    useEffect(() => {
        const fetchFriendsData = async () => {
            try {
                const data = await getFriends(); // API 호출
                const reward = await getFriendsReward(); 
                setFriends(data.friends || []); // 친구 목록 설정 (없으면 빈 배열)
                setStar(reward.starTotal);
                setSL(reward.slTotal);
                setUsdc(reward.usdcTotal);
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
        return <LoadingSpinner className="h-screen" />;
    }


    // 숫자 콤마(,) 표기를 위한 변환: toLocaleString()
    const formattedStar = star.toLocaleString(); 
    const formattedSL = sl.toLocaleString();
    const formattedUSDC = usdc.toLocaleString();


    return (
        <div className="flex flex-col items-center text-white mx-6 relative min-h-screen pb-32">
            {/* 상단 타이틀 */}
            <TopTitle title={t("mission_page.friend_list")} back={true} />
            
            {/* 레퍼럴 보상 내용 */}
            <div className='w-full'>
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">{t("mission_page.total_reward")}</h2>
                    <button
                        className="flex items-center text-white text-xs font-medium"
                        onClick={() => {
                            playSfx(Audios.button_click);
                            navigate("/referral-rewards");
                        }}
                        aria-label="View All NFTs"
                        >
                        {t("mission_page.view_detail")} <FaChevronRight className="ml-1 w-3 h-3" />
                    </button>
                </div>
                <div className="bg-[#1F1E27] rounded-3xl border-2 border-[#35383F] flex flex-col justify-center gap-4 h-36 p-5 mt-3">
                    <div className="flex items-center">
                        <img
                            src={Images.pointStar}
                            alt="Points Earned"
                            className="w-6 h-6"
                            />
                        <p className="text-base font-medium flex-1 ml-1">{t("mission_page.points")}</p>
                        <p className="text-[#3B82F6] text-lg font-semibold">+{formattedStar}P</p>
                    </div>
                    <div className="flex items-center">
                        <img
                            src={Images.SLToken}
                            alt="SL Earned"
                            className="w-6 h-6"
                            />
                        <p className="text-base font-medium flex-1 ml-1">{t("mission_page.sl")}</p>
                        <p className="text-[#3B82F6] text-lg font-semibold">+{formattedSL}SLT</p>
                    </div>
                    <div className="flex items-center">
                        <img
                            src={Images.USDC}
                            alt="USDC Earned"
                            className="w-6 h-6"
                            />
                        <p className="text-base font-medium flex-1 ml-1">{t("mission_page.usdc")}</p>
                        <p className="text-[#3B82F6] text-lg font-semibold">+{formattedUSDC}USDC</p>
                    </div>
                </div>
            </div>

            {/* 초대한 친구 목록 */}
            {friends.length > 0 ? ( // 친구 목록이 존재하는 경우에만 렌더링
                <div className="flex flex-col mt-12 w-full gap-3">
                    <div className="flex flex-row justify-between items-center mb-[6px]">
                        <p className="text-lg font-medium">{t('mission_page.Invited_Friends')}</p>
                        <div className="flex items-center justify-center text-sm font-medium w-[72px] h-8 rounded-full bg-[#21212f]">
                            Total : <span className="text-[#FDE047]">{friends.length}</span>
                        </div>
                    </div>
                    {friends.map((friend, index) => (
                        <div
                            key={index}
                            className="bg-[#1F1E27] rounded-3xl border-2 border-[#35383F] flex flex-row items-center justify-start gap-4 h-16 text-base font-medium px-5"
                            >
                            <p className="text-[#D4D4D4]">{index + 1}</p>
                            <p>{friend.userId}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-400 mt-8">{t("mission_page.invite_your_friend")}</p> // 친구가 없을 경우
            )}
        </div>
    );
};

export default InviteFriendsList;