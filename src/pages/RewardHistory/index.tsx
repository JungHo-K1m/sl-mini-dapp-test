import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronRight, FaCaretDown, FaCaretUp } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { TopTitle } from "@/shared/components/ui";
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";


const RewardHistory: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { playSfx } = useSound();
    const [isOpen, setIsOpen] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    // 필터 상태
    const [selectedAssets, setSelectedAssets] = useState<string[]>(["SL"]);
    const [selectedChanges, setSelectedChanges] = useState<string[]>(["Increase"]);

     // 더미 데이터
     const rewardHistory = [
        { id: 1, description: "Joined Telegram", date: "2024-12-01", points: "+150SL" },
        { id: 2, description: "AI Dental Examination", date: "2024-12-05", points: "-150SL" },
        { id: 3, description: "Subscribe to Email", date: "2024-12-10", points: "+150SL" },
        { id: 4, description: "Game Win", date: "2024-12-20", points: "+150P" },
        { id: 5, description: "Game Lose", date: "2024-12-25", points: "-150P" },
    ];

    // 체크박스 필터 핸들러
    const handleAssetChange = (asset: string) => {
        setSelectedAssets((prev) =>
            prev.includes(asset) ? prev.filter((a) => a !== asset) : [...prev, asset]
        );
    };

    const handleChangeType = (change: string) => {
        setSelectedChanges((prev) =>
            prev.includes(change) ? prev.filter((c) => c !== change) : [...prev, change]
        );
    };

    // 날짜 필터 함수
    const isWithinDateRange = (rewardDate: string) => {
        const date = new Date(rewardDate);
        if (startDate && date < startDate) return false; // Start Date보다 이전 날짜 제외
        if (endDate && date > endDate) return false; // End Date보다 이후 날짜 제외
        return true;
    };

    // 필터링된 데이터
    const filteredHistory = rewardHistory.filter((reward) => {
        // 포인트에서 숫자와 자산명을 분리
        const assetType = reward.points.match(/[a-zA-Z]+/)?.[0] || ""; // 자산명만 추출

        // 필터 로직에 로그 추가
        console.log("Filtering reward:", reward);
        console.log("Extracted asset type:", assetType);
        console.log("Selected assets:", selectedAssets);

        // 자산 필터 (선택된 항목이 없으면 모든 데이터 포함)
        const assetIncluded =
            selectedAssets.length === 0 || selectedAssets.includes(assetType);
        console.log("Asset included:", assetIncluded);

        // 증감 필터 (선택된 항목이 없으면 모든 데이터 포함)
        const changeIncluded =
            selectedChanges.length === 0 ||
            (selectedChanges.includes("Increase") && reward.points.startsWith("+")) ||
            (selectedChanges.includes("Decrease") && reward.points.startsWith("-"));
        console.log("Change included:", changeIncluded);

        // 날짜 필터
        const dateIncluded = isWithinDateRange(reward.date);
        console.log("Date included:", dateIncluded);

        const result = assetIncluded && changeIncluded && dateIncluded;
        console.log("Filter result for this reward:", result);

        // 모든 조건이 true일 때 데이터 포함
        return result;
    });


    
    

    // DatePicker용 Custom Input
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
            <TopTitle title={t("asset_page.Rewards_History")} back={true} />

            {/* 드롭다운 필터로 수정 중 */}
            <div>
                <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => {
                        playSfx(Audios.button_click);
                        setIsOpen(!isOpen);
                    }}>
                    <div className="flex items-center">
                        <p className="text-lg font-semibold">Filter Option</p>
                    </div>
                    {isOpen ? <FaCaretUp className="w-4 h-4" /> : <FaCaretDown className="w-4 h-4" />}
                </div>

                {/* 애니메이션이 적용된 영역 */}
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <div className="mt-4 mx-3">
                        {/* 자산 종류 필터 */}
                        <p className="text-lg font-medium text-left mb-2">Asset Types</p>
                        <div className="flex flex-col gap-2 ml-3">
                            {["USDC", "SL", "Point"].map((asset) => (
                                <label key={asset} className="flex items-center text-base font-medium">
                                    <input
                                        type="checkbox"
                                        checked={selectedAssets.includes(asset)}
                                        onChange={() => {
                                            playSfx(Audios.button_click);
                                            handleAssetChange(asset);
                                        }}
                                        className="mr-2"
                                    />
                                    {asset}
                                </label>
                            ))}
                        </div>

                        {/* 증감 필터 */}
                        <p className="text-lg font-medium text-left mt-4 mb-2">Change Types</p>
                        <div className="flex flex-col gap-2 ml-3">
                            {["Increase", "Decrease"].map((change) => (
                                <label key={change} className="flex items-center text-base font-medium">
                                    <input
                                        type="checkbox"
                                        checked={selectedChanges.includes(change)}
                                        onChange={() => {
                                            playSfx(Audios.button_click);
                                            handleChangeType(change);
                                        }}
                                        className="mr-2"
                                    />
                                    {change}
                                </label>
                            ))}
                        </div>

                        {/* 날짜 범위 선정 */}
                        <p className="text-lg font-medium text-left mt-4">Date Ranges</p>
                        <div className="flex items-center gap-4 mt-4">
                            {/* Start Date Picker */}
                            <div className="w-full">
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => {
                                        playSfx(Audios.button_click);
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

                            {/* End Date Picker */}
                            <div className="w-full">
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => {
                                        playSfx(Audios.button_click);
                                        setEndDate(date);
                                    }}
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
                                className="flex justify-between items-center py-4 border-b border-[#35383F]"
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
                    {/* 레퍼럴 보상 내역(요약본) */}
                    <div 
                        className="flex justify-between items-center py-4 border-b border-[#35383F]"
                        onClick={() => {
                            playSfx(Audios.button_click);
                            navigate("/referral-rewards");
                        }}>
                        <div>
                            <p className="text-sm font-medium">Friend Referral Rewards</p>
                            <p className="text-xs text-gray-400">17-12-2024</p>
                        </div>
                        <div className="flex items-center gap-3 ml-auto">
                            <p className="text-sm font-bold text-blue-400">+150P..</p>
                            <FaChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RewardHistory;
