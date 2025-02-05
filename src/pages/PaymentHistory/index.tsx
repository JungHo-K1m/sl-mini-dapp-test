import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronRight, FaCaretDown, FaCaretUp, FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";
import { useTranslation } from "react-i18next";
import { TopTitle } from "@/shared/components/ui";
import Images from "@/shared/assets/images";

// -- (1) 여러 날짜를 포함한 더미 데이터
const DUMMY_PAYMENTS = [
  {
    id: 1,
    itemName: "Auto Item",
    price: 10,
    purchaseDate: new Date("2024-11-24"), // 2024년 11월 24일
  },
  {
    id: 2,
    itemName: "Reward Booster(5x)",
    price: 10,
    purchaseDate: new Date("2024-11-24"), // 2024년 11월 24일
  },
  {
    id: 3,
    itemName: "Auto Item",
    price: 8,
    purchaseDate: new Date("2025-02-05"), // 2025년 2월 5일
  },
  {
    id: 4,
    itemName: "Auto Item",
    price: 9,
    purchaseDate: new Date("2025-03-10"), // 2025년 3월 10일
  },
  {
    id: 5,
    itemName: "Reward Booster(5x)",
    price: 12,
    purchaseDate: new Date("2025-03-11"), // 2025년 3월 11일
  },
];

const PaymentHistory: React.FC = () => {
  const { t } = useTranslation();
  const { playSfx } = useSound();
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

  // -- (2) 필터 적용 로직은 동일
  const filteredPayments = paymentHistory.filter((item) => {
    // 아이템 필터
    if (item.itemName === "Auto Item" && !filterAuto) return false;
    if (item.itemName === "Reward Booster(5x)" && !filterBooster) return false;

    // 날짜 필터
    if (startDate && item.purchaseDate < startDate) return false;
    if (endDate && item.purchaseDate > endDate) return false;

    return true;
  });

  // -- (3) 날짜별로 묶어 표시 (예: "24 Nov 2024" 그룹)
  const groupedByDate = filteredPayments.reduce(
    (acc: Record<string, typeof filteredPayments>, cur) => {
      const dateKey = format(cur.purchaseDate, "dd MMM yyyy");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(cur);
      return acc;
    },
    {}
  );

  // -- (4) 날짜 문자열 키를 실제 날짜로 비교해 정렬
  const dateKeys = Object.keys(groupedByDate).sort(
    (a, b) => +new Date(a) - +new Date(b)
  );

  return (
    <div className="flex flex-col text-white mb-32 px-6 min-h-screen">
      <TopTitle title={t("asset_page.payment_history")} back={true} />

      {/* 필터 드롭다운 */}
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

      {/* 결제 내역 리스트 */}
      <div className="w-full mt-6">
        {dateKeys.length === 0 ? (
          <p className="text-center text-sm text-gray-400">No records found</p>
        ) : (
          dateKeys.map((dateKey) => (
            <div key={dateKey} className="mb-3">
              <p className="text-sm text-gray-300 mb-2">{dateKey}</p>
              {groupedByDate[dateKey].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between mb-5"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="relative w-[70px] h-[70px] rounded-2xl"
                      style={{
                        background:
                          item.itemName === "Auto Item"
                            ? "linear-gradient(180deg, #0147E5 0%, #FFFFFF 100%)"
                            : "linear-gradient(180deg, #FF4F4F 0%, #FFFFFF 100%)",
                      }}
                    >
                      <img
                        src={
                          item.itemName === "Auto Item"
                            ? Images.AutoNFT
                            : Images.RewardNFT
                        }
                        alt="item icon"
                        className="absolute w-[50px] h-[50px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      />
                    </div>

                    <div className="flex flex-col">
                      <p className="font-semibold text-base">{item.itemName}</p>
                      <p className="font-normal text-sm">USD ${item.price}</p>
                    </div>
                  </div>
                  <FaChevronRight 
                    className="w-5 h-5"
                    onClick={()=>{
                        playSfx(Audios.button_click);
                        navigate("/payment-detail"),{
                            state: {
                                itemName: item.itemName,
                                purchaseDate: item.purchaseDate,
                                price: item.price,
                                orderId: "12345ABC", // 예시로 임의 지정
                              },
                        }
                    }} />
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
