import React, { useState, useEffect } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";
import Images from "@/shared/assets/images";
import DappPortalSDK from "@linenext/dapp-portal-sdk";
import paymentSession from "@/entities/Asset/api/payment";
import { HiX } from 'react-icons/hi';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/shared/components/ui'
import getItemInfo from "@/entities/Asset/api/getItemInfo";

const nftCollection = [
    {
        id: "auto",
        name: "Auto Item",
        image: Images.AutoNFT,
    },
    {
        id: "booster",
        name: "Reward Booster(5x)",
        image: Images.RewardNFT,
    },
];

const ItemStore: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { playSfx } = useSound();
    const [showModal, setShowModal] = useState(false);

    // 어떤 아이템(auto, booster)을 선택했는지 추적
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    // 체크박스 동의 여부
    const [agreeRefund, setAgreeRefund] = useState(false);
    const [agreeEncrypted, setAgreeEncrypted] = useState(false);

    // 모든 조건이 만족되어야 버튼 활성화
    const isEnabled = selectedItem !== null && agreeRefund && agreeEncrypted;

    // 뒤로가기
    const handleBackClick = () => {
        playSfx(Audios.button_click);
        navigate(-1);
    };

    useEffect(()=>{
        const getItems = async () =>{
            try{
                const items = await getItemInfo();

                if(items){
                    console.log("아이템 정보 확인");
                } else {
                    console.log("아이템 정보 실패");
                }
            } catch (err: any){
                console.error('Failed to fetch sl token count:', err);
            }
        }
        getItems();
    },[]);

    // 아이템 카드 클릭 시
    const handleSelectItem = (itemId: string) => {
        playSfx(Audios.button_click);
        setSelectedItem(itemId);
    };

    // USD 결제 버튼 클릭 시 Stripe Checkout 링크로 리디렉션
    const handleUSDCheckout = async () => {
        playSfx(Audios.button_click);
        
        // 1) SDK 초기화
        const sdk = await DappPortalSDK.init({
            clientId: import.meta.env.VITE_LINE_CLIENT_ID || "",
        });
        
        const response = await paymentSession(1,"STRIPE","0xf80fF1B467Ce45100A1E2dB89d25F1b78c0d22af");
        
        if(response){
            console.log("결제 진행 payment id : ", response.id);
            const walletProvider = sdk.getWalletProvider();
            await walletProvider.request({ method: 'kaia_requestAccounts' });
            const paymentProvider = sdk.getPaymentProvider();
            await paymentProvider.startPayment(response.id);
        }
    };

    const handleKaiaCheckout = async () => {
        playSfx(Audios.button_click);
        
        // 1) SDK 초기화
        const sdk = await DappPortalSDK.init({
            clientId: import.meta.env.VITE_LINE_CLIENT_ID || "",
        });
        
        const response = await paymentSession(1,"CRYPTO","0xf80fF1B467Ce45100A1E2dB89d25F1b78c0d22af");
        
        if(response){
            console.log("결제 진행 payment id : ", response.id);
            const walletProvider = sdk.getWalletProvider();
            await walletProvider.request({ method: 'kaia_requestAccounts' });
            const paymentProvider = sdk.getPaymentProvider();
            await paymentProvider.startPayment(response.id);
        }
    }

    const handleInfo = () => {
        playSfx(Audios.button_click);
        setShowModal(true);

        if (selectedItem === "auto") {
            
        }
    }



    return (
        <div className="flex flex-col items-center text-white px-6 min-h-screen">
            {/* 상단 영역 */}
            <div className="h-14 flex items-center w-full font-bold text-xl mb-4 justify-between">
                <IoChevronBackOutline
                    className="w-6 h-6 cursor-pointer"
                    onClick={handleBackClick}
                />
                <p>{t("asset_page.item_store")}</p>
                <img
                    src={Images.Receipt}
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => {
                        playSfx(Audios.button_click);
                        navigate("/payment-history");
                    }}
                />
            </div>

            {/* (1) 아이템 목록 (2열 그리드) */}
            <div className="grid grid-cols-2 gap-4 mt-4 w-full mb-40">
                {nftCollection.map((nftItem) => (
                    <div
                        key={nftItem.id}
                        // 선택된 아이템이면 테두리 강조
                        className={`bg-[#1F1E27] border-2 p-[10px] rounded-xl flex flex-col items-center
                        ${
                            selectedItem === nftItem.id
                            ? "border-blue-400"
                            : "border-[#737373]"
                        }
                        `}
                        onClick={() => handleSelectItem(nftItem.id)}
                    >
                        <div
                            className="relative w-full aspect-[145/102] rounded-md mt-1 mx-1 overflow-hidden flex items-center justify-center"
                            style={{
                                background:
                                nftItem.name === "Auto Item"
                                    ? "linear-gradient(180deg, #0147E5 0%, #FFFFFF 100%)"
                                    : "linear-gradient(180deg, #FF4F4F 0%, #FFFFFF 100%)",
                            }}
                            >
                            <img
                                src={nftItem.image}
                                alt={nftItem.name}
                                className="w-[80px] h-[80px] object-cover"
                            />
                            <img
                                src={Images.infoMark}
                                alt="info"
                                className="absolute top-1 right-1 w-5 h-5"
                                onClick={handleInfo}
                            />
                        </div>
                        <p className="mt-2 text-sm font-semibold">{nftItem.name}</p>
                    </div>
                ))}
            </div>

            {/* (2) 체크박스 & 결제 버튼: 화면 하단 고정 */}
            <div className="fixed bottom-0 px-6">
                {/* 체크박스 동의 내용 */}
                <div className="flex flex-col gap-3 mb-5">
                    <label className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            checked={agreeRefund}
                            onChange={() => {
                                playSfx(Audios.button_click);
                                setAgreeRefund(!agreeRefund);
                            }}
                            />
                        <span className="text-xs font-medium">
                            {t("asset_page.agree_non_refundable")}
                            <span className="text-xs font-semibold text-[#3B82F6] ml-1">
                                {t("asset_page.learn_more")}
                            </span>
                        </span>
                    </label>

                    <label className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            checked={agreeEncrypted}
                            onChange={() => {
                                playSfx(Audios.button_click);
                                setAgreeEncrypted(!agreeEncrypted);
                            }}
                            />
                        <span className="text-xs font-medium">
                            {t("asset_page.provide_encrypted_id")}
                            <span className="text-xs font-semibold text-[#3B82F6] ml-1">
                                {t("asset_page.learn_more")}
                            </span>
                        </span>
                    </label>
                </div>

                {/* Kaia 잔액 표시 */}
                <div className="mb-3 flex justify-center items-center">
                    <span className="text-sm text-[#A3A3A3]">Available Balance :</span>
                    <span className="text-sm text-white ml-1">164.395 KAIA</span>
                </div>

                {/* 하단 결제 버튼들 */}
                <div className="flex w-full gap-3 mb-5">
                    {/* KAIA 결제 */}
                    <button
                        disabled={!isEnabled} // 조건 미충족 시 비활성화
                        onClick={handleKaiaCheckout}
                        className={
                        // 조건에 따라 색상 및 속성 적용
                        isEnabled
                            ? "w-1/2 bg-[#0147E5] px-6 py-3 rounded-full text-base font-medium"
                            : "w-1/2 bg-[#555] px-6 py-3 rounded-full text-base font-medium text-white"
                        }
                    >
                        67.758 KAIA
                    </button>

                    {/* USD 결제 */}
                    <button
                        disabled={!isEnabled}
                        onClick={handleUSDCheckout}
                        className={
                        isEnabled
                            ? "w-1/2 border-2 border-[#0147E5] text-white px-6 py-3 rounded-full text-base font-medium"
                            : "w-1/2 border-2 border-[#555] text-[#555] px-6 py-3 rounded-full text-base font-medium "
                        }
                    >
                        USD $10
                    </button>
                </div>
            </div>


            <AlertDialog open={showModal}>
                <AlertDialogContent className="rounded-3xl bg-[#21212F] text-white border-none">
                    <AlertDialogHeader>
                        <AlertDialogDescription className="sr-only">
                           Item details
                        </AlertDialogDescription>
                        <AlertDialogTitle className="text-center font-bold text-xl">
                            <div className="flex flex-row items-center justify-between">
                                <div> &nbsp;</div>
                                {selectedItem === "auto" ? <p>Auto Item</p>: <p>Reward Booster</p>}
                                <HiX 
                                    className={'w-6 h-6 cursor-pointer'} 
                                    onClick={() => {
                                        playSfx(Audios.button_click);
                                        setShowModal(false);
                                    }}/>
                            </div>
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="flex flex-col items-center justify-center">
                        <div
                            className="relative w-full aspect-[145/102] rounded-md mt-1 mx-1 overflow-hidden flex items-center justify-center"
                            style={{
                                background:
                                selectedItem === "auto"
                                    ? "linear-gradient(180deg, #0147E5 0%, #FFFFFF 100%)"
                                    : "linear-gradient(180deg, #FF4F4F 0%, #FFFFFF 100%)",
                            }}
                            >
                            <img
                                src={selectedItem === "auto" ? Images.AutoNFT : Images.RewardNFT}
                                alt={selectedItem === "auto" ? "auto item" : "reward booster"}
                                className="w-[80px] h-[80px] object-cover"
                            />
                        </div>
                        <p className="mt-2">date....</p>
                        <div className="mt-6 text-lg font-semibold">
                            {selectedItem === "auto" ? 
                                <p>Dice Auto Roller</p> : <p>Reward Booster</p>}
                        </div>
                        <div className="mt-1 text-base font-normal">
                            {selectedItem === "auto" ? 
                                <p>Rolls the dice automatically</p> :
                                <p>Board & Spin Reward Upgrade : 5x</p>}
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ItemStore;
