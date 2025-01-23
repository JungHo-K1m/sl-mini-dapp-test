import React, { useState, useEffect } from "react";
import { FaSearch, FaCaretDown, FaCaretUp } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { TopTitle } from "@/shared/components/ui";
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";

import getFriendsList from "@/entities/RewardPage/api/friendsList";
import getReferralDetail from "@/entities/RewardPage/api/referralRewards";

const FriendRewards: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { playSfx } = useSound();

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

  // 자산 타입 필터: 하나만 선택할 수 있게. (예: 기본값 "SL")
  const [selectedAsset, setSelectedAsset] = useState<string>("SL");

  // 처음에 사용하던 selectedAssets 배열은 필요 없어져서 제거

  // --------------------------------------------------
  // 1) 페이지 최초 진입 시: 친구 목록 + 이번 달 1일부터 오늘까지의 리워드 내역
  // --------------------------------------------------
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 친구 목록 가져오기
        const friendListResult = await getFriendsList();
        setFriendList(friendListResult);
        setFilteredList(friendListResult);

        // 이번 달 1일~오늘
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        setStartDate(firstDayOfMonth);
        setEndDate(now);

        // 서버에 최초 리워드 내역 요청
        const formattedStart = format(firstDayOfMonth, "yyyy-MM-dd");
        const formattedEnd = format(now, "yyyy-MM-dd");
        
        // assetType = null 로, friendId = null 로 요청
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
    if (!startDate || !endDate) return;

    const fetchDataByFilter = async () => {
      try {
        // 날짜 형식 변환
        const formattedStart = format(startDate, "yyyy-MM-dd");
        const formattedEnd = format(endDate, "yyyy-MM-dd");

        // 선택된 자산 타입이 "Point"라면 "star"로 바꿔서 서버에 전송
        let assetTypeForServer: string | null = null;
        if (selectedAsset) {
          if (selectedAsset === "Point") assetTypeForServer = "POINT";
          else assetTypeForServer = selectedAsset;
        }

        // 검색어를 friendId로 바로 쓰는 예시
        const friendId = searchText ? searchText : null;

        const detail = await getReferralDetail(
          assetTypeForServer,  // 여기서 "Point" -> "star" 처리
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
  }, [selectedAsset, startDate, endDate, searchText]);

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

  // 자산 타입 체크박스: 하나만 선택 가능하도록 변경
  const handleAssetChange = (asset: string) => {
    // 이미 선택된 것을 클릭하면 null로 만들 수도 있지만,
    // 여기서는 "같은 것 다시 누르면 해제"인지, "변경할 수 없음"인지 정해야 함.
    // 간단히 "같은 자산을 다시 누르면 선택 해제" 로 가정하겠습니다:
    if (selectedAsset === asset) {
      // 이미 같은 자산이 선택된 상태라면 해제
      setSelectedAsset("");
    } else {
      // 새 자산만 선택
      setSelectedAsset(asset);
    }
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

  
  return (
    <div className="flex flex-col text-white mb-32 px-6 min-h-screen">
      <TopTitle title={t("reward_page.ref_reward")} back={true} />

      {/* 드롭다운 필터 */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => {
            playSfx(Audios.button_click);
            setIsOpen(!isOpen);
          }}>
          <div className="flex items-center">
            <p className="text-lg font-semibold">{t("reward_page.filter")}</p>
          </div>
          {isOpen ? (
            <FaCaretUp className="text-lg" />
          ) : (
            <FaCaretDown className="text-lg" />
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
            <p className="text-lg font-medium text-left mb-2">{t("reward_page.search")}</p>
            <div className="relative w-full mb-4">
              <input
                type="text"
                placeholder={t("reward_page.name")}
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full h-14 px-4 py-2 pr-14 bg-[#1F1E27] border-[#35383F] border-2 text-white text-center rounded-full focus:outline-none focus:ring focus:ring-blue-500"
              />
              <FaSearch
                className="absolute right-5 text-[#A3A3A3] w-5 h-5"
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

            {/* 자산 종류 필터 (하나만 선택) */}
            <p className="text-lg font-medium text-left mb-2">{t("reward_page.type")}</p>
            <div className="flex flex-col gap-2 ml-3">
              {["USDC", "SL", "Point"].map((asset) => (
                <label
                  key={asset}
                  className="flex items-center text-base font-medium"
                >
                  <input
                    type="checkbox"
                    checked={selectedAsset === asset}
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

            {/* 날짜 범위 선정 */}
            <p className="text-lg font-medium text-left mt-4">{t("reward_page.range")}</p>
            <div className="flex items-center gap-4 mt-4">
              {/* 시작일 */}
              <div className="w-full">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    playSfx(Audios.button_click);
                    setStartDate(date);
                  }}
                  placeholderText="Start Date"
                  customInput={<CustomDateInput placeholder="Start Date" />}
                  dateFormat="yyyy-MM-dd"
                  maxDate={endDate || undefined}
                  className="rounded-full"
                />
              </div>
              {/* 종료일 */}
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
                  className="rounded-full"
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
                <p className="text-base font-medium">{reward.userId}</p>
                <p className="text-xs font-normal text-[#A3A3A3]">
                  {reward.rewardedAt?.substring(0, 10)}
                </p>
              </div>
              <p className="text-lg font-semibold text-[#3B82F6]">
                +{reward.reward.toLocaleString()}
                {reward.type}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-lg font-semibold text-gray-400">
            {t("reward_page.no_record")}
          </p>
        )}
      </div>
    </div>
  );
};

export default FriendRewards;
