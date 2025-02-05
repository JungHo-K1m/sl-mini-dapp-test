import React, { useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";
import Images from "@/shared/assets/images";


const ItemStore: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { playSfx } = useSound();

    // 어떤 아이템을 선택했는지 관리 (단일 선택 예시)
    const [selectedItem, setSelectedItem] = useState<"auto" | "booster" | null>(null);

    // 체크박스 동의 여부
    const [agreeRefund, setAgreeRefund] = useState(false);
    const [agreeEncrypted, setAgreeEncrypted] = useState(false);

    const handleBackClick = () => {
        playSfx(Audios.button_click);
        navigate(-1);
    };

    // 아이템 카드 클릭 시
    const handleSelectItem = (itemType: "auto" | "booster") => {
        playSfx(Audios.button_click);
        setSelectedItem(itemType);
    };

    return (
        <div className="flex flex-col text-white mb-32 px-6 min-h-screen">
            <div className="h-14 flex items-center  w-full font-bold text-xl mb-8 justify-between">
                <IoChevronBackOutline 
                    className="w-6 h-6"
                    onClick={handleBackClick} />
                <p>{t("asset_page.item_store")}</p>
                <img
                    src={Images.Receipt}
                    className="w-6 h-6"
                    onClick={() => {navigate("/payment-history")}}/>
            </div>

            {/* 아이템 카드 2개 (Auto / Booster) */}
            <div className="flex justify-center gap-4">
                {/* Auto Item 카드 */}
                <div
                    onClick={() => handleSelectItem("auto")}
                    className={`relative w-[130px] h-[130px] rounded-xl border 
                        ${selectedItem === "auto" ? "border-gray-300" : "border-gray-600"} 
                        flex-shrink-0 cursor-pointer`}
                    style={{
                        background: "linear-gradient(180deg, #0147E5 0%, #FFFFFF 100%)",
                    }}
                    >
                    <img
                        src={Images.AutoNFT}
                        alt="auto item"
                        className="absolute w-[72px] h-[72px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    />
                </div>

                {/* Booster Item 카드 */}
                <div
                    onClick={() => handleSelectItem("booster")}
                    className={`relative w-[130px] h-[130px] rounded-xl border 
                        ${selectedItem === "booster" ? "border-gray-300" : "border-gray-600"} 
                        flex-shrink-0 cursor-pointer`}
                    style={{
                        background: "linear-gradient(180deg, #FF4F4F 0%, #FFFFFF 100%)",
                    }}
                    >
                    <img
                        src={Images.RewardNFT}
                        alt="reward booster"
                        className="absolute w-[72px] h-[72px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    />
                </div>
            </div>

            {/* 아이템 이름 표시 (디자인상 카드 하단에 텍스트를 넣어도 되고, 카드 안에 포함해도 됨) */}
            <div className="flex justify-center gap-4 mt-2">
                <div className="w-[130px] text-center">
                    <p className="text-base mt-1">Auto Item</p>
                </div>
                <div className="w-[130px] text-center">
                    <p className="text-base mt-1">Reward Booster(5x)</p>
                </div>
            </div>

            {/* 체크박스 동의 내용 */}
            <div className="mt-6 flex flex-col gap-3">
                <label className="flex items-start gap-2">
                    <input
                        type="checkbox"
                        checked={agreeRefund}
                        onChange={() => {
                        playSfx(Audios.button_click);
                        setAgreeRefund(!agreeRefund);
                        }}
                    />
                    <span className="text-sm">
                        I agree that the product is non-refundable. 
                        <span className="text-blue-400 ml-1">LEARN MORE</span>
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
                    <span className="text-sm">
                        I agree to provide encrypted ID information to LY Corporation 
                        when making a payment via LINE IAP 
                        <span className="text-blue-400 ml-1">LEARN MORE</span>
                    </span>
                </label>
            </div>

            {/* 하단 결제 버튼들 */}
            <div className="flex justify-center gap-4 mt-8">
                {/* KAIA 결제 */}
                <button
                    onClick={() => {
                        playSfx(Audios.button_click);
                        // TODO: KAIA 결제 로직
                    }}
                    className="bg-blue-600 px-6 py-3 rounded-full font-semibold"
                    >
                    67.758 KAIA
                </button>

                {/* USD 결제 */}
                <button
                    onClick={() => {
                        playSfx(Audios.button_click);
                        // TODO: USD 결제 로직
                    }}
                    className="border border-blue-600 text-blue-600 px-6 py-3 rounded-full font-semibold"
                    >
                    USD $10
                </button>
            </div>
        </div>
    );
};

export default ItemStore;