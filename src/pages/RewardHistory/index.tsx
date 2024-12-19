import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { TopTitle } from "@/shared/components/ui";

const RewardHistory: React.FC = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

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
        <div className="flex flex-col text-white mb-32 px-6 min-h-screen">
            <TopTitle title={t("asset_page.Rewards_History")} back={true} />

            {/* 드롭다운 필터로 수정 중 */}
            <div>
                <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex items-center">
                        <p className="text-lg font-semibold">Filter Option</p>
                    </div>
                    {isOpen ? <FaChevronUp className="text-lg" /> : <FaChevronDown className="text-lg" />}
                </div>

                {/* 애니메이션이 적용된 영역 */}
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <div className="mt-4">
                        {/* 날짜 범위 선정 */}
                        <div className="flex items-center gap-4 mt-4">
                            {/* Start Date Picker */}
                            <div className="w-full">
                                <label className="block text-sm mb-1">Start Date</label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    placeholderText="Select Start Date"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
                                    dateFormat="yyyy-MM-dd"
                                />
                            </div>

                            {/* End Date Picker */}
                            <div className="w-full">
                                <label className="block text-sm mb-1">End Date</label>
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    placeholderText="Select End Date"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
                                    dateFormat="yyyy-MM-dd"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* 보상 내역 */}
            <div className="w-full mt-3">
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
