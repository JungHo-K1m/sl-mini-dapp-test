import React, { useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";
import Images from "@/shared/assets/images";

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

    return (
        <div className="relative flex flex-col text-white px-6 min-h-screen bg-[#111827]">
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
                        className={`bg-[#1F1E27] border p-[10px] rounded-xl flex flex-col items-center
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
                            }}>
                            <img
                                src={nftItem.image}
                                alt={nftItem.name}
                                className="w-[80px] h-[80px] object-cover"
                            />
                        </div>
                        <p className="mt-2 font-bold">{nftItem.name}</p>
                    </div>
                ))}
            </div>

            {/* (2) 체크박스 & 결제 버튼: 화면 하단 고정 */}
            <div className="fixed bottom-0 left-0 w-full bg-[#111827] px-6 py-4">
                {/* 체크박스 동의 내용 */}
                <div className="flex flex-col gap-3 mb-8">
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
                            <span className="text-xs font-semibold text-[#3B82F6] ml-1">{t("asset_page.learn_more")}</span>
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
                            <span className="text-xs font-semibold text-[#3B82F6] ml-1">{t("asset_page.learn_more")}</span>
                        </span>
                    </label>
                </div>

                {/* 하단 결제 버튼들 */}
                <div className="flex w-full gap-3 mb-5">
                    {/* KAIA 결제 */}
                    <button
                        onClick={() => {
                            playSfx(Audios.button_click);
                            // TODO: KAIA 결제 로직
                        }}
                        className="w-1/2 bg-[#0147E5] px-6 py-3 rounded-full text-base font-medium"
                        >
                        67.758 KAIA
                    </button>

                    {/* USD 결제 */}
                    <button
                        onClick={() => {
                            playSfx(Audios.button_click);
                            // TODO: USD 결제 로직
                        }}
                        className="w-1/2 border border-[#0147E5] text-[#0147E5] px-6 py-3 rounded-full text-base font-medium"
                        >
                        USD $10
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemStore;
