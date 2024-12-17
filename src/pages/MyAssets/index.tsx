import React, { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { BiWallet } from "react-icons/bi";
import { FaChevronRight } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import Images from '@/shared/assets/images';
import { useTranslation } from "react-i18next";
import { useUserStore } from "@/entities/User/model/userModel";
import LoadingSpinner from '@/shared/components/ui/loadingSpinner';

interface TruncateMiddleProps {
    text: any;
    maxLength: number;
    className?: string;
  }
  
  // 주소 중간 생략
  const TruncateMiddle: React.FC<TruncateMiddleProps> = ({
    text,
    maxLength,
    className,
  }) => {
    const truncateMiddle = (str: string, maxLen: number): string => {
      if (str.length <= maxLen) return str;
  
      const charsToShow = maxLen - 3; // 3 characters for "..."
      const frontChars = Math.ceil(charsToShow / 2);
      const backChars = Math.floor(charsToShow / 2);
  
      return (
        str.substr(0, frontChars) + '...' + str.substr(str.length - backChars)
      );
    };
  
    const truncatedText = truncateMiddle(text, maxLength);
  
    return <div className={`text-sm font-bold ${className}`}>{truncatedText}</div>;
  };
  

const MyAssets: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { userId, userLv, characterType } = useUserStore();
    const [loading, setLoading] = useState(true);
    const [nft, setNFT] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const getCharacterImageSrc = () => {
        const index = Math.floor((userLv - 1) / 2);
    
        const catImages = [
          Images.CatLv1to2,
          Images.CatLv3to4,
          Images.CatLv5to6,
          Images.CatLv7to8,
          Images.CatLv9to10,
          Images.CatLv11to12,
          Images.CatLv13to14,
          Images.CatLv15to16,
          Images.CatLv17to18,
          Images.CatLv19to20,
        ];
    
        const dogImages = [
          Images.DogLv1to2,
          Images.DogLv3to4,
          Images.DogLv5to6,
          Images.DogLv7to8,
          Images.DogLv9to10,
          Images.DogLv11to12,
          Images.DogLv13to14,
          Images.DogLv15to16,
          Images.DogLv17to18,
          Images.DogLv19to20,
        ];
    
        if (characterType === "cat") {
          return catImages[index] || catImages[catImages.length - 1];
        } else {
          return dogImages[index] || dogImages[dogImages.length - 1];
        }
      };
    
    const charactorImageSrc = getCharacterImageSrc();

    let levelClassName = '';
    let mainColor = '';
  
    if (userLv >= 1 && userLv <= 4) {
      levelClassName = 'lv1to4-box';
      mainColor = '#dd2726';
    } else if (userLv >= 5 && userLv <= 8) {
      levelClassName = 'lv5to8-box';
      mainColor = '#f59e0b';
    } else if (userLv >= 9 && userLv <= 12) {
      levelClassName = 'lv9to12-box';
      mainColor = '#facc15';
    } else if (userLv >= 13 && userLv <= 16) {
      levelClassName = 'lv13to16-box';
      mainColor = '#22c55e';
    } else if (userLv >= 17 && userLv <= 20) {
      levelClassName = 'lv17to20-box';
      mainColor = '#0147e5';
    }

    // 페이지 진입 후 0.2초 뒤 loading을 false로 변경 => 추후 nft 정보, 보상내역 정보 API 받아오는 시간 동안으로 변경
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

    // nft 더미 데이터
    const nftCollection: any[] = [
        { id: 1, name: "Cool Cat #1", image: "https://via.placeholder.com/100" },
        { id: 2, name: "Cool Cat #1", image: "https://via.placeholder.com/100" },
        { id: 3, name: "Cool Cat #1", image: "https://via.placeholder.com/100" },
        { id: 4, name: "Cool Cat #1", image: "https://via.placeholder.com/100" },
    ];

    // 보상 내역 더미 데이터
    const rewardHistory = [
        { id: 1, description: "Joined Telegram", date: "17-10-2024", points: "+150SL" },
        { id: 2, description: "AI Dental Examination", date: "17-10-2024", points: "-150SL" },
        { id: 3, description: "Subscribe to Email", date: "17-10-2024", points: "+150SL" },
        { id: 4, description: "Game Win", date: "17-10-2024", points: "+150P" },
        { id: 5, description: "Game Lose", date: "17-10-2024", points: "-150P" },
    ];


    return (  
        <div className="flex flex-col items-center text-white mx-6 relative min-h-screen pb-32">
            {/* 상단 사용자 정보 */}
            <div className="flex items-center justify-between w-full mt-6">
                <div className="flex items-center">
                    {/* 이미지 */}
                    <div className={`flex flex-col items-center justify-center rounded-full w-9 h-9 md:w-10 md:h-10 ${levelClassName}`}>
                        <img
                            src={charactorImageSrc}
                            alt="User Profile"
                            className="w-10 h-10 rounded-full"
                        />
                    </div>

                    {/* 사용자 이름, 레벨 */}
                    <div className="ml-4">
                        {/* <p className="text-sm font-bold">{userId}</p> */}
                        <TruncateMiddle text={userId} maxLength={20} />
                        <p className="text-sm text-red-500">Lv.{userLv}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* 지갑 페이지 이동 */}
                    <button 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        onClick={()=>navigate('/wallet')}>
                        <BiWallet className="w-6 h-6" />
                    </button>
                    {/* 설정 페이지 이동 */}
                    <button 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        onClick={()=>navigate('/settings')}>
                        <IoSettingsOutline className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* NFT 상점 이동 영역 - 추후 수정 예정 */}
            <div 
                className="rounded-2xl p-4 mt-6 w-full flex items-center justify-between"
                style={{
                    background: "linear-gradient(to bottom, #19203CB2 0%, #304689 100%)",
                }}>
                <div>
                    <h3 className="text-base font-semibold">{t("asset_page.Shop_Unique_NFTs_Now!")}</h3>
                    <p className="text-sm font-medium text-gray-200">
                    {t("asset_page.Start_collecting_rare_and")}
                    </p>
                    <p className="text-sm font-medium text-gray-200">
                    {t("asset_page.unique_digital_assets_today!")}
                    </p>
                </div>
                <img
                    src={Images.cart}
                    alt="Shop NFTs"
                    className="w-20 h-20"
                />
            </div>
            

            {/* 내 NFT 컬렉션 */}
            <div className="mt-10 w-full">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">{t("asset_page.My_NFT_Collection")}</h2>
                    {nft !== 0 && (
                        <button
                            className="flex items-center text-white text-xs"
                            onClick={() => navigate("/my-nfts")}
                            aria-label="View All NFTs"
                        >
                            {t("asset_page.View_All")} <FaChevronRight className="ml-1 w-4 h-4" />
                        </button>
                    )}
                </div>
                <div className="mt-4 w-full">
                    {nft === 0 ? (
                        <div className="mt-20 h-[150px] flex flex-col items-center justify-center">
                            <p className="text-center text-[#737373] text-sm font-medium">
                                {/* {t("asset_page.no_nft")}<br />
                                {t("asset_page.own_nft")} */}
                                No NFTs in your colletion yet.<br />
                                Own NFT and Boost your rank!
                            </p>
                            <button
                                className="w-1/2 py-4 rounded-full text-base font-medium mt-6"
                                style={{ backgroundColor: '#0147E5' }}
                                onClick={()=>setShowModal(true)}
                                >
                                {/* {t("asset_page.shop_nft")} */}
                                Shop NFT
                            </button>
                        </div>

                    ) : (
                        <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                            {nftCollection.map((nftItem) => (
                                <div
                                    key={nftItem.id}
                                    className="bg-[#1F1E27] border border-[#737373] p-[10px] rounded-xl flex flex-col items-center"
                                    >
                                    {/* 비율을 유지하며 크기가 리니어하게 바뀌도록 설정 */}
                                    <div className="w-full aspect-[145/154] rounded-md mt-1 mx-1 overflow-hidden">
                                        <img
                                        src={nftItem.image}
                                        alt={nftItem.name}
                                        className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <p className="mt-2 font-bold">{nftItem.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 보상 내역 */}
            <div className="mt-10 w-full">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">{t("asset_page.Rewards_History")}</h2>
                    <button
                        className="flex items-center text-white text-xs"
                        onClick={() => navigate("/reward-history")}
                        >
                        {t("asset_page.View_All")} <FaChevronRight className="ml-1 w-4 h-4" />
                    </button>
                </div>
                <div className="mt-4 bg-[#1F1E27] rounded-lg border border-[#35383F] p-4">
                    {rewardHistory.map((reward) => (
                        <div
                            key={reward.id}
                            className="flex justify-between items-center py-2 border-b border-[#35383F]"
                            >
                            <div>
                                <p className="text-sm font-medium">{reward.description}</p>
                                <p className="text-xs text-gray-400">{reward.date}</p>
                            </div>
                            <p
                                className={`text-sm font-bold ${
                                reward.points.startsWith("+") ? "text-blue-400" : "text-red-400"
                                }`}
                                >
                                {reward.points}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* NFT 구매 알림 모달창 */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full">
                    <div className="bg-white text-black p-6 rounded-lg text-center w-[70%] max-w-[550px]">
                        <p>We're preparing for the service.</p>
                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                            onClick={()=>setShowModal(false)}
                            >
                            {t("OK")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAssets;
