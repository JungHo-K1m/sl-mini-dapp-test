import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { TopTitle } from "@/shared/components/ui";

import getFriendsList from "@/entities/RewardPage/api/friendsList";
import getReferralDetail from "@/entities/RewardPage/api/referralRewards";

const FriendRewards: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // 날짜 필터
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // 친구 목록 (자동완성 용)
  const [friendList, setFriendList] = useState<string[]>([]);
  const [filteredList, setFilteredList] = useState<string[]>([]);

  // 검색어 (친구 이름)
  const [searchText, setSearchText] = useState<string>("");

  // 서버에서 받아온 리워드 내역
  const [referralDetails, setReferralDetails] = useState<any[]>([]);

  // 자산 타입 필터 (여러 개 체크 가능하다고 가정)
  const [selectedAssets, setSelectedAssets] = useState<string[]>(["SL"]);

  // --------------------------------------------------
  // 1) 페이지 최초 진입 시: 친구 목록 + 이번 달 1일부터 오늘까지의 리워드 내역
  // --------------------------------------------------
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 1. 친구 목록 가져오기 (자동완성 위해서)
        const friendListResult = await getFriendsList();
        setFriendList(friendListResult);
        setFilteredList(friendListResult);

        // 2. startDate = 이번 달 1일, endDate = 오늘
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        setStartDate(firstDayOfMonth);
        setEndDate(now);

        // 3. 서버에 최초 리워드 내역 요청
        const formattedStart = format(firstDayOfMonth, "yyyy-MM-dd");
        const formattedEnd = format(now, "yyyy-MM-dd");
        // => assetType: null, friendId: null
        const detail = await getReferralDetail(null, formattedStart, formattedEnd, null);

        setReferralDetails(detail);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInitialData();
  }, []);

  // --------------------------------------------------
  // 2) 자산 타입, 날짜, 검색어가 바뀔 때마다 서버에 재요청
  // --------------------------------------------------
  useEffect(() => {
    // startDate 혹은 endDate가 아직 null이면, 아직 초기화가 안 된 상태이므로 return
    if (!startDate || !endDate) return;

    const fetchDataByFilter = async () => {
      try {
        // 날짜 형식 변환
        const formattedStart = format(startDate, "yyyy-MM-dd");
        const formattedEnd = format(endDate, "yyyy-MM-dd");

        // 자산 필터가 여러 개일 때, 예시로 "첫 번째 선택 자산"만 보낸다고 가정하거나
        // 혹은 서버가 배열을 받을 수 있다면 배열로 보낼 수도 있음
        // 여기서는 "단일 선택" 예시로.
        const assetType =
          selectedAssets.length === 1 ? selectedAssets[0] : null;

        // 친구 이름을 friendId로 바로 쓰는 예시 (실제로는 ID 매핑이 필요할 수 있음)
        // 여기서는 "이름을 그대로 friendId"로 보낸다고 가정.
        const friendId = searchText ? searchText : null;

        // API 호출
        const detail = await getReferralDetail(
          assetType,
          formattedStart,
          formattedEnd,
          friendId
        );

        setReferralDetails(detail);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDataByFilter();
  }, [selectedAssets, startDate, endDate, searchText]);

  // --------------------------------------------------
  // 3) 자동완성용 친구 검색
  // --------------------------------------------------
  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = friendList.filter((friend) =>
      friend.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredList(filtered);
  };

  // 자산 타입 체크박스
  const handleAssetChange = (asset: string) => {
    setSelectedAssets((prev) =>
      prev.includes(asset) ? prev.filter((a) => a !== asset) : [...prev, asset]
    );
  };

  // 커스텀 날짜 인풋
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

  // --------------------------------------------------
  // 렌더링
  // --------------------------------------------------
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
          {isOpen ? (
            <FaChevronUp className="text-lg" />
          ) : (
            <FaChevronDown className="text-lg" />
          )}
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
            <div className="relative w-full mb-4">
              <input
                type="text"
                placeholder="Search Name..."
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full h-14 px-4 py-2 pr-14 bg-gray-800 text-white text-center rounded-full focus:outline-none focus:ring focus:ring-blue-500"
              />
              <FaSearch
                className="absolute right-5 text-gray-400 w-5 h-5"
                style={{
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
            </div>
            <div className="my-3">
              {/* 자동완성 결과 목록 */}
              {searchText && filteredList.length > 0 && (
                <ul className="autoCompleteList">
                  {filteredList.map((friend) => (
                    <li
                      key={friend}
                      onClick={() => {
                        setSearchText(friend); // 검색창 자동완성
                        setFilteredList([]);
                      }}
                      className="border-b border-gray-300 mt-2"
                    >
                      {friend}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 자산 종류 필터 */}
            <p className="text-lg font-medium text-left mb-2">Asset Types</p>
            <div className="flex flex-col gap-2 ml-3">
              {["USDC", "SL", "Point"].map((asset) => (
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
                  {asset}
                </label>
              ))}
            </div>

            {/* 날짜 범위 선정 */}
            <p className="text-lg font-medium text-left mt-4">Date Ranges</p>
            <div className="flex items-center gap-4 mt-4">
              {/* 시작일 */}
              <div className="w-full">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                  }}
                  placeholderText="Start Date"
                  customInput={<CustomDateInput placeholder="Start Date" />}
                  dateFormat="yyyy-MM-dd"
                  maxDate={endDate || undefined}
                />
              </div>
              {/* 종료일 */}
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
        {referralDetails && referralDetails.length > 0 ? (
          referralDetails.map((reward, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center py-4 border-b border-[#35383F]"
            >
              <div>
                {/* userId or from? 서버 응답 형식에 맞춰 조정 */}
                <p className="text-sm font-medium">{reward.userId}</p>
                <p className="text-xs text-gray-400">
                  {reward.rewardedAt?.substring(0, 10)} {/* 'YYYY-MM-DD'만 표시 */}
                </p>
              </div>
              <p className="text-sm font-bold text-blue-400">
                {reward.reward}
                {reward.type}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-gray-400">No records found</p>
        )}
      </div>
    </div>
  );
};

export default FriendRewards;
