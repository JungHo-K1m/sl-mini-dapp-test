import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TopTitle } from "@/shared/components/ui";
import { useTranslation } from "react-i18next";
import Images from "@/shared/assets/images";

const PaymentDetail: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // (1) useLocation으로 state 데이터 수신
  const { state } = useLocation() as {
    state: {
      itemName?: string;
      purchaseDate?: Date;
      price?: number;
      orderId?: string;
    };
  };

  // (2) 구조 분해로 필요한 정보만 꺼냄
  const { itemName, purchaseDate, price, orderId } = state || {};

  return (
    <div className="flex flex-col text-white mb-32 px-6 min-h-screen">
      <TopTitle title={t("asset_page.detail")} back={true} />

      {/* 상단 아이콘 + 아이템 이름 */}
      <div>
        {/* 예: 이미지가 Auto Item인지 여부에 따라 다른 아이콘 */}
        {/* 실제 코드에서는 Images.AutoNFT, Images.RewardNFT 등을 활용 */}
        <img
          src={"Auto Item" === itemName ? Images.AutoNFT : Images.RewardNFT}
          alt={itemName}
          className="w-24 h-24 mx-auto mb-4"
        />
        <p className="text-center text-xl font-semibold">{itemName}</p>
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
