import React, { useState, useRef } from "react";
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

// 더미 데이터를 페이지 단위로 저장한 예시
// 실제로는 API 호출 시 현재 pageNumber로 다음 페이지를 요청하여 받게 됩니다.
const dummyPages = [
  {
    pageNumber: 0,
    content: [
      {
        content: "RPS Game Betting",
        changeType: "USE",
        amount: 100.0,
        currencyType: "STAR",
        loggedAt: "2025-01-30",
      },
      {
        content: "RPS Game Win",
        changeType: "REWARD",
        amount: 200.0,
        currencyType: "STAR",
        loggedAt: "2025-01-30",
      },
      {
        content: "RPS Game Betting",
        changeType: "USE",
        amount: 100.0,
        currencyType: "STAR",
        loggedAt: "2025-01-30",
      },
      {
        content: "RPS Game Betting",
        changeType: "USE",
        amount: 100.0,
        currencyType: "STAR",
        loggedAt: "2025-01-30",
      },
      {
        content: "RPS Game Betting",
        changeType: "USE",
        amount: 100.0,
        currencyType: "STAR",
        loggedAt: "2025-01-30",
      },
      {
        content: "RPS Game Betting",
        changeType: "USE",
        amount: 100.0,
        currencyType: "STAR",
        loggedAt: "2025-01-30",
      },
      {
        content: "RPS Game Betting",
        changeType: "USE",
        amount: 100.0,
        currencyType: "STAR",
        loggedAt: "2025-01-30",
      },
      {
        content: "RPS Game Betting",
        changeType: "USE",
        amount: 100.0,
        currencyType: "STAR",
        loggedAt: "2025-01-30",
      },
      {
        content: "RPS Game Betting",
        changeType: "USE",
        amount: 100.0,
        currencyType: "STAR",
        loggedAt: "2025-01-30",
      },
      {
        content: "RPS Game Betting",
        changeType: "USE",
        amount: 100.0,
        currencyType: "STAR",
        loggedAt: "2025-01-30",
      },
    ],
  },
  {
    pageNumber: 1,
    content: [
      {
        content: "RPS Game Lose",
        changeType: "USE",
        amount: 150.0,
        currencyType: "STAR",
        loggedAt: "2025-01-29",
      },
      {
        content: "RPS Game Win",
        changeType: "REWARD",
        amount: 300.0,
        currencyType: "STAR",
        loggedAt: "2025-01-29",
      },
    ],
  },
];

const RewardHistory: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { playSfx } = useSound();

  // 필터 영역
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // 자산 종류 필터 (최소 1개는 무조건 체크되어 있어야 함)
  // 여기서 STAR는 실제 표시 시 POINT로 보이도록 처리할 예정
  const [selectedAssets, setSelectedAssets] = useState<string[]>(["SL"]);

  // 증감 필터 (REWARD → INCREASE, USE → DECREASE)
  // 처음에는 INCREASE, DECREASE 모두 보이도록 할 수도 있고, 필요에 따라 초기값 조정 가능
  const [selectedChanges, setSelectedChanges] = useState<string[]>(["INCREASE", "DECREASE"]);

  // 보상 목록 데이터 (페이징 적용)
  const [pageNumber, setPageNumber] = useState(0);
  const [rewardHistory, setRewardHistory] = useState<any[]>(dummyPages[0].content);

  // 자산 체크박스 변경 핸들러
  const handleAssetChange = (asset: string) => {
    playSfx(Audios.button_click);

    // 만약 이미 체크되어 있고, 체크 해제하려고 할 때 선택된 자산이 1개 뿐이라면 해제 불가
    if (selectedAssets.includes(asset) && selectedAssets.length === 1) {
      // 최소 1개의 필터는 선택되어 있어야 하므로 여기서 return
      return;
    }

    // 토글 로직
    setSelectedAssets((prev) =>
      prev.includes(asset) ? prev.filter((a) => a !== asset) : [...prev, asset]
    );
  };

  // 증감 체크박스 변경 핸들러
  const handleChangeType = (change: string) => {
    playSfx(Audios.button_click);

    // 토글 로직 (여기서는 반드시 하나 이상 선택이 필요한 요구사항이 없으므로 그대로 토글)
    setSelectedChanges((prev) =>
      prev.includes(change) ? prev.filter((c) => c !== change) : [...prev, change]
    );
  };

  // 날짜 범위 체크 함수
  const isWithinDateRange = (rewardDate: string) => {
    const date = new Date(rewardDate);
    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;
    return true;
  };

  // 필터링된 데이터
  const filteredHistory = rewardHistory.filter((reward) => {
    // currencyType가 STAR면 'POINT'라는 이름으로 표시할 예정이므로
    // 내부적으로는 STAR 그대로 두되, 필터 체크 시 'STAR'를 사용
    const assetType = reward.currencyType; // SL, USDC, STAR

    // changeType이 REWARD면 "INCREASE", USE면 "DECREASE"로 매핑
    const mappedChangeType = reward.changeType === "REWARD" ? "INCREASE" : "DECREASE";

    // 자산 필터 적용
    // (selectedAssets.length가 0이 되는 경우는 없도록 처리 중이지만, 혹시 모를 상황에 대비)
    const assetIncluded =
      selectedAssets.length === 0 || selectedAssets.includes(assetType);

    // 증감 필터 적용
    const changeIncluded =
      selectedChanges.length === 0 || selectedChanges.includes(mappedChangeType);

    // 날짜 필터
    const dateIncluded = isWithinDateRange(reward.loggedAt);

    return assetIncluded && changeIncluded && dateIncluded;
  });

  // "더보기" 버튼 클릭 시 다음 페이지 데이터를 추가로 가져온다고 가정
  const handleLoadMore = () => {
    playSfx(Audios.button_click);
    const nextPageNumber = pageNumber + 1;

    // 더미 페이지가 존재할 경우
    const nextPageData = dummyPages.find((p) => p.pageNumber === nextPageNumber);
    if (nextPageData) {
      setRewardHistory((prev) => [...prev, ...nextPageData.content]);
      setPageNumber(nextPageNumber);
    }
  };

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

        {/* 필터 옵션 */}
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
              {/* STAR는 표시할 때 POINT라 부르지만, 체크박스에서는 STAR라고 처리 */}
              {["SL", "USDC", "STAR"].map((asset) => (
                <label
                  key={asset}
                  className="flex items-center text-base font-medium"
                >
                  <input
                    type="checkbox"
                    checked={selectedAssets.includes(asset)}
                    onChange={() => handleAssetChange(asset)}
                    className="mr-2"
                  />
                  {/* 표시할 때는 STAR를 POINT로 */}
                  {asset === "STAR" ? "POINT" : asset}
                </label>
              ))}
            </div>

            {/* 증감 필터 (REWARD->INCREASE, USE->DECREASE) */}
            <p className="text-lg font-medium text-left mt-4 mb-2">Change Types</p>
            <div className="flex flex-col gap-2 ml-3">
              {["INCREASE", "DECREASE"].map((change) => (
                <label
                  key={change}
                  className="flex items-center text-base font-medium"
                >
                  <input
                    type="checkbox"
                    checked={selectedChanges.includes(change)}
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
            filteredHistory.map((reward, index) => {
              // changeType -> INCREASE/DECREASE 매핑
              const displayChangeType =
                reward.changeType === "REWARD" ? "INCREASE" : "DECREASE";

              // STAR -> POINT
              const displayAsset =
                reward.currencyType === "STAR" ? "POINT" : reward.currencyType;

              return (
                <div
                  key={index}
                  className="flex justify-between items-center py-4 border-b border-[#35383F]"
                >
                  <div>
                    <p className="text-sm font-medium">{reward.content}</p>
                    <p className="text-xs text-gray-400">{reward.loggedAt}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    {/* 예: +100 POINT, -100 POINT 표기 등 */}
                    <p
                      className={`text-sm font-bold ${
                        displayChangeType === "INCREASE" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {displayChangeType === "INCREASE" ? "+" : "-"}
                      {reward.amount} {displayAsset}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-sm text-gray-400">No records found</p>
          )}

            {/* 레퍼럴 보상 내역(요약본) - 예시 */}
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
                    <p className="text-sm font-bold text-blue-400">+150 POINT</p>
                    <FaChevronRight className="w-4 h-4" />
                </div>
            </div>

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

          {/* 더보기 버튼 (페이징) */}
          {/* 실제 API 연동 시에는 last 페이지인지 확인 후 조건부 렌더링 */}
          {pageNumber < dummyPages.length - 1 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 bg-blue-500 rounded-md text-white font-semibold hover:bg-blue-600"
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
