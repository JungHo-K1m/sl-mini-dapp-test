import React, { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { BiWallet } from "react-icons/bi";
import { FaChevronRight } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { HiX } from 'react-icons/hi';
import Images from '@/shared/assets/images';
import { useTranslation } from "react-i18next";
import { useUserStore } from "@/entities/User/model/userModel";
import LoadingSpinner from '@/shared/components/ui/loadingSpinner';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/shared/components/ui';

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
    const [claimModalOpen, setClaimModalOpen] = useState(false);
    const [walletConnection, setWalletConnection] = useState(false);
    const [SLClaim, setSLClaim]= useState(false);
    const [USDCClaim, setUsdcCaim] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [falied, setFailed] = useState(false);
    const [success, setSuccess] = useState(false);

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
        return <LoadingSpinner className="h-screen"/>;
    }


    // 월 데이터를 숫자에서 영문으로 변환하는 헬퍼 함수
    const getMonthName = (monthNumber: number): string => {
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        return months[monthNumber - 1] || "Unknown"; // 1월 = index 0
    };

    // nft 더미 데이터
    const nftCollection: any[] = [
        { id: 1, name: "Cool Cat #1", image: "https://via.placeholder.com/100" },
        { id: 2, name: "Cool Cat #1", image: "https://via.placeholder.com/100" },
        { id: 3, name: "Cool Cat #1", image: "https://via.placeholder.com/100" },
        { id: 4, name: "Cool Cat #1", image: "https://via.placeholder.com/100" },
    ];

    // 보상 내역 더미 데이터
    const rewardHistory = [
        { id: 1, description: "Joined Telegram", date: "17-11-2024", points: "+150SL" },
        { id: 2, description: "AI Dental Examination", date: "17-10-2024", points: "-150SL" },
        { id: 3, description: "Subscribe to Email", date: "17-12-2024", points: "+150SL" },
        { id: 4, description: "Game Win", date: "17-6-2024", points: "+150P" },
        { id: 5, description: "Game Lose", date: "17-9-2024", points: "-150P" },
    ];

    // 날짜를 포맷팅하는 함수
    const formatDate = (date: string): string => {
        const [day, month, year] = date.split("-").map(Number);
        const monthName = getMonthName(month);
        return `${day} ${monthName} ${year}`;
    };

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
                            className="w-8 h-8 rounded-full"
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
                className="rounded-2xl p-5 mt-6 w-full flex items-center justify-between"
                onClick={()=>setShowModal(true)}
                style={{
                    background: "linear-gradient(to bottom, #19203CB2 0%, #304689 100%)",
                }}>
                <div className="pl-3">
                    <h3 className="text-base font-semibold mb-[6px]">{t("asset_page.Shop_Unique_NFTs_Now!")}</h3>
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
                    className="w-[90px] h-[90px]"
                />
            </div>
            

            {/* 내 NFT 컬렉션 */}
            <div className="mt-9 w-full">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">{t("asset_page.My_NFT_Collection")}</h2>
                    
                    <button
                        className="flex items-center text-white text-xs"
                        onClick={() => navigate("/my-nfts")}
                        aria-label="View All NFTs"
                        >
                        {t("asset_page.View_All")} <FaChevronRight className="ml-1 w-2 h-2" />
                    </button>
                </div>
                <div className="mt-4 w-full">
                    {nft === 0 ? (
                        <div className="mt-20 mb-36 h-[150px] flex flex-col items-center justify-center">
                            <p className="text-center text-[#737373] text-sm font-medium">
                                {/* {t("asset_page.no_nft")}<br />
                                {t("asset_page.own_nft")} */}
                                No NFTs in your colletion yet.<br />
                                Own NFT and Boost your rank!
                            </p>
                            <button
                                className="w-1/2 py-4 rounded-full text-base font-medium mt-12"
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

            {/* 클래임 */}
            <div className="mt-8 w-full">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Claimable Balance</h2>
                    
                    <button
                        className="flex items-center text-white text-xs"
                        onClick={() => navigate("/claim-history")}
                        aria-label="View Claim History"
                        >
                        View Claim History <FaChevronRight className="ml-1 w-2 h-2" />
                    </button>
                </div>

                 {/* SL Balance */}
                <div className="flex items-center justify-between h-14 py-4 px-5 border-[2px] rounded-full bg-[#1F1E27] border-[#35383F] mt-4">
                    <div className="flex items-center">
                        <img
                            src={Images.SLToken} // SL 이미지 경로를 설정
                            alt="SL Icon"
                            className="w-6 h-6 mr-1"
                        />
                        <span className="text-base font-medium text-gray-300">SL</span>
                    </div>
                    <span className="text-lg font-bold">750SL</span>
                </div>

                {/* USDC Balance */}
                <div className="flex items-center justify-between h-14 py-4 px-5 border-[2px] rounded-full bg-[#1F1E27] border-[#35383F] mt-2">
                    <div className="flex items-center">
                        <img
                            src={Images.USDC} // USDC 이미지 경로를 설정
                            alt="USDC Icon"
                            className="w-6 h-6 mr-1"
                        />
                        <span className="text-base font-medium text-gray-300">USDC</span>
                    </div>
                    <span className="text-lg font-bold">20.00USDC</span>
                </div>
                <button
                    className="w-full h-14 mt-3 py-4 rounded-full text-base font-medium bg-[#0147E5] text-white"
                    onClick={() => setClaimModalOpen(true)}
                    >
                    Claim Rewards
                </button>
            </div>

            {/* 보상 내역 */}
            <div className="mt-8 w-full">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">{t("asset_page.Rewards_History")}</h2>
                    <button
                        className="flex items-center text-white text-xs"
                        onClick={() => navigate("/reward-history")}
                        >
                        {t("asset_page.View_All")} <FaChevronRight className="ml-1 w-2 h-2" />
                    </button>
                </div>
                <div className="mt-4 bg-[#1F1E27] rounded-3xl border-[2px] border-[#35383F] py-3 px-4">
                    {rewardHistory.map((reward, index) => (
                        <div
                            key={reward.id}
                            className={`flex justify-between items-center py-4 ${
                                index !== rewardHistory.length - 1 ? "border-b border-[#35383F]" : ""
                            }`}
                        >
                            <div>
                                <p className="text-base font-normal">{reward.description}</p>
                                <p className="text-xs font-normal text-[#A3A3A3]">{formatDate(reward.date)}</p>
                            </div>
                            <p
                                className={`text-lg font-semibold ${
                                    reward.points.startsWith("+") ? "text-[#3B82F6]" : "text-[#DD2726]"
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

            {/* 1번 모달창 - 클래임할 토큰 선택  */}
            <AlertDialog open={claimModalOpen}>
                <AlertDialogContent className="rounded-3xl bg-[#21212F] text-white border-none">
                    <AlertDialogHeader>
                        <AlertDialogDescription className="sr-only">
                            Choose Token for Claim
                        </AlertDialogDescription>
                        <AlertDialogTitle className="text-center font-bold text-xl">
                            <div className="flex flex-row items-center justify-between">
                                <div> &nbsp;</div>
                                <p>Claim Tokens</p>
                                <HiX className={'w-6 h-6 cursor-pointer'} onClick={() => setClaimModalOpen(false)} />
                            </div>
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-base font-semibold text-gray-200 mt-5 mb-3 text-center">
                            Select the token you want to claim :
                        </p>
                        <div className="flex items-center w-[300px] h-[120px] rounded-2xl border-[#35383F] border-2 bg-[#181A20]">
                            {/* SL 버튼 */}
                            <button
                                onClick={() => {
                                    setClaimModalOpen(false);
                                    // 만약 지갑 연결이 필요한 경우:
                                    setWalletConnection(true);
                                    // 아니면 바로 SL Claim 모달:
                                    // setSLClaim(true);
                                }}
                                className="flex flex-col items-center justify-center w-[100px] h-[80px] ml-6 bg-[#1F1E27] rounded-2xl border-2 border-[#737373]"
                                >
                                <img
                                    src={Images.SLToken}
                                    alt="SL Token"
                                    className="w-[30px] h-[30px] mb-[2px]"
                                />
                                <p className="text-sm font-semibold">SL</p>
                            </button>

                            <span className="text-white font-semibold text-xl ml-3">OR</span>

                            {/* USDC 버튼 */}
                            <button
                                onClick={() => {
                                    // USDC 선택 시 로직 (예: 모달 닫고 USDC Claim 모달 열기)
                                    setClaimModalOpen(false);
                                    setUsdcCaim(true);
                                }}
                                className="flex flex-col items-center justify-center w-[100px] h-[80px] ml-3 bg-[#1F1E27] rounded-2xl border-2 border-[#737373]"
                                >
                                <img
                                    src={Images.USDC}
                                    alt="USDC Icon"
                                    className="w-[30px] h-[30px] mb-[2px]"
                                />
                                <p className="text-sm font-semibold">USDC</p>
                            </button>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>


            {/* 2번 모달창 - 지갑 연결 */}
            <AlertDialog open={walletConnection}>
                <AlertDialogContent className="rounded-3xl bg-[#21212F] text-white border-none">
                    <AlertDialogHeader>
                        <AlertDialogDescription className="sr-only">
                            Connect Wallet
                        </AlertDialogDescription>
                        <AlertDialogTitle className="text-center font-bold text-xl">
                            <div className="flex flex-row items-center justify-between">
                                <div> &nbsp;</div>
                                <p>Wallet Connection</p>
                                <HiX className={'w-6 h-6 cursor-pointer'} onClick={() => setWalletConnection(false)} />
                            </div>
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="flex flex-col items-center justify-center text-center space-y-6">
                        <p className="text-base font-semibold mt-4">
                            To claim SL, you need to connect <br />
                            your Kaikas wallet. <br />
                            Would you like to connect your wallet?
                        </p>

                        <div className="flex flex-row items-center justify-center gap-4 w-full">
                            {/* Connect Wallet 버튼 */}
                            <button
                                onClick={() => {
                                    // 여기에 실제 지갑 연결 로직
                                    // 예: connectKaikasWallet()
                                    // 모달 닫기 or 다음 단계 열기
                                    setWalletConnection(false);
                                    setSLClaim(true); // SLClaim 모달 열기
                                }}
                                className="w-full md:w-[180px] h-14 rounded-full bg-[#0147E5] text-white text-base font-medium"
                                >
                                Connect Wallet
                            </button>

                            {/* Cancel 버튼 */}
                            <button
                                onClick={() => setWalletConnection(false)}
                                className="w-full md:w-[180px] h-14 rounded-full border-[2px] border-[#737373] text-white font-medium"
                                >
                                Cancel
                            </button>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>


            {/* 3-1번 모달창 - SL토큰 클래임 */}
            <AlertDialog open={SLClaim}>
                <AlertDialogContent className="rounded-3xl bg-[#21212F] text-white border-none">
                    <AlertDialogHeader>
                        <AlertDialogDescription className="sr-only">
                            Claim SL Token
                        </AlertDialogDescription>
                        <AlertDialogTitle className="text-center font-bold text-xl">
                            <div className="flex flex-row items-center justify-between">
                                <div> &nbsp;</div>
                                <p>SL Claim</p>
                                <HiX className={'w-6 h-6 cursor-pointer'} onClick={() => setSLClaim(false)} />
                            </div>
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="flex flex-col items-center justify-center text-center">
                        {/* 연결된 지갑 주소 표시 (예시) */}
                        <p className="mb-2 mt-4 text-base font-semibold">
                            Connected wallet address : <br />
                            <span>0x0x3Aa5ebB10DC79...</span>
                        </p>

                        {/* 안내 문구 */}
                        <p className="text-sm text-[#A3A3A3] mb-5 leading-5 font-normal">
                            Note: A gas fee will be deducted from your claim. <br />
                            Minimum claim amount is 100SL.
                        </p>

                        {/* 수량 입력 필드 */}
                        <label className="block text-base font-semibold mb-1">Enter the amount of SL to claim :</label>
                        <input
                            type="number"
                            placeholder="Enter the amount of SL"
                            className="w-full h-16 rounded-2xl bg-[#181A20] border border-[#35383F] px-3 py-2 mb-6 focus:outline-none focus:border-[#0147E5]"
                        />

                        {/* 버튼 (지갑 연결 or 실제 Claim) */}
                        <button
                            onClick={() => {
                                // 실제로 SL을 Claim할 때 지갑 호출 로직
                                setSLClaim(false);
                                setLoadingModal(true)
                            }}
                            className="w-full h-14 rounded-full bg-[#0147E5] text-white text-base font-medium"
                        >
                            Claim
                        </button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>


            {/* 3-2번 모달창 - USDC 클래임 */}
            <AlertDialog open={USDCClaim}>
                <AlertDialogContent className="rounded-3xl bg-[#21212F] text-white border-none">
                    <AlertDialogHeader>
                        <AlertDialogDescription className="sr-only">
                            Claim USDC
                        </AlertDialogDescription>
                        <AlertDialogTitle className="text-center font-bold text-xl">
                            <div className="flex flex-row items-center justify-between">
                                <div> &nbsp;</div>
                                <p>USDC Claim</p>
                                <HiX className={'w-6 h-6 cursor-pointer'} onClick={() => setUsdcCaim(false)} />
                            </div>
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="flex flex-col items-center justify-center text-center">
                        {/* 지갑 주소 입력 */}
                        <label className="block text-base font-semibold mb-2">
                            Enter the wallet address to receive USDC :
                        </label>
                        <input
                            type="text"
                            placeholder="Enter the wallet address"
                            className="w-full h-16 rounded-2xl bg-[#181A20] border-2 border-[#35383F] px-3 py-2 mb-6 focus:outline-none focus:border-[#0147E5]"
                        />

                        {/* 안내 문구 */}
                        <p className="text-sm font-normal text-[#A3A3A3] mb-5 leading-5">
                            Note: A gas fee will be deducted from your claim. <br />
                            Minimum claim amount is 100SL.
                        </p>

                        {/* USDC 수량 입력 */}
                        <label className="block text-base font-semibold mb-1">
                            Enter the amount of USDC to claim :
                        </label>
                        <input
                            type="number"
                            placeholder="Enter the amount of USDC"
                            className="w-full h-16 rounded-2xl bg-[#181A20] border-2 border-[#35383F] px-3 py-2 mb-6 focus:outline-none focus:border-[#0147E5]"
                        />

                        {/* Claim 버튼 */}
                        <button
                            onClick={() => {
                            // 실제 Claim 로직
                            setLoadingModal(true);
                            setUsdcCaim(false);
                            }}
                            className="w-full h-14 rounded-full bg-[#0147E5] text-white text-base font-medium"
                        >
                            Claim
                        </button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>


            {/* 4번 모달창 - 로딩 */}
            <AlertDialog open={loadingModal}>
                <AlertDialogContent className="rounded-3xl bg-[#21212F] text-white border-none">
                    <AlertDialogHeader>
                        <AlertDialogDescription className="sr-only">
                            Loading
                        </AlertDialogDescription>
                        <AlertDialogTitle className="text-center font-bold text-xl">
                            <div className="flex flex-row items-center justify-between">
                                <div> &nbsp;</div>
                                <p>Processing</p>
                                <HiX className={'w-6 h-6 cursor-pointer'} onClick={() => setLoadingModal(false)} />
                            </div>
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="flex flex-col items-center justify-center text-center">
                        {/* 상태 안내 문구 */}
                        <p className="text-sm mt-4 mb-1">Processing SL claim...</p>
                        <p className="text-xs text-gray-400 mb-4">Please wait.</p>

                        {/* LoadingSpinner 사용 */}
                        <LoadingSpinner 
                            size={6}
                            className="h-[80px]"  
                        />
                        <div className="flex flex-row items-center justify-center gap-4 mt-6">
                            {/* 모달 확인용 버튼 */}
                            <button
                                onClick={() => {
                                    // 성공 모달
                                    setSuccess(true);
                                    setLoadingModal(false);
                                }}
                                className="w-[120px] h-14 rounded-full bg-[#0147E5] text-white text-base font-medium"
                                >
                                성공 확인
                            </button>

                            {/* Close 버튼 */}
                            <button
                                onClick={() => {
                                    // 실패 모달
                                    setFailed(true);
                                    setLoadingModal(false);
                                }}
                                className="w-[120px] h-14 rounded-full border-[2px] border-[#737373] text-white text-base font-medium"
                                >
                                실패 확인
                            </button>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>


            {/* 5-1번 모달창 - 실패 */}
            <AlertDialog open={falied}>
                <AlertDialogContent className="rounded-3xl bg-[#21212F] text-white border-none">
                    <AlertDialogHeader>
                        <AlertDialogDescription className="sr-only">
                            Claim Failed
                        </AlertDialogDescription>
                        <AlertDialogTitle className="text-center font-bold text-xl">
                            <div className="flex flex-row items-center justify-between">
                                <div> &nbsp;</div>
                                <p>Claim Falied</p>
                                <HiX className={'w-6 h-6 cursor-pointer'} onClick={() => setFailed(false)} />
                            </div>
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        {/* 실패 안내 문구 */}
                        <p className="text-base font-semibold mt-4">
                            SL claim failed. Please try again later.
                        </p>

                        {/* 오류 메시지 */}
                        <p className="text-sm font-normal text-[#A3A3A3]">
                            Error message : Network error occurred
                        </p>

                        {/* 버튼들 */}
                        <div className="flex flex-row items-center justify-center gap-4 mt-6">
                            {/* Try Again 버튼 */}
                            <button
                                onClick={() => {
                                    // 재시도 로직
                                    setFailed(false);
                                    setLoadingModal(true); // 다시 로딩 모달 띄울 수도 있음
                                }}
                                className="w-[120px] h-14 rounded-full bg-[#0147E5] text-white text-base font-medium"
                                >
                                Try Again
                            </button>

                            {/* Close 버튼 */}
                            <button
                                onClick={() => setFailed(false)}
                                className="w-[120px] h-14 rounded-full border-[2px] border-[#737373] text-white text-base font-medium"
                                >
                                Close
                            </button>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>


            {/* 5-2번 모달창 - 성공 */}
            <AlertDialog open={success}>
                <AlertDialogContent className="rounded-3xl bg-[#21212F] text-white border-none">
                    <AlertDialogHeader>
                        <AlertDialogDescription className="sr-only">
                            Claim Success
                        </AlertDialogDescription>
                        <AlertDialogTitle className="text-center font-bold text-xl">
                            <div className="flex flex-row items-center justify-between">
                                <div> &nbsp;</div>
                                <p>Claim Completed</p>
                                <HiX className={'w-6 h-6 cursor-pointer'} onClick={() => setSuccess(false)} />
                            </div>
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        {/* 성공 안내 문구 */}
                        <p className="text-sm font-semibold mt-4">
                            SL claim was successful!
                        </p>
                        
                        <div className="text-base">
                            {/* 예시: 기획안에 나온 Claim된 수량, Transaction ID 표시 */}
                            Claimed SL amount : <span className="font-bold">500SL</span> <br />
                            Transaction ID : <span className="font-bold">0X123456789...</span>
                        </div>

                        {/* View History 버튼 */}
                        <button
                            onClick={() => {
                                setSuccess(false);
                                navigate('/claim-history');
                            }}
                            className="w-full h-14 rounded-full bg-[#0147E5] text-white text-base font-medium mt-4"
                            >
                            View History
                        </button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default MyAssets;
