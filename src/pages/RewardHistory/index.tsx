import React, { useState, useEffect } from "react";
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

// ★ API 호출 함수
import getRewardsHistory from "@/entities/Asset/api/getRewardsHistory";
import { format } from "date-fns";

const RewardHistory: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { playSfx } = useSound();

  // 필터 드롭다운 열림 상태
  const [isOpen, setIsOpen] = useState(false);

  // 자산 종류: 하나만 선택. 기본값 "SL"
  // (STAR → POINT로 표시하지만, 내부적으로는 STAR를 서버로 보냄)
  const [selectedAsset, setSelectedAsset] = useState<string>("SL");

  // 증감 필터: 하나만 선택. 기본값 "INCREASE"
  // ("INCREASE" → 서버에는 "REWARD", "DECREASE" → "USE")
  const [selectedChange, setSelectedChange] = useState<string>("INCREASE");

  // 날짜 필터
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // 서버에서 받아온 보상 내역
  const [rewardHistory, setRewardHistory] = useState<any[]>([]);
  // 페이지네이션
  const [pageNumber, setPageNumber] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  // 컴포넌트 마운트 시 0페이지 호출
  useEffect(() => {
    fetchRewards(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 서버 API 호출
  const fetchRewards = async (page: number, replace = false) => {
    try {
      // 자산 필터 매핑
      // 단일만 선택되므로 그대로 selectedAsset 사용
      // 예: SL, USDC, STAR
      const assetTypeForApi = selectedAsset;

      // 증감 필터 매핑
      // INCREASE → REWARD, DECREASE → USE
      // (두 개 모두 보여주는 "전체" 개념이 없다면, 그대로 단일값)
      let changeTypeForApi: string | null = null;
      if (selectedChange === "INCREASE") {
        changeTypeForApi = "REWARD";
      } else if (selectedChange === "DECREASE") {
        changeTypeForApi = "USE";
      }

      // 날짜 필터(YYYY-MM-DD)
      const startDateStr = startDate ? format(startDate, "yyyy-MM-dd") : null;
      const endDateStr = endDate ? format(endDate, "yyyy-MM-dd") : null;

      const data = await getRewardsHistory(
        assetTypeForApi,
        changeTypeForApi,
        startDateStr,
        endDateStr,
        page
      );

      const newList = data.content || [];
      const currentPage = data.number ?? page;
      const last = data.last ?? true;

      setRewardHistory((prev) => (replace ? newList : [...prev, ...newList]));
      setPageNumber(currentPage);
      setIsLastPage(last);
    } catch (error) {
      console.error("Failed to fetch reward history:", error);
    }
  };

  // 자산 선택(라디오 버튼)
  const handleAssetChange = (asset: string) => {
    playSfx(Audios.button_click);
    setSelectedAsset(asset);
    // 선택 즉시 서버 재조회
    fetchRewards(0, true);
  };

  // 증감 선택(라디오 버튼)
  const handleChangeType = (change: string) => {
    playSfx(Audios.button_click);
    setSelectedChange(change);
    // 선택 즉시 서버 재조회
    fetchRewards(0, true);
  };

  // 날짜 선택 시 즉시 재조회
  const handleStartDateChange = (date: Date | null) => {
    playSfx(Audios.button_click);
    setStartDate(date);

    if (endDate && date && date > endDate) {
      setEndDate(null);
    }
    fetchRewards(0, true);
  };

  const handleEndDateChange = (date: Date | null) => {
    playSfx(Audios.button_click);
    setEndDate(date);
    fetchRewards(0, true);
  };

  // "더보기" 버튼 클릭 → 다음 페이지
  const handleLoadMore = () => {
    playSfx(Audios.button_click);
    fetchRewards(pageNumber + 1, false);
  };

  // STAR -> POINT, REWARD -> INCREASE, USE -> DECREASE 변환해서 표시
  const displayHistory = rewardHistory.map((reward) => {
    const displayAsset = reward.currencyType === "STAR" ? "POINT" : reward.currencyType;
    const displayChangeType =
      reward.changeType === "REWARD" ? "INCREASE" : "DECREASE";
    return {
      ...reward,
      displayAsset,
      displayChangeType,
    };
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

      {/* 필터 드롭다운 */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => {
            playSfx(Audios.button_click);
            setIsOpen(!isOpen);
          }}
        >
          <div className="flex items-center">
            <p className="text-lg font-semibold">Filter Option</p>
          </div>
          {isOpen ? <FaCaretUp className="w-4 h-4" /> : <FaCaretDown className="w-4 h-4" />}
        </div>

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="mt-4 mx-3">
            {/* 자산 종류 (단일 선택) */}
            <p className="text-lg font-medium text-left mb-2">Asset Types</p>
            <div className="flex flex-col gap-2 ml-3">
              {["SL", "USDC", "STAR"].map((asset) => (
                <label key={asset} className="flex items-center text-base font-medium">
                  <input
                    type="radio"
                    name="assetType"
                    value={asset}
                    checked={selectedAsset === asset}
                    onChange={() => handleAssetChange(asset)}
                    className="mr-2"
                  />
                  {/* 표시 시 STAR → POINT */}
                  {asset === "STAR" ? "POINT" : asset}
                </label>
              ))}
            </div>

            {/* 증감 필터 (단일 선택) */}
            <p className="text-lg font-medium text-left mt-4 mb-2">Change Types</p>
            <div className="flex flex-col gap-2 ml-3">
              {["INCREASE", "DECREASE"].map((change) => (
                <label key={change} className="flex items-center text-base font-medium">
                  <input
                    type="radio"
                    name="changeType"
                    value={change}
                    checked={selectedChange === change}
                    onChange={() => handleChangeType(change)}
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
                  onChange={handleStartDateChange}
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
                  onChange={handleEndDateChange}
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

      {/* 보상 내역 리스트 */}
      <div className="w-full mt-3">
        <div>
          {displayHistory.length > 0 ? (
            displayHistory.map((reward, index) => (
              <div
                key={`${reward.loggedAt}-${index}`}
                className="flex justify-between items-center py-4 border-b border-[#35383F]"
              >
                <div>
                  <p className="text-sm font-medium">{reward.content}</p>
                  <p className="text-xs text-gray-400">{reward.loggedAt}</p>
                </div>
                <div className="flex flex-col items-end">
                  {/* 예: +100 POINT / -100 POINT 표시 */}
                  <p
                    className={`text-sm font-bold ${
                      reward.displayChangeType === "INCREASE"
                        ? "text-[#3B82F6]"
                        : "text-[#DD2726]"
                    }`}
                  >
                    {reward.displayChangeType === "INCREASE" ? "+" : "-"}
                    {reward.amount} {reward.displayAsset}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-gray-400">No records found</p>
          )}

          {/* 예시: 레퍼럴 보상 내역(요약본) */}
          <div
            className="flex justify-between items-center py-4 border-b border-[#35383F]"
            onClick={() => {
              playSfx(Audios.button_click);
              navigate("/referral-rewards");
            }}
          >
            <div>
              <p className="text-sm font-medium">Friend Referral Rewards</p>
              <p className="text-xs text-gray-400">17-12-2024</p>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <p className="text-sm font-bold text-[#3B82F6]">+150 POINT</p>
              <FaChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* 더보기 버튼 */}
          {!isLastPage && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 bg-[#3B82F6]rounded-md text-white font-semibold hover:bg-blue-600"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardHistory;
