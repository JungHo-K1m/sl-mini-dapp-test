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
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";
import getRewardsHistory from "@/entities/Asset/api/getRewardsHistory";
import DappPortalSDK from "@linenext/dapp-portal-sdk";
import { BigNumber, ethers } from "ethers";
import { kaiaGetBalance, KaiaRpcResponse } from "@/entities/Asset/api/getKaiaBalance";
import getMyAssets from "@/entities/Asset/api/getMyAssets";
import requestClaim from "@/entities/Asset/api/requestClaim";


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

        const charsToShow = maxLen - 9;
        const frontChars = Math.ceil(charsToShow / 2);
        const backChars = Math.floor(charsToShow / 2);

        return (
            str.substr(0, frontChars) + '...' + str.substr(str.length - backChars)
        );
    };

    const truncatedText = truncateMiddle(text, maxLength);

    return <div className={`text-sm font-bold ${className}`}>{truncatedText}</div>;
};

interface ClaimData {
    claimId: number;
    walletAddress: string;
    claimType: string;
    claimStatus: string;
    amount: number;
}

const MyAssets: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { playSfx } = useSound();
    const { userId, userLv, characterType } = useUserStore();
    const [loading, setLoading] = useState(true);
    const [nft, setNFT] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [claimModalOpen, setClaimModalOpen] = useState(false);
    const [walletConnectionSLT, setWalletConnectionSLT] = useState(false);
    const [walletConnectionUSDC, setWalletConnectionUSDC] = useState(false);
    const [SLClaim, setSLClaim]= useState(false);
    const [USDCClaim, setUsdcCaim] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [rewardHistoryData, setRewardHistoryData] = useState<any[]>([]);
    const [balance, setBalance] = useState("0.00");
    const [walletAccount, setWalletAcount] = useState("");


    const [nonNftItems, setNonNftItems] = useState<any[]>([]);
    const [nftCollection, setNftCollection] = useState<any[]>([]);
    const [claimBalance, setClaimBalance] = useState<{ slPoints: number; usdcPoints: number }>({ slPoints: 0, usdcPoints: 0 });

    const [claimSuccess, setClaimSuccess] = useState(false);
    const [claimFailed, setClaimFailed] = useState(false);
    const [failMessage, setFailMessage] = useState("");
    const [claimData, setClaimData] = useState<ClaimData | null>(null);
    const [userClaimAmount, setUserClaimAmount] = useState("");  

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


    // 월 데이터를 숫자에서 영문으로 변환하는 헬퍼 함수
    const getMonthName = (monthNumber: number): string => {
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        return months[monthNumber - 1] || "Unknown"; // 1월 = index 0
    };

    // API 호출: 자산 정보 (Non-NFT 아이템, NFT 컬렉션, Claim Balance)
    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const assets = await getMyAssets();
                if (assets) {
                    setNonNftItems(assets.items || []);
                    setNftCollection(assets.nfts || []);
                    if (assets.claimBalance) {
                        setClaimBalance({
                            slPoints: assets.claimBalance.slPoints,
                            usdcPoints: assets.claimBalance.usdcPoints,
                        });
                    }
                }
            } catch (err) {
                console.error("Failed to fetch assets:", err);
            }
        };
        fetchAssets();
    }, []);

    useEffect(() => {
        const fetchRewardsHistory = async () => {
            try {
                const data = await getRewardsHistory("STAR", "REWARD", null, null, 0);
                const rewards = data.content || [];
                setRewardHistoryData(rewards);
            } catch (error) {
                console.error("보상 내역을 불러오는데 실패했습니다: ", error);
            }
        };
        fetchRewardsHistory();
    }, []);

    const displayHistory = rewardHistoryData.map((reward) => {
        const displayAsset = reward.currencyType === "STAR" ? "P" : reward.currencyType;
        const displayChangeType = reward.changeType === "REWARD" ? "INCREASE" : "DECREASE";
        return {
            ...reward,
            displayAsset,
            displayChangeType,
        };
    });


    // 날짜를 포맷팅하는 함수
    const formatDate = (date: string): string => {
        const [day, month, year] = date.split("-").map(Number);
        const monthName = getMonthName(month);
        return `${day} ${monthName} ${year}`;
    };

    // 날짜 포맷팅 헬퍼 함수
    const formatDuration = (dateStr: string): string => {
        const date = new Date(dateStr);
        const day = date.getDate();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    
    const formatDateRange = (gainedAt: string, expirationTime: string): string => {
        return `${formatDuration(gainedAt)} ~ ${formatDuration(expirationTime)}`;
    };

    // 아이템별 배경색 결정 함수
    const getBackgroundGradient = (itemName: string) => {
        const name = itemName.toUpperCase();
        if (name === "AUTO") {
            return "linear-gradient(180deg, #0147E5 0%, #FFFFFF 100%)";
        } else if (name === "REWARD") {
            return "linear-gradient(180deg, #FF4F4F 0%, #FFFFFF 100%)";
        } else {
            return "linear-gradient(180deg, #22C55E 0%, #FFFFFF 100%)";
        }
    };

    // 잔액 조회를 수행하는 함수
    const fetchBalance = async (account: string) => {
        try {
            const response: KaiaRpcResponse<string> = await kaiaGetBalance(account);
            if (response.error) {
                console.log("잔고 확인 에러: ", response.error);
            } else if (response.result) {
                const rawBalanceHex = response.result;
                const KAIA_DECIMALS = 18;
                const balanceBigNumber = BigNumber.from(rawBalanceHex);
                const formattedBalance = ethers.utils.formatUnits(balanceBigNumber, KAIA_DECIMALS);
                // 소수점 두 자리로 표기
                setBalance(Number(formattedBalance).toFixed(2));
            }
        } catch (err: any) {
            console.error("Failed to fetch token count:", err);
        }
    };

    // 지갑 연결 및 잔액 확인 함수 (버튼 클릭 시 호출)
    const handleBalance = async () => {
        playSfx(Audios.button_click);

        // sdk 초기화
        const sdk = await DappPortalSDK.init({
            clientId: import.meta.env.VITE_LINE_CLIENT_ID || "",
            chainId: '1001',
        });

        // walletProvider 호출 및 지갑 주소 확인
        const walletProvider = sdk.getWalletProvider();
        const accounts = (await walletProvider.request({
            method: "kaia_requestAccounts",
        })) as string[];

        if (accounts && accounts[0]) {
            const account = accounts[0];
            setWalletAcount(account);
            await fetchBalance(account);
            setShowWalletModal(true);
        }
    };

    // 페이지 접근 시 로컬스토리지에서 지갑 주소가 있는지 확인 후 잔액 조회
    useEffect(() => {
        const checkStoredWallet = async () => {
            const storedWalletAddress = window.localStorage.getItem("sdk.dappportal.io:1001:selectedWalletAddress");
            if (storedWalletAddress) {
                setWalletAcount(storedWalletAddress);
                await fetchBalance(storedWalletAddress);
            }
        };
        checkStoredWallet();
    }, []);

    
    // 결제 내역 조회(dapp-portal sdk 사용)
    const handlePaymentHistory = async () => {
        playSfx(Audios.button_click);
        const sdk = await DappPortalSDK.init({
            clientId: import.meta.env.VITE_LINE_CLIENT_ID || "",
            chainId: "1001",
        });
        const paymentProvider = sdk.getPaymentProvider();
        await paymentProvider.openPaymentHistory();
    };

    // 클래임 요청 함수
    const handleClaim = async (type: string, amount: string, address: string) => {
        playSfx(Audios.button_click);
        setSLClaim(false);
        setUsdcCaim(false);
        setLoadingModal(true);
        try {
            const claim = await requestClaim(type, amount, address);
            if (claim.message === "Success"){
                setClaimData(claim.data);
                setLoadingModal(false);
                setClaimSuccess(true);
            } else if (claim.message === "Please check your balance."){
                setFailMessage("Please check your balance.")
                setLoadingModal(false);
                setClaimFailed(true);
            } else{
                setFailMessage("Network error occurred")
                setLoadingModal(false);
                setClaimFailed(true);
            }
        } catch(err: any){
            setFailMessage("Network error occurred")
            setLoadingModal(false);
            setClaimFailed(true);
        }
    }

    return (  
        loading 
          ? <LoadingSpinner className="h-screen" /> 
          : (
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
                        {/* kaia 잔액 표시 */}
                        <div className="relative flex items-center">
                            <img
                                src={Images.KaiaLogo}
                                alt="Kaia Icon"
                                className="relative w-9 h-9 z-10 rounded-full object-cover"
                            />
                            <div className="-ml-[20px] flex items-center justify-end bg-[#1F1E27] rounded-full px-3 py-2 w-20 h-7 z-0">
                                <span className="text-white text-xs">{balance}</span>
                            </div>
                        </div>

                        {/* 지갑 페이지 이동 */}
                        <button 
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            onClick={handleBalance}>
                            <BiWallet className="w-6 h-6" />
                        </button>
                        {/* 설정 페이지 이동 */}
                        <button 
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            onClick={()=>{
                                playSfx(Audios.button_click);
                                navigate('/settings');
                            }}>
                            <IoSettingsOutline className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* NFT 상점 이동 영역 - 추후 수정 예정 */}
                <div 
                    className="rounded-2xl p-5 mt-6 w-full flex items-center justify-between"
                    onClick={()=>{
                        playSfx(Audios.button_click);
                        setShowModal(true);
                    }}
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

                {/* Non-NFT Items 영역 */}
                <div className="mt-9 w-full">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">{t("asset_page.non_nft")}</h2>
                        <button
                            className="flex items-center text-white text-xs"
                            onClick={handlePaymentHistory}
                            aria-label="View All Items">
                            {t("asset_page.View_All")} <FaChevronRight className="ml-1 w-2 h-2" />
                        </button>
                    </div>
                    <div className="mt-4 w-full">
                        {nonNftItems.length === 0 ? (
                            <div className="mt-20 mb-36 h-[150px] flex flex-col items-center justify-center">
                                <p className="text-center text-[#737373] text-sm font-medium">
                                {t("asset_page.no_item")}<br />
                                {t("asset_page.own_item")}
                                </p>
                                <button
                                    className="w-1/2 py-4 rounded-full text-base font-medium mt-12"
                                    style={{ backgroundColor: '#0147E5' }}
                                    onClick={() => {
                                        playSfx(Audios.button_click);
                                        navigate("/item-store", { state: { balance, walletAccount } });
                                    }}>
                                    {t("asset_page.shop_item")}
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center">
                                <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                                    {nonNftItems.map((item, index) => (
                                    <div
                                        key={`${item.itemType}-${index}`}
                                        className="bg-[#1F1E27] border-2 border-[#737373] p-[10px] rounded-xl flex flex-col items-center"
                                        onClick={() => {
                                            playSfx(Audios.button_click);
                                            // 아이템 상세 정보 모달 등 처리
                                            }}>
                                        <div
                                        className="relative w-full aspect-[145/102] rounded-md mt-1 mx-1 overflow-hidden flex items-center justify-center"
                                        style={{ background: getBackgroundGradient(item.itemType) }}>
                                        <img
                                            src={item.imgUrl}
                                            alt={item.name}
                                            className="w-[80px] h-[80px] object-cover"
                                        />
                                        </div>
                                        <p className="mt-2 text-sm font-semibold">{item.name}</p>
                                        <p className="mt-2 text-xs font-normal text-[#A3A3A3] whitespace-nowrap">
                                            {formatDateRange(item.gainedAt, item.expirationTime)}
                                        </p>
                                    </div>
                                    ))}
                                </div>
                                <button
                                    className="w-40 h-14 py-4 rounded-full text-base font-medium mt-12"
                                    style={{ backgroundColor: '#0147E5' }}
                                    onClick={() => {
                                        playSfx(Audios.button_click);
                                        navigate("/item-store", { state: { balance, walletAccount } });
                                    }}>
                                    {t("asset_page.shop_item")}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* NFT 컬렉션 영역 */}
                <div className="mt-9 w-full">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">{t("asset_page.My_NFT_Collection")}</h2>
                        {/* 내가 소유한 모든 NFT 확인 */}
                        {/* <button
                            className="flex items-center text-white text-xs"
                            onClick={() => {
                                playSfx(Audios.button_click);
                                navigate("/my-nfts");
                            }}
                            aria-label="View All NFTs">
                            {t("asset_page.View_All")} <FaChevronRight className="ml-1 w-2 h-2" />
                        </button> */}
                    </div>
                    <div className="mt-4 w-full">
                        {nftCollection.length === 0 ? (
                            <div className="mx-20 h-[150px] flex flex-col items-center justify-center">
                                <p className="text-center text-[#737373] text-sm font-medium">
                                    {t("asset_page.no_nft")}<br />
                                    {t("asset_page.own_nft")}
                                </p>
                                <button
                                    className="w-40 h-14 py-4 rounded-full text-base font-medium mt-12"
                                    style={{ backgroundColor: '#0147E5' }}
                                    onClick={() => {
                                        playSfx(Audios.button_click);
                                        setShowModal(true);
                                    }}>
                                    {t("asset_page.shop_nft")}
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center">
                                <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                                    {nftCollection.map((nftItem) => (
                                    <div
                                        key={nftItem.id}
                                        className="bg-[#1F1E27] border border-[#737373] p-[10px] rounded-xl flex flex-col items-center">
                                        <div className="w-full aspect-[145/154] rounded-md mt-1 mx-1 overflow-hidden">
                                        <img
                                            src={nftItem.imgUrl}
                                            alt={nftItem.name}
                                            className="w-full h-full object-cover"
                                        />
                                        </div>
                                        <p className="mt-2 text-sm font-semibold">{nftItem.name}</p>
                                    </div>
                                    ))}
                                </div>
                                <button
                                    className="w-1/2 py-4 rounded-full text-base font-medium mt-12"
                                    style={{ backgroundColor: '#0147E5' }}
                                    onClick={() => {
                                        playSfx(Audios.button_click);
                                        setShowModal(true);
                                    }}>
                                    {t("asset_page.shop_nft")}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Claim Balance 영역 */}
                <div className="mt-8 w-full">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">{t("asset_page.claimable")}</h2>
                        <button
                            className="flex items-center text-white text-xs"
                            onClick={() => {
                                playSfx(Audios.button_click);
                                navigate("/claim-history");
                            }}
                            aria-label="View Claim History">
                            {t("asset_page.view_claim")} <FaChevronRight className="ml-1 w-2 h-2" />
                        </button>
                    </div>
                    {/* SL Balance */}
                    <div className="flex items-center justify-between h-14 py-4 px-5 border-[2px] rounded-full bg-[#1F1E27] border-[#35383F] mt-4">
                        <div className="flex items-center">
                            <img src={Images.SLToken} alt="SL Icon" className="w-6 h-6 mr-1" />
                            <span className="text-base font-medium text-gray-300">SL</span>
                        </div>
                        <span className="text-lg font-bold">{claimBalance.slPoints} SL</span>
                    </div>
                    {/* USDC Balance */}
                    <div className="flex items-center justify-between h-14 py-4 px-5 border-[2px] rounded-full bg-[#1F1E27] border-[#35383F] mt-2">
                        <div className="flex items-center">
                            <img src={Images.USDC} alt="USDC Icon" className="w-6 h-6 mr-1" />
                            <span className="text-base font-medium text-gray-300">USDC</span>
                        </div>
                        <span className="text-lg font-bold">{claimBalance.usdcPoints} USDC</span>
                    </div>
                    <button
                        className="w-full h-14 mt-3 py-4 rounded-full text-base font-medium bg-[#0147E5] text-white"
                        onClick={() => {
                            playSfx(Audios.button_click);
                            setClaimModalOpen(true);
                            }}>
                            {t("asset_page.claim_reward")}
                    </button>
                </div>

                {/* 보상 내역 */}
                <div className="mt-8 w-full">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">{t("asset_page.Rewards_History")}</h2>
                        <button
                            className="flex items-center text-white text-xs"
                            onClick={() => {
                                playSfx(Audios.button_click);
                                navigate("/reward-history");
                            }}
                            >
                            {t("asset_page.View_All")} <FaChevronRight className="ml-1 w-2 h-2" />
                        </button>
                    </div>
                    <div className="mt-4 bg-[#1F1E27] rounded-3xl border-[2px] border-[#35383F] py-3 px-4">
                        {displayHistory.length > 0 ? (
                            displayHistory.map((reward, index) => (
                                <div
                                    key={`${reward.loggedAt}-${index}`}
                                    className={`flex justify-between items-center py-4 ${
                                        index !== displayHistory.length - 1 ? "border-b border-[#35383F]" : ""
                                    }`}
                                >
                                    <div>
                                        <p className="text-sm font-normal">{reward.content}</p>
                                        {/* API에서 제공하는 날짜 필드명이 loggedAt 또는 다른 이름일 수 있으므로 확인 후 사용 */}
                                        <p className="text-xs font-normal text-[#A3A3A3]">
                                            {formatDate(reward.loggedAt)}
                                        </p>
                                    </div>
                                    <p
                                        className={`text-base font-semibold ${
                                            reward.displayChangeType === "INCREASE"
                                                ? "text-[#3B82F6]"
                                                : "text-[#DD2726]"
                                        }`}
                                    >
                                        {reward.displayChangeType === "INCREASE" ? "+" : "-"}
                                        {reward.amount} {reward.displayAsset}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-sm text-gray-400">
                                {t("asset_page.no_records") || "No records found"}
                            </p>
                        )}
                    </div>
                </div>

                {/* NFT 구매 알림 모달창 */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full">
                        <div className="bg-white text-black p-6 rounded-lg text-center w-[70%] max-w-[550px]">
                            <p>{t("asset_page.prepare_service")}</p>
                            <button
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                                onClick={()=>{
                                    playSfx(Audios.button_click);
                                    setShowModal(false);
                                }}
                                >
                                {t("OK")}
                            </button>
                        </div>
                    </div>
                )}

                {/* 지갑 연결 알림 모달창 */}
                {showWalletModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full">
                        <div className="bg-white text-black p-6 rounded-lg text-center w-[70%] max-w-[550px]">
                            <p>{t("asset_page.wallet_connect")}</p>
                            <button
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                                onClick={()=>{
                                    playSfx(Audios.button_click);
                                    setShowWalletModal(false);
                                }}
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
                                    <p>{t("asset_page.claim.claim_token")}</p>
                                    <HiX 
                                        className={'w-6 h-6 cursor-pointer'} 
                                        onClick={() => {
                                            playSfx(Audios.button_click);
                                            setClaimModalOpen(false);
                                        }}/>
                                </div>
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-base font-semibold text-gray-200 mt-5 mb-3 text-center">
                                {t("asset_page.claim.select_token")}
                            </p>
                            <div className="flex items-center w-[300px] h-[120px] rounded-2xl border-[#35383F] border-2 bg-[#181A20]">
                                {/* SL 버튼 */}
                                <button
                                    onClick={() => {
                                        playSfx(Audios.button_click);
                                        setClaimModalOpen(false);
                                        setWalletConnectionSLT(true);
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
                                        playSfx(Audios.button_click);
                                        // USDC 선택 시 로직 (예: 모달 닫고 USDC Claim 모달 열기)
                                        setClaimModalOpen(false);
                                        setWalletConnectionUSDC(true);
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


                {/* 2-1번 모달창 - SL 선택 -> 지갑 연결 */}
                <AlertDialog open={walletConnectionSLT}>
                    <AlertDialogContent className="rounded-3xl bg-[#21212F] text-white border-none">
                        <AlertDialogHeader>
                            <AlertDialogDescription className="sr-only">
                                Connect Wallet
                            </AlertDialogDescription>
                            <AlertDialogTitle className="text-center font-bold text-xl">
                                <div className="flex flex-row items-center justify-between">
                                    <div> &nbsp;</div>
                                    <p>{t("asset_page.claim.wallet_connect")}</p>
                                    <HiX 
                                        className={'w-6 h-6 cursor-pointer'} 
                                        onClick={() => {
                                            playSfx(Audios.button_click);
                                            setWalletConnectionSLT(false);
                                        }}/>
                                </div>
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="flex flex-col items-center justify-center text-center space-y-6">
                            <p className="text-base font-semibold mt-4">
                                {t("asset_page.claim.to_claim_sl")} <br />
                                {t("asset_page.claim.would_you")}
                            </p>

                            <div className="flex flex-row items-center justify-center gap-4 w-full">
                                {/* Connect Wallet 버튼 */}
                                <button
                                    onClick={() => {
                                        playSfx(Audios.button_click);
                                        // 운영 버전에서는 지갑 연결 확인 로직 필요
                                        setWalletConnectionSLT(false);
                                        setSLClaim(true); // SLClaim 모달 열기
                                    }}
                                    className="w-full md:w-[180px] h-14 rounded-full bg-[#0147E5] text-white text-base font-medium"
                                    >
                                    {t("asset_page.claim.connect")}
                                </button>

                                {/* Cancel 버튼 */}
                                <button
                                    onClick={() => {
                                        playSfx(Audios.button_click);
                                        setWalletConnectionSLT(false);
                                    }}
                                    className="w-full md:w-[180px] h-14 rounded-full border-[2px] border-[#737373] text-white font-medium"
                                    >
                                    {t("asset_page.claim.cancel")}
                                </button>
                            </div>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>

                {/* 2-2번 모달창 - USDC 선택 -> 지갑 연결 */}
                <AlertDialog open={walletConnectionUSDC}>
                    <AlertDialogContent className="rounded-3xl bg-[#21212F] text-white border-none">
                        <AlertDialogHeader>
                            <AlertDialogDescription className="sr-only">
                                Connect Wallet
                            </AlertDialogDescription>
                            <AlertDialogTitle className="text-center font-bold text-xl">
                                <div className="flex flex-row items-center justify-between">
                                    <div> &nbsp;</div>
                                    <p>{t("asset_page.claim.wallet_connect")}</p>
                                    <HiX 
                                        className={'w-6 h-6 cursor-pointer'} 
                                        onClick={() => {
                                            playSfx(Audios.button_click);
                                            setWalletConnectionUSDC(false);
                                        }}/>
                                </div>
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="flex flex-col items-center justify-center text-center space-y-6">
                            <p className="text-base font-semibold mt-4">
                                {t("asset_page.claim.to_claim_sl")} <br />
                                {t("asset_page.claim.would_you")}
                            </p>

                            <div className="flex flex-row items-center justify-center gap-4 w-full">
                                {/* Connect Wallet 버튼 */}
                                <button
                                    onClick={() => {
                                        playSfx(Audios.button_click);
                                        // 운영 버전에서는 지갑 연결 확인 로직 필요
                                        setWalletConnectionUSDC(false);
                                        setUsdcCaim(true); // SLClaim 모달 열기
                                    }}
                                    className="w-full md:w-[180px] h-14 rounded-full bg-[#0147E5] text-white text-base font-medium"
                                    >
                                    {t("asset_page.claim.connect")}
                                </button>

                                {/* Cancel 버튼 */}
                                <button
                                    onClick={() => {
                                        playSfx(Audios.button_click);
                                        setWalletConnectionUSDC(false);
                                    }}
                                    className="w-full md:w-[180px] h-14 rounded-full border-[2px] border-[#737373] text-white font-medium"
                                    >
                                    {t("asset_page.claim.cancel")}
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
                                    <p>{t("asset_page.claim.sl")}</p>
                                    <HiX 
                                        className={'w-6 h-6 cursor-pointer'} 
                                        onClick={() => {
                                            playSfx(Audios.button_click);
                                            setSLClaim(false);
                                        }} />
                                </div>
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="flex flex-col items-center justify-center text-center">
                            {/* 연결된 지갑 주소 표시 (예시) */}
                            <p className="mb-2 mt-4 text-base font-semibold">
                                {t("asset_page.claim.connected")} <br />
                                <span><TruncateMiddle text={"0xf80fF1B467Ce45100A1E2dB89d25F1b78c0d22af"} maxLength={20} /></span>
                            </p>

                            {/* 안내 문구 */}
                            <p className="text-sm text-[#A3A3A3] mb-5 leading-5 font-normal">
                                {t("asset_page.claim.gas_note")} <br />
                                {t("asset_page.claim.min_claim")}
                            </p>

                            {/* 수량 입력 필드 */}
                            <label className="block text-base font-semibold mb-1">{t("asset_page.claim.enter_sl")}</label>
                            <input
                                type="number"
                                placeholder={t("asset_page.claim.enter_sl_placeholder")}
                                value={userClaimAmount}
                                onChange={(e) => setUserClaimAmount(e.target.value)}
                                className="w-full h-16 rounded-2xl bg-[#181A20] border border-[#35383F] px-3 py-2 mb-6 focus:outline-none focus:border-[#0147E5]"
                            />

                            {/* 클래임 버튼 */}
                            <button
                                // 운영 버전에서는 지갑 주소 하드코딩 X
                                onClick={() => handleClaim("SLT", userClaimAmount, "0xf80fF1B467Ce45100A1E2dB89d25F1b78c0d22af")}
                                className="w-full h-14 rounded-full bg-[#0147E5] text-white text-base font-medium"
                            >
                                {t("asset_page.claim.claim_btn")}
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
                                    <p>{t("asset_page.claim.usdc")}</p>
                                    <HiX 
                                        className={'w-6 h-6 cursor-pointer'} 
                                        onClick={() => {
                                            playSfx(Audios.button_click);
                                            setUsdcCaim(false);
                                        }}/>
                                </div>
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="flex flex-col items-center justify-center text-center">
                            {/* 지갑 주소 입력 */}
                            <p className="mb-2 mt-4 text-base font-semibold">
                                {t("asset_page.claim.connected")} <br />
                                <span><TruncateMiddle text={"0xf80fF1B467Ce45100A1E2dB89d25F1b78c0d22af"} maxLength={20} /></span>
                            </p>

                            {/* 안내 문구 */}
                            <p className="text-sm font-normal text-[#A3A3A3] mb-5 leading-5">
                                {t("asset_page.claim.gas_note")} <br />
                                {t("asset_page.claim.min_claim")}
                            </p>

                            {/* USDC 수량 입력 */}
                            <label className="block text-base font-semibold mb-1">
                                {t("asset_page.claim.enter_usdc")}
                            </label>
                            <input
                                type="number"
                                placeholder={t("asset_page.claim.enter_usdc_placeholder")}
                                value={userClaimAmount}
                                onChange={(e) => setUserClaimAmount(e.target.value)}
                                className="w-full h-16 rounded-2xl bg-[#181A20] border-2 border-[#35383F] px-3 py-2 mb-6 focus:outline-none focus:border-[#0147E5]"
                            />

                            {/* Claim 버튼 */}
                            <button
                                // 운영 버전에서는 지갑 주소 하드코딩 X
                                onClick={() => handleClaim("USDC", userClaimAmount, "0xf80fF1B467Ce45100A1E2dB89d25F1b78c0d22af")}
                                className="w-full h-14 rounded-full bg-[#0147E5] text-white text-base font-medium"
                            >
                                {t("asset_page.claim.claim_btn")}
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
                                    <p>{t("asset_page.claim.process")}</p>
                                    <HiX 
                                        className={'w-6 h-6 cursor-pointer'} 
                                        onClick={() => {
                                            playSfx(Audios.button_click);
                                            setLoadingModal(false);
                                        }}/>
                                </div>
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="flex flex-col items-center justify-center text-center">
                            {/* 상태 안내 문구 */}
                            <p className="text-sm mt-4 mb-1">{t("asset_page.claim.processing")}</p>
                            <p className="text-xs text-gray-400 mb-4">{t("asset_page.claim.wait")}</p>

                            {/* LoadingSpinner 사용 */}
                            <LoadingSpinner 
                                size={6}
                                className="h-[80px]"  
                            />
                        </div>
                    </AlertDialogContent>
                </AlertDialog>


                {/* 5-1번 모달창 - 실패 */}
                <AlertDialog open={claimFailed}>
                    <AlertDialogContent className="rounded-3xl bg-[#21212F] text-white border-none">
                        <AlertDialogHeader>
                            <AlertDialogDescription className="sr-only">
                                Claim Failed
                            </AlertDialogDescription>
                            <AlertDialogTitle className="text-center font-bold text-xl">
                                <div className="flex flex-row items-center justify-between">
                                    <div> &nbsp;</div>
                                    <p>{t("asset_page.claim.failed")}</p>
                                    <HiX 
                                        className={'w-6 h-6 cursor-pointer'} 
                                        onClick={() => {
                                            playSfx(Audios.button_click);
                                            setClaimFailed(false);
                                        }}/>
                                </div>
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                            {/* 실패 안내 문구 */}
                            <p className="text-base font-semibold mt-4">
                            {t("asset_page.claim.try_agein")}
                            </p>

                            {/* 오류 메시지 */}
                            <p className="text-sm font-normal text-[#A3A3A3]">
                                Error message : {failMessage}
                            </p>

                            {/* 버튼들 */}
                            <div className="flex flex-row items-center justify-center gap-4 mt-6">
                                {/* Try Again 버튼 */}
                                <button
                                    onClick={() => {
                                        playSfx(Audios.button_click);
                                        // 재시도 로직
                                        setClaimFailed(false);
                                        setLoadingModal(true); // 다시 로딩 모달 띄울 수도 있음
                                    }}
                                    className="w-[120px] h-14 rounded-full bg-[#0147E5] text-white text-base font-medium"
                                    >
                                    {t("asset_page.claim.try_agein_btn")}
                                </button>

                                {/* Close 버튼 */}
                                <button
                                    onClick={() => {
                                        playSfx(Audios.button_click);
                                        setClaimFailed(false);
                                    }}
                                    className="w-[120px] h-14 rounded-full border-[2px] border-[#737373] text-white text-base font-medium"
                                    >
                                    {t("asset_page.claim.close")}
                                </button>
                            </div>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>


                {/* 5-2번 모달창 - 성공 */}
                <AlertDialog open={claimSuccess}>
                    <AlertDialogContent className="rounded-3xl bg-[#21212F] text-white border-none">
                        <AlertDialogHeader>
                            <AlertDialogDescription className="sr-only">
                                Claim Success
                            </AlertDialogDescription>
                            <AlertDialogTitle className="text-center font-bold text-xl">
                                <div className="flex flex-row items-center justify-between">
                                    <div> &nbsp;</div>
                                    <p>{t("asset_page.claim.complete")}</p>
                                    <HiX 
                                        className={'w-6 h-6 cursor-pointer'} 
                                        onClick={() => {
                                            playSfx(Audios.button_click);
                                            setClaimSuccess(false);
                                        }}/>
                                </div>
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                            {/* 성공 안내 문구 */}
                            <p className="text-sm font-semibold mt-4">
                                {t("asset_page.claim.success")}
                            </p>
                            
                            {claimData && (
                                <div className="text-base">
                                    Claimed amount : <span className="font-bold">{claimData!.amount} {claimData!.claimType}</span> <br />
                                    Claim ID : <span className="font-bold">{claimData!.claimId}</span> <br />
                                </div>
                            )}

                            {/* View History 버튼 */}
                            <button
                                onClick={() => {
                                    playSfx(Audios.button_click);;
                                    setClaimSuccess(false);
                                    navigate('/claim-history');
                                }}
                                className="w-full h-14 rounded-full bg-[#0147E5] text-white text-base font-medium mt-4"
                                >
                                {t("asset_page.claim.view_history")}
                            </button>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        )
    );
};

export default MyAssets;
