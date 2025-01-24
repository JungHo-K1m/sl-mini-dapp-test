import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronDown } from 'react-icons/fa';
import getRecords from '@/entities/AI/api/getRecord';           // 라벨용
import getDiagnosisList from '@/entities/Pet/api/getDiagnosisList'; // 전체 목록용
import getFilteredDiagnosis from '@/entities/Pet/api/getFilteredDiagnosis'; // 필터 적용용
import { useTranslation } from "react-i18next";
import { TopTitle } from '@/shared/components/ui';
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import LoadingSpinner from '@/shared/components/ui/loadingSpinner';

interface RecordItem {
  diagnosisAt: string;
  diagnosisImgUrl: string;
  petName: string;
  type: string;
  details: {
    caution: string;
    description: string;
    label: string;
    probability: number;
  }[];
}

const DiagnosisRecords: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { playSfx } = useSound();

  const [open, setOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [loading, setLoading] = useState(false);

  // 기존 필터 state
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [filterOptions, setFilterOptions] = useState<string[]>(['All']);

  // 새로운 진단 타입 필터 state
  const [typeFilter, setTypeFilter] = useState<string>('All');

  const petData = location.state as { id: string };
  const [id] = useState<string>(petData?.id || '');

  // 날짜 필터 state
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // 진단 목록
  const [records, setRecords] = useState<RecordItem[]>([]);

  // 커스텀 DatePicker 인풋
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

  // ─────────────────────────────────────────────────────────────────────────
  // 1) 페이지 최초 진입 시: 라벨 목록 + 전체 진단 목록
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;

    // (A) 라벨 목록 (필터용)
    const fetchFilterLabels = async () => {
      try {
        const filters = await getRecords(id);
        if (filters && Array.isArray(filters)) {
          // filter.record가 string인지 확인
          const filterLabels = filters
            .map((f: any) => (typeof f?.record === "string" ? f.record : null))
            .filter((item: any) => item !== null) as string[];

          setFilterOptions(["All", ...new Set(filterLabels)]);
        } else {
          setFilterOptions(["All"]);
        }
      } catch (error) {
        console.error('Failed to fetch filter labels:', error);
        setModal(t("ai_page.Failed_to_load_filter_options._Please_try_again_later."));
      }
    };

    // (B) 전체 진단 목록
    const fetchInitialRecords = async () => {
      setLoading(true);
      try {
        const allRecords = await getDiagnosisList(id);
        if (allRecords && Array.isArray(allRecords)) {
          setRecords(allRecords);
        } else {
          setRecords([]);
        }
      } catch (error) {
        console.error('Failed to fetch initial records:', error);
        setModal(t("ai_page.Failed_to_load_records._Please_try_again_later."));
      } finally {
        setLoading(false);
      }
    };

    fetchFilterLabels();
    fetchInitialRecords();
  }, [id, t]);

  // ─────────────────────────────────────────────────────────────────────────
  // 2) 필터 변경 시: getFilteredDiagnosis 호출
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // 이펙트는 선택된 필터 변경, 날짜 변경이 있을 때마다 호출됨
    if (!id) return;

    const fetchDataByFilter = async () => {
      playSfx(Audios.button_click);
      setLoading(true);

      try {
        // 필터에서 All -> null 처리
        const labelParam = selectedFilter === 'All' ? null : selectedFilter;
        const typeParam = typeFilter === 'All' ? null : typeFilter;

        // 날짜 포맷
        const sDate = startDate ? format(startDate, "yyyy-MM-dd") : null;
        const eDate = endDate ? format(endDate, "yyyy-MM-dd") : null;

        // getFilteredDiagnosis(type, label, petId, endDate, startDate)
        const filtered = await getFilteredDiagnosis(
          typeParam,
          labelParam,
          id,
          eDate,
          sDate
        );

        if (filtered && Array.isArray(filtered)) {
          setRecords(filtered);
        } else {
          setRecords([]);
        }
      } catch (error) {
        console.error("Failed to fetch filtered records:", error);
        setModal(t("ai_page.Failed_to_load_records._Please_try_again_later."));
      } finally {
        setLoading(false);
      }
    };

    // “All” 값만 선택되어 있고, 날짜도 없을 때는 필터 호출 안 해도 전체 목록과 동일할 수 있음
    // 하지만 “처음 진입 시에 전체 목록”과 구별하려면, 아래 조건 처리 가능
    // 이 예시는 무조건 필터 API로 가도록 처리
    fetchDataByFilter();
  }, [selectedFilter, typeFilter, startDate, endDate, id, t, playSfx]);

  // 글자수를 17글자로 제한
  const truncateText = (text: string, maxLength: number) => {
    if (typeof text !== "string") return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // 모달 표시
  const setModal = (text: string) => {
    setOpen(true);
    setModalText(text);
  };

  // 상세 페이지 이동
  const handleNavigateToDetail = (record: RecordItem) => {
    playSfx(Audios.button_click);
    navigate('/diagnosis-detail', {
      state: {
        img: record.diagnosisImgUrl,
        description: record.details,
        photo_type: record.type,
      },
    });
  };

  return (
    <div className="flex flex-col items-center text-white px-6 min-h-screen">
      <TopTitle title={t("ai_page.Records")} back={true} />

      {/* 필터 버튼 2개 */}
      <div className="flex items-center w-full mt-4">
        {/* 첫 번째 필터 (label) */}
        <div className="relative w-1/2 mr-2">
          <select
            className="text-black p-2 rounded-full bg-white pr-6 pl-6 appearance-none w-full text-sm font-normal"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            {filterOptions.map((option, index) => (
              <option key={index} value={option}>
                {truncateText(option, 17)}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black pointer-events-none" />
        </div>

        {/* 두 번째 필터 (type) */}
        <div className="relative w-1/2 ml-2">
          <select
            className="text-black p-2 rounded-full bg-white pr-6 pl-6 appearance-none w-full text-sm font-normal"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="DENTAL_REAL">DENTAL_REAL</option>
            <option value="DENTAL_XRAY">DENTAL_XRAY</option>
          </select>
          <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black pointer-events-none" />
        </div>
      </div>

      {/* 날짜 범위 */}
      <div className="mt-4 w-full">
        <p className="text-lg font-medium mb-2">{t("reward_page.range")}</p>

        {/* 시작일, 종료일 데이트피커 */}
        <div className="flex items-center gap-4">
          {/* 시작일 */}
          <div className="w-1/2">
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
          <div className="w-1/2">
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

      {loading ? (
        <div className="flex justify-center items-center h-64 min-h-screen">
          <LoadingSpinner className="h-screen"/>
        </div>
      ) : (
        <div className="w-full mt-8">
          {records.map((record, index) => {
            // record.type이 DENTAL_REAL이면 확률 붙여서 표시, 그 외에는 라벨만 표시
            const detailDisplay = record.details
              ? record.details
                  .map((detail) =>
                    record.type === "DENTAL_REAL"
                      ? `${detail.label}(${detail.probability}%)`
                      : detail.label
                  )
                  .join(", ")
              : "";

            return (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center"
                onClick={() => handleNavigateToDetail(record)}
              >
                <div>
                  <p className="font-semibold text-base">
                    {`${record.diagnosisAt}  ${record.type}`}
                  </p>
                  <p className="text-sm font-normal text-gray-400">
                    {detailDisplay}
                  </p>
                </div>
                <FaChevronLeft className="text-lg cursor-pointer transform rotate-180" />
              </div>
            );
          })}
        </div>
      )}

      {/* api 에러 발생 시 모달창 */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black p-6 rounded-lg text-center">
            <p>{modalText}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={() => {
                playSfx(Audios.button_click);
                setOpen(false);
              }}
            >
              {t("OK")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosisRecords;
