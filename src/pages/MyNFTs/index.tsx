import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { TopTitle } from "@/shared/components/ui";
import Images from "@/shared/assets/images";

interface NftCategoryProps {
  title: string;
  count: number;
  nfts: { id: number; name: string; image: string; level: number }[];
  onShopClick: () => void; // NFT 구매 버튼 클릭 핸들러
}

const NftCategory: React.FC<NftCategoryProps> = ({ title, count, nfts, onShopClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const categoryImages: { [key: string]: string } = {
    "Gold NFT": Images.Gold,
    "Silver NFT": Images.Silver,
    "Bronze NFT": Images.Bronze,
    "Reward NFT": Images.RewardNFT,
    "Auto NFT": Images.AutoNFT,
  };

  return (
    <div className="mb-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <img
            src={categoryImages[title]}
            alt={title}
            className="w-6 h-6 mr-2 object-contain"
          />
          <p className="text-lg font-semibold">{`${title} (${count})`}</p>
        </div>
        {isOpen ? <FaChevronUp className="text-lg" /> : <FaChevronDown className="text-lg" />}
      </div>

      {isOpen && (
        <div className="mt-2">
          {nfts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {nfts.map((nft) => (
                <div key={nft.id} className="flex flex-col items-center rounded-lg bg-gray-800 p-3">
                  <img src={nft.image} alt={nft.name} className="w-20 h-20 object-contain" />
                  <p className="mt-2 text-sm font-semibold">{nft.name}</p>
                  <p className="text-xs text-gray-400">{`Lv.${nft.level}`}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-8">
              <p className="text-base font-semibold text-[#737373]">
                No NFTs in this category
              </p>
              <div className="mt-6 text-center mb-8">
                <button
                    className="bg-[#0147E5] text-white text-base font-medium px-6 py-3 rounded-full"
                    onClick={onShopClick}
                    >
                    Shop NFT
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MyNfts: React.FC = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false); // showModal 상태 선언

  const nftData = [
    {
      category: "Gold NFT",
      count: 2,
      nfts: [
        { id: 1, name: "Cool Cat #1", image: "https://via.placeholder.com/150", level: 18 },
        { id: 2, name: "Cool Cat #2", image: "https://via.placeholder.com/150", level: 18 },
      ],
    },
    {
      category: "Silver NFT",
      count: 2,
      nfts: [
        { id: 3, name: "Silver Cat #1", image: "https://via.placeholder.com/150", level: 15 },
        { id: 4, name: "Silver Cat #2", image: "https://via.placeholder.com/150", level: 12 },
      ],
    },
    { category: "Bronze NFT", count: 0, nfts: [] },
    {
      category: "Reward NFT",
      count: 1,
      nfts: [{ id: 5, name: "Reward Cat", image: "https://via.placeholder.com/150", level: 20 }],
    },
    {
      category: "Auto NFT",
      count: 1,
      nfts: [{ id: 6, name: "Auto Cat", image: "https://via.placeholder.com/150", level: 10 }],
    },
  ];

  return (
    <div className="flex flex-col text-white mb-2 px-6 min-h-screen">
      <TopTitle title={t("asset_page.My_NFT_Collection")} back={true} />

      <div className="mt-6">
        {nftData.map((category) => (
          <NftCategory
            key={category.category}
            title={category.category}
            count={category.count}
            nfts={category.nfts}
            onShopClick={() => setShowModal(true)} // Shop 버튼 클릭 시 모달 표시
          />
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full">
          <div className="bg-white text-black p-6 rounded-lg text-center w-[70%] max-w-[550px]">
            <p>We're preparing for the service.</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={() => setShowModal(false)}
            >
              {t("OK")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyNfts;
