import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { TopTitle } from "@/shared/components/ui";

const FriendRewards: React.FC = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    // 필터 상태
    const [selectedAssets, setSelectedAssets] = useState<string[]>(["SL"]);
    const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가

    // 더미 데이터
    const rewardHistory = [
        { id: 1, description: "Joined Telegram", date: "2024-12-01", points: "+150SL", from: "James" },
        { id: 2, description: "AI Dental Examination", date: "2024-12-05", points: "+200SL", from: "Oscar" },
        { id: 3, description: "Subscribe to Email", date: "2024-12-10", points: "+150SL", from: "James" },
        { id: 4, description: "Game Win", date: "2024-12-20", points: "+150P", from: "Ramos" },
        { id: 5, description: "Game Lose", date: "2024-12-25", points: "+150P", from: "Ruel" },
    ];

    const handleAssetChange = (asset: string) => {
        setSelectedAssets((prev) =>
            prev.includes(asset) ? prev.filter((a) => a !== asset) : [...prev, asset]
        );
    };

    const isWithinDateRange = (rewardDate: string) => {
        const date = new Date(rewardDate);
        if (startDate && date < startDate) return false;
        if (endDate && date > endDate) return false;
        return true;
    };

    // 필터링된 데이터
    const filteredHistory = rewardHistory.filter((reward) => {
        const assetType = reward.points.replace(/^[+-]?\d+/, "").trim();
        const assetIncluded = selectedAssets.length === 0 || selectedAssets.includes(assetType);
        const dateIncluded = isWithinDateRange(reward.date);
        const searchIncluded = reward.from.toLowerCase().includes(searchTerm.toLowerCase()); // 검색어 필터링
        return assetIncluded && dateIncluded && searchIncluded;
    });

    const CustomDateInput = React.forwardRef<HTMLInputElement, any>(
        ({ value, onClick, placeholder }, ref) => (
            <div
                className="flex items-center w-full px-4 py-2 bg-gray-800 text-white rounded-lg cursor-pointer focus:ring focus:ring-blue-500"
                onClick={onClick}
            >
                <input
                    ref={ref}
                    value={value}
                    readOnly
                    placeholder={placeholder}
                    className="bg-transparent outline-none w-full text-white"
                />
                <FaCalendarAlt className="text-white ml-2" />
            </div>
        )
    );
    CustomDateInput.displayName = "CustomDateInput";

    return (
        <div className="flex flex-col text-white mb-32 px-6 min-h-screen">
            <TopTitle title="Friend Referral Rewards" back={true} />

            {/* 드롭다운 필터 */}
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

                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <div className="mt-4 mx-3">
                        {/* 친구 이름 검색 */}
                        <p className="text-lg font-medium text-left mb-2">Search Friend</p>
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search Name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-14 px-4 py-2 pr-10 bg-gray-800 text-white text-center rounded-full focus:outline-none focus:ring focus:ring-blue-500 mb-4"
                            />
                            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>


                        {/* 자산 종류 필터 */}
                        <p className="text-lg font-medium text-left mb-2">Asset Types</p>
                        <div className="flex flex-col gap-2 ml-3">
                            {["USDC", "SL", "Point"].map((asset) => (
                                <label key={asset} className="flex items-center text-base font-medium">
                                    <input
                                        type="checkbox"
                                        checked={selectedAssets.includes(asset)}
                                        onChange={() => handleAssetChange(asset)}
                                        className="mr-2"
                                    />
                                    {asset}
                                </label>
                            ))}
                        </div>

                        {/* 날짜 범위 선정 */}
                        <p className="text-lg font-medium text-left mt-4">Date Ranges</p>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="w-full">
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => {
                                        setStartDate(date);
                                        if (endDate && date && date > endDate) {
                                            setEndDate(null);
                                        }
                                    }}
                                    placeholderText="Start Date"
                                    customInput={<CustomDateInput placeholder="Start Date" />}
                                    dateFormat="yyyy-MM-dd"
                                    maxDate={endDate || undefined}
                                />
                            </div>
                            <div className="w-full">
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    placeholderText="End Date"
                                    customInput={<CustomDateInput placeholder="End Date" />}
                                    dateFormat="yyyy-MM-dd"
                                    minDate={startDate || undefined}
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
                                    <p className="text-sm font-medium">{reward.from}</p>
                                    <p className="text-xs text-gray-400">{reward.date}</p>
                                </div>
                                <p className="text-sm font-bold text-blue-400">{reward.points}</p>
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

export default FriendRewards;
