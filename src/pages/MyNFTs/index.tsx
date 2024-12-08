import React from 'react';
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const MyNfts: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const nftCollection = [
        { id: 1, name: "Cool Cat #1", image: "https://via.placeholder.com/100" },
        { id: 2, name: "Cool Cat #1", image: "https://via.placeholder.com/100" },
        { id: 3, name: "Cool Cat #1", image: "https://via.placeholder.com/100" },
        { id: 4, name: "Cool Cat #1", image: "https://via.placeholder.com/100" },
        // { id: 5, name: "Cool Cat #1", image: "https://via.placeholder.com/100" },
        // { id: 6, name: "Cool Cat #1", image: "https://via.placeholder.com/100" },
        // { id: 7, name: "Cool Cat #1", image: "https://via.placeholder.com/100" },
        // { id: 8, name: "Cool Cat #1", image: "https://via.placeholder.com/100" },
      ];

    return (
        <div className="flex flex-col text-white mb-2  mx-6 min-h-screen">
            <div className="flex items-center w-full mt-3 mb-8 relative">
                {/* 뒤로가기 버튼 */}
                <FaChevronLeft
                    className="text-xl cursor-pointer"
                    onClick={() => navigate(-1)}
                />
                <h1 className="text-xl font-bold flex-grow text-center">{t("asset_page.My_NFT_Collection")}</h1>
                <div className="w-5"></div>
            </div>

            {/* NFT 컬렉션 */}
            <div className="grid grid-cols-2 gap-4 mt-4 w-full mb-6">
                {nftCollection.map((nft) => (
                    <div
                        key={nft.id}
                        className="bg-[#1F1E27] border border-[#737373] p-[10px] rounded-xl flex flex-col items-center"
                        style={{ maxHeight: '320px' }}
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
        </div>
    );
};

export default MyNfts;