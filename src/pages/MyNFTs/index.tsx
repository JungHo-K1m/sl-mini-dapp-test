import React, { useState } from "react";
import { FaChevronLeft, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { TopTitle } from "@/shared/components/ui";

interface NftCategoryProps {
  title: string;
  count: number;
  nfts: { id: number; name: string; image: string; level: number }[];
}

const NftCategory: React.FC<NftCategoryProps> = ({ title, count, nfts }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      {/* 카테고리 헤더 */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <p className="text-lg font-semibold">{`${title} (${count})`}</p>
        </div>
        {isOpen ? (
          <FaChevronUp className="text-lg" />
        ) : (
          <FaChevronDown className="text-lg" />
        )}
      </div>

      {/* NFT 리스트 */}
      {isOpen && (
        <div className="mt-2">
          {nfts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {nfts.map((nft) => (
                <div
                  key={nft.id}
                  className="flex flex-col items-center rounded-lg bg-gray-800 p-3"
                >
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-20 h-20 object-contain"
                  />
                  <p className="mt-2 text-sm font-semibold">{nft.name}</p>
                  <p className="text-xs text-gray-400">{`Lv.${nft.level}`}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 mt-2">
              No NFTs in this category
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const MyNfts: React.FC = () => {
  const { t } = useTranslation();

  // NFT 데이터 (예시 데이터)
  const nftData = [
    {
      category: "Gold NFT",
      count: 2,
      nfts: [
        {
          id: 1,
          name: "Cool Cat #1",
          image: "https://via.placeholder.com/150",
          level: 18,
        },
        {
          id: 2,
          name: "Cool Cat #2",
          image: "https://via.placeholder.com/150",
          level: 18,
        },
      ],
    },
    {
      category: "Silver NFT",
      count: 2,
      nfts: [
        {
          id: 3,
          name: "Silver Cat #1",
          image: "https://via.placeholder.com/150",
          level: 15,
        },
        {
          id: 4,
          name: "Silver Cat #2",
          image: "https://via.placeholder.com/150",
          level: 12,
        },
      ],
    },
    {
      category: "Bronze NFT",
      count: 0,
      nfts: [],
    },
    {
      category: "Reward NFT",
      count: 1,
      nfts: [
        {
          id: 5,
          name: "Reward Cat",
          image: "https://via.placeholder.com/150",
          level: 20,
        },
      ],
    },
    {
      category: "Auto NFT",
      count: 1,
      nfts: [
        {
          id: 6,
          name: "Auto Cat",
          image: "https://via.placeholder.com/150",
          level: 10,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col text-white mb-2 px-6 min-h-screen">
      <TopTitle title={t("asset_page.My_NFT_Collection")} back={true} />

      {/* NFT 카테고리 */}
      <div className="mt-6">
        {nftData.map((category) => (
          <NftCategory
            key={category.category}
            title={category.category}
            count={category.count}
            nfts={category.nfts}
          />
        ))}
      </div>

      {/* Shop NFT 버튼 */}
      <div className="mt-6 text-center">
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg">
          Shop NFT
        </button>
      </div>
    </div>
  );
};

export default MyNfts;
