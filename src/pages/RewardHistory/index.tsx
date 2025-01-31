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

  // 자산 종류(단일 선택)
  const [selectedAsset, setSelectedAsset] = useState<string>("SL");
  // 증감 필터(단일 선택)
  const [selectedChange, setSelectedChange] = useState<string>("INCREASE");

  // 날짜 필터
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // 서버 응답 데이터
  const [rewardHistory, setRewardHistory] = useState<any[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  // ★ useEffect로 필터 상태가 변할 때마다 페이지 0부터 재조회
  useEffect(() => {
    fetchRewards(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsset, selectedChange, startDate, endDate]);

  // 컴포넌트 첫 렌더링 시에도 0페이지 불러오지만,
  // 위 useEffect가 이미 [selectedAsset, ...] 의존성으로 포함하므로
  // 초기 상태에서도 자동 실행된다.
  // 만약 처음 마운트 시점에만 1회 호출하고 싶다면 의존성 배열을 []로 두거나 별도 처리 필요.
  // 여기선 "마운트 시점 + 필터 변경 시점" 모두 호출이므로 아래 useEffect는 생략 가능할 수도 있음.
  useEffect(() => {
    fetchRewards(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // API 호출
  const fetchRewards = async (page: number, replace = false) => {
    try {
      // 필터 값 매핑
      const assetTypeForApi = selectedAsset; // SL, USDC, STAR
      let changeTypeForApi: string | null = null;
      if (selectedChange === "INCREASE") {
        changeTypeForApi = "REWARD";
      } else if (selectedChange === "DECREASE") {
        changeTypeForApi = "USE";
      }

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

  // 자산 라디오 버튼
  const handleAssetChange = (asset: string) => {
    playSfx(Audios.button_click);
    // ★ fetchRewards 직접 호출하지 않음
    setSelectedAsset(asset);
  };

  // 증감 라디오 버튼
  const handleChangeType = (change: string) => {
    playSfx(Audios.button_click);
    // ★ fetchRewards 직접 호출하지 않음
    setSelectedChange(change);
  };

  // 날짜 선택
  const handleStartDateChange = (date: Date | null) => {
    playSfx(Audios.button_click);
    setStartDate(date);

    if (endDate && date && date > endDate) {
      setEndDate(null);
    }
    // ★ fetchRewards 직접 호출하지 않음
  };

  const handleEndDateChange = (date: Date | null) => {
    playSfx(Audios.button_click);
    setEndDate(date);
    // ★ fetchRewards 직접 호출하지 않음
  };

  // 더보기 버튼
  const handleLoadMore = () => {
    playSfx(Audios.button_click);
    fetchRewards(pageNumber + 1, false);
  };

  // 표시용 변환( STAR→POINT, REWARD→INCREASE, USE→DECREASE )
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

          {/* (예시) 레퍼럴 보상 내역(요약본) */}
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
