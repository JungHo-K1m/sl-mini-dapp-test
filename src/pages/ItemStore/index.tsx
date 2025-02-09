import React, { useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";
import Images from "@/shared/assets/images";
import DappPortalSDK from "@linenext/dapp-portal-sdk";

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

    // 아이템 카드 클릭 시
    const handleSelectItem = (itemId: string) => {
        playSfx(Audios.button_click);
        setSelectedItem(itemId);
    };

    // USD 결제 버튼 클릭 시 Stripe Checkout 링크로 리디렉션
    const handleUSDCheckout = () => {
        playSfx(Audios.button_click);
        // Stripe 대시보드에서 발급받은 Checkout 링크 사용
        window.location.href = "https://buy.stripe.com/test_6oE6qf4GCcJX5OgfYY";
    };

    const handleKaiaCheckout = async () => {
        playSfx(Audios.button_click);
        
        // 1) SDK 초기화
        const sdk = await DappPortalSDK.init({
            clientId: import.meta.env.VITE_LINE_CLIENT_ID || "",
        });
        
        const walletProvider = sdk.getWalletProvider();
        await walletProvider.request({ method: 'kaia_requestAccounts' });
        
        const paymentProvider = sdk.getPaymentProvider();

        console.log("paymeny Provider testing: ", paymentProvider);

        await paymentProvider.startPayment("123456");
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
                        className="w-full aspect-[145/102] rounded-md mt-1 mx-1 overflow-hidden flex items-center justify-center"
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
        </div>
    );
};

export default ItemStore;
