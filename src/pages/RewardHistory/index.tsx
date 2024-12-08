import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronDown } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const RewardHistory: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // 더미 데이터
    const rewardHistory = [
        { id: 1, description: "Joined Telegram", date: "17-10-2024", points: "+150SL" },
        { id: 2, description: "AI Dental Examination", date: "17-10-2024", points: "-150SL" },
        { id: 3, description: "Subscribe to Email", date: "17-10-2024", points: "+150SL" },
        { id: 4, description: "Game Win", date: "17-10-2024", points: "+150P" },
        { id: 5, description: "Game Lose", date: "17-10-2024", points: "-150P" },
    ];

    // 상태
    const [transactionFilter, setTransactionFilter] = useState("all"); // all, earned, used
    const [typeFilter, setTypeFilter] = useState("all"); // all, SL, P

    // 필터링된 데이터
    const filteredHistory = rewardHistory.filter((reward) => {
        // 거래 유형 필터
        if (transactionFilter === "earned" && !reward.points.startsWith("+")) return false;
        if (transactionFilter === "used" && !reward.points.startsWith("-")) return false;

        // 재화 유형 필터
        if (typeFilter !== "all" && !reward.points.endsWith(typeFilter)) return false;

        return true;
    });

    return (
        <div className="flex flex-col text-white mb-32 mx-6 min-h-screen">
            <div className="flex items-center w-full mt-3 mb-2 relative">
                {/* 뒤로가기 버튼 */}
                <FaChevronLeft
                    className="text-xl cursor-pointer"
                    onClick={() => navigate(-1)}
                />
                <h1 className="text-xl font-bold flex-grow text-center">{t("asset_page.Rewards_History")}</h1>
                <div className="w-5"></div>
            </div>
            
            {/* 필터링 버튼 */}
            <div className="flex justify-start w-full mt-8 h-11 gap-4">
                {/* 수익/지출 필터 */}
                <div className="relative w-40 max-w-xs">
                    <select
                        className={`px-6 py-2 rounded-full appearance-none w-full text-sm ${
                            transactionFilter === "all"
                                ? "bg-[#1F1E27] text-white"
                                : "bg-white text-black"
                        }`}
                        value={transactionFilter}
                        onChange={(e) => setTransactionFilter(e.target.value)}
                        >
                        <option value="all">{t("asset_page.all_transaction")}</option>
                        <option value="earned">{t("asset_page.earned")}</option>
                        <option value="used">{t("asset_page.used")}</option>
                    </select>
                    <FaChevronDown
                        className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                            transactionFilter === "all" ? "text-white" : "text-black"
                        }`}
                    />
                </div>

                {/* 재화 유형 필터 */}
                <div className="relative w-32 max-w-xs">
                    <select
                         className={`px-6 py-2 rounded-full appearance-none w-full text-sm ${
                            typeFilter === "all"
                                ? "bg-[#1F1E27] text-white"
                                : "bg-white text-black"
                        }`}
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="all">{t("asset_page.all_type")}</option>
                        <option value="SL">{t("asset_page.sl")}</option>
                        <option value="P">{t("asset_page.point")}</option>
                    </select>
                    <FaChevronDown
                        className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                            transactionFilter === "all" ? "text-white" : "text-black"
                        }`}
                    />
                </div>
            </div>

            {/* 보상 내역 */}
            <div className="w-full mt-6">
                <div>
                    {filteredHistory.length > 0 ? (
                        filteredHistory.map((reward) => (
                            <div
                                key={reward.id}
                                className="flex justify-between items-center py-2 border-b border-[#35383F]"
                            >
                                <div>
                                    <p className="text-sm font-medium">{reward.description}</p>
                                    <p className="text-xs text-gray-400">{reward.date}</p>
                                </div>
                                <p
                                    className={`text-sm font-bold ${
                                        reward.points.startsWith("+") ? "text-blue-400" : "text-red-400"
                                    }`}
                                >
                                    {reward.points}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-sm text-gray-400">No records found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RewardHistory;
