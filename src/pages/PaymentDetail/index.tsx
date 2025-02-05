import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TopTitle } from "@/shared/components/ui";
import { useTranslation } from "react-i18next";
import Images from "@/shared/assets/images";

const PaymentDetail: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
  
    const { itemName, purchaseDate, price, orderId } = location.state as {
        itemName: string;
        purchaseDate: Date;
        price: number;
        orderId: string;
    };

    return (
        <div className="flex flex-col text-white mb-32 px-6 min-h-screen">
            <TopTitle title={t("asset_page.detail")} back={true} />

            {/* 상단 아이콘 + 아이템 이름 */}
            <div
                className="relative w-[100px] h-[100px] rounded-2xl"
                style={{
                background:
                    itemName === "Auto Item"
                    ? "linear-gradient(180deg, #0147E5 0%, #FFFFFF 100%)"
                    : "linear-gradient(180deg, #FF4F4F 0%, #FFFFFF 100%)",
                }}
            >
                <img
                    src={
                        itemName === "Auto Item"
                        ? Images.AutoNFT
                        : Images.RewardNFT
                    }
                    alt="item icon"
                    className="absolute w-[72px] h-[72px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
            </div>

            {/* 상세 정보 */}
            <div className="mt-6">
                <div className="flex justify-between border-b border-gray-600 py-2">
                    <span>Date</span>
                    <span>
                        {purchaseDate
                        ? new Date(purchaseDate).toLocaleString()
                        : "--"}
                    </span>
                </div>
                <div className="flex justify-between border-b border-gray-600 py-2">
                    <span>Order ID</span>
                    <span>{orderId || "--"}</span>
                </div>
                <div className="flex justify-between py-2">
                    <span>Price</span>
                    <span>USD ${price ?? "--"}</span>
                </div>
            </div>
        </div>
    );
};

export default PaymentDetail;
