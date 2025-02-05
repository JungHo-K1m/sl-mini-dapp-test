import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronRight, FaCaretDown, FaCaretUp, FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import { format } from "date-fns";

// 예시: i18n이나 사운드 관련 훅은 필요시 import
// import { useSound } from "@/shared/provider/SoundProvider";
// import Audios from "@/shared/assets/audio";
// import { useTranslation } from "react-i18next";

// 상단 타이틀 영역을 감싸는 간단한 컴포넌트 예시(필요 시 교체/삭제 가능)
const TopTitle: React.FC<{ title: string; back?: boolean }> = ({ title }) => {
  return (
    <div className="flex items-center mb-4">
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
  );
};

// 더미 데이터: 24 Nov 2024 날짜에 아이템 2개가 구매되었다고 가정
const DUMMY_PAYMENTS = [
  {
    id: 1,
    itemName: "Auto Item",
    price: 10,
    purchaseDate: new Date("2024-11-24"),
  },
  {
    id: 2,
    itemName: "Reward Booster(5x)",
    price: 10,
    purchaseDate: new Date("2024-11-24"),
  },
];

const PaymentHistory: React.FC = () => {
  // const { t } = useTranslation(); // i18n 필요시 활성
  // const { playSfx } = useSound(); // 사운드 필요시 활성
  const navigate = useNavigate();

  // 필터 드롭다운 열림 여부
  const [isOpen, setIsOpen] = useState(false);

  // 아이템 필터(체크박스)
  const [filterAuto, setFilterAuto] = useState(true);
  const [filterBooster, setFilterBooster] = useState(true);

  // 날짜 필터
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // 더미 결제 내역
  const [paymentHistory] = useState(DUMMY_PAYMENTS);

  // 체크박스 변경 핸들러
  const handleCheckAuto = () => {
    // playSfx(Audios.button_click);
    setFilterAuto(!filterAuto);
  };

  const handleCheckBooster = () => {
    // playSfx(Audios.button_click);
    setFilterBooster(!filterBooster);
  };

  // 날짜 변경 핸들러
  const handleStartDateChange = (date: Date | null) => {
    // playSfx(Audios.button_click);
    setStartDate(date);
    if (endDate && date && date > endDate) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    // playSfx(Audios.button_click);
    setEndDate(date);
  };

  // DatePicker용 Custom Input
  const CustomDateInput = React.forwardRef<HTMLInputElement, any>(
    ({ value, onClick, placeholder }, ref) => (
      <div
        className="flex items-center w-full px-4 py-2 bg-gray-800 text-white rounded-lg cursor-pointer"
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

  // 필터 적용
  const filteredPayments = paymentHistory.filter((item) => {
    // 아이템 필터
    if (item.itemName === "Auto Item" && !filterAuto) return false;
    if (item.itemName === "Reward Booster(5x)" && !filterBooster) return false;

    // 날짜 필터
    if (startDate && item.purchaseDate < startDate) return false;
    if (endDate && item.purchaseDate > endDate) return false;

    return true;
  });

  // 날짜별로 묶어서 표시 (예: "24 Nov 2024" 그룹)
  const groupedByDate = filteredPayments.reduce((acc: Record<string, typeof filteredPayments>, cur) => {
    const dateKey = format(cur.purchaseDate, "dd MMM yyyy");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(cur);
    return acc;
  }, {});

  const dateKeys = Object.keys(groupedByDate).sort(
    (a, b) => +new Date(a) - +new Date(b)
  );

  return (
    <div className="flex flex-col text-white mb-32 px-6 min-h-screen bg-[#111827]">
      <TopTitle title="Payment History" />

      {/* 필터 드롭다운 */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => {
            // playSfx(Audios.button_click);
            setIsOpen(!isOpen);
          }}
        >
          <p className="text-lg font-semibold">Filter Option</p>
          {isOpen ? <FaCaretUp className="w-4 h-4" /> : <FaCaretDown className="w-4 h-4" />}
        </div>

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="mt-4 mx-3">
            {/* 아이템 필터 (체크박스) */}
            <p className="text-lg font-medium text-left mb-2">Item Name</p>
            <div className="flex flex-col gap-2 ml-3">
              <label className="flex items-center text-base font-medium">
                <input
                  type="checkbox"
                  checked={filterAuto}
                  onChange={handleCheckAuto}
                  className="mr-2"
                />
                Auto Item
              </label>

              <label className="flex items-center text-base font-medium">
                <input
                  type="checkbox"
                  checked={filterBooster}
                  onChange={handleCheckBooster}
                  className="mr-2"
                />
                Reward Booster(5x)
              </label>
            </div>

            {/* 날짜 범위 선택 */}
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

      {/* 결제 내역 리스트 */}
      <div className="w-full mt-6">
        {dateKeys.length === 0 ? (
          <p className="text-center text-sm text-gray-400">No records found</p>
        ) : (
          dateKeys.map((dateKey) => (
            <div key={dateKey} className="mb-4">
              <p className="text-sm text-gray-300 mb-2">{dateKey}</p>
              {groupedByDate[dateKey].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-gray-800 p-4 rounded-lg mb-2"
                >
                  {/* 아이콘 영역: 실제 앱 아이콘 등으로 교체 가능 */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-md"
                      style={{
                        background: item.itemName === "Auto Item"
                          ? "linear-gradient(180deg, #0147E5 0%, #FFFFFF 100%)"
                          : "linear-gradient(180deg, #FF4F4F 0%, #FFFFFF 100%)"
                      }}
                    />
                    <div className="flex flex-col">
                      <p className="font-semibold">{item.itemName}</p>
                      <p className="text-sm text-gray-300">USD ${item.price}</p>
                    </div>
                  </div>
                  <FaChevronRight className="text-gray-400" />
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
