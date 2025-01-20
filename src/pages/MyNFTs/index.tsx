import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TopTitle } from "@/shared/components/ui";
import Images from "@/shared/assets/images";
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";

interface NftCategoryProps {
  title: string;
  count: number;
  nfts: { id: number; name: string; image: string }[];
  onShopClick: () => void; // NFT 구매 버튼 클릭 핸들러
}

const NftCategory: React.FC<NftCategoryProps> = ({ title, count, nfts, onShopClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { playSfx } = useSound();

  // NFT 카테고리별 이미지
  const categoryImages: { [key: string]: string } = {
    "Gold NFT": Images.Gold,
    "Silver NFT": Images.Silver,
    "Bronze NFT": Images.Bronze,
    "Reward Booster": Images.RewardNFT,
    "Auto Item": Images.AutoNFT,
  };

  return (
    <div className="mb-8">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => {
          playSfx(Audios.button_click);
          setIsOpen(!isOpen);
        }}>
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

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden mt-4"
      >
        {nfts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {nfts.map((nft) => (
              <div
                key={nft.id}
                className="bg-[#1F1E27] border border-[#737373] p-[10px] rounded-xl flex flex-col items-center"
              >
                {/* 비율을 유지하며 크기가 리니어하게 바뀌도록 설정 */}
                <div className="w-full aspect-[145/154] rounded-md mt-1 mx-1 overflow-hidden">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-2 font-bold">{nft.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-10 mb-">
            <p className="text-base font-semibold text-[#737373]">No NFTs in this category</p>
            <div className="mt-6 text-center mb-16">
              <button
                className="bg-[#0147E5] text-white text-base w-[165px] h-14 font-medium px-6 py-3 rounded-full"
                onClick={onShopClick}
              >
                Shop NFT
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const MyNfts: React.FC = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false); // showModal 상태 선언
  const { playSfx } = useSound();

  // 더미 데이터
  const nftData = [
    {
      category: "Gold NFT",
      count: 2,
      nfts: [
        { id: 1, name: "Cool Cat #1", image: "https://via.placeholder.com/150" },
        { id: 2, name: "Cool Cat #2", image: "https://via.placeholder.com/150" },
      ],
    },
    {
      category: "Silver NFT",
      count: 2,
      nfts: [
        { id: 3, name: "Silver Cat #1", image: "https://via.placeholder.com/150" },
        { id: 4, name: "Silver Cat #2", image: "https://via.placeholder.com/150" },
      ],
    },
    { category: "Bronze NFT", count: 0, nfts: [] },
    {
      category: "Reward Booster",
      count: 1,
      nfts: [{ id: 5, name: "Reward Cat", image: "https://via.placeholder.com/150" }],
    },
    {
      category: "Auto Item",
      count: 1,
      nfts: [{ id: 6, name: "Auto Cat", image: "https://via.placeholder.com/150" }],
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
            onShopClick={() => {
              playSfx(Audios.button_click);
              setShowModal(true);
            }} // Shop 버튼 클릭 시 모달 표시
          />
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full">
          <div className="bg-white text-black p-6 rounded-lg text-center w-[70%] max-w-[550px]">
            <p>We're preparing for the service.</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={() => {
                playSfx(Audios.button_click);
                setShowModal(false);
              }}>
              {t("OK")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyNfts;
