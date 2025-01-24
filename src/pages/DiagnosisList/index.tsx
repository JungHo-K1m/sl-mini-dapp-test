import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronDown, FaCalendarAlt } from 'react-icons/fa';

import getRecords from '@/entities/AI/api/getRecord';                
import getFilteredDiagnosis from '@/entities/Pet/api/getFilteredDiagnosis'; 
import { useTranslation } from "react-i18next";
import { TopTitle } from '@/shared/components/ui';
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";
import LoadingSpinner from '@/shared/components/ui/loadingSpinner';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

interface RecordItem {
  diagnosisAt: string;      // 예: "2025-01-24"
  diagnosisImgUrl: string;
  petName: string;
  type: string;             // "DENTAL_REAL" | "DENTAL_XRAY" 등
  details: {
    label: string;
    probability: number;
    description: string;
    caution: string;
  }[];
}

const DiagnosisRecords: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { playSfx } = useSound();

  // 진단 목록
  const [records, setRecords] = useState<RecordItem[]>([]);

  // 라벨(필터) 목록
  const [filterOptions, setFilterOptions] = useState<string[]>(['All']);

  // 필터 상태
  const [selectedFilter, setSelectedFilter] = useState<string>('All');  // 라벨 필터
  const [typeFilter, setTypeFilter] = useState<string>('All');          // 타입 필터
  const [startDate, setStartDate] = useState<Date | null>(null);        // 날짜 (start)
  const [endDate, setEndDate] = useState<Date | null>(null);            // 날짜 (end)

  // 로딩 & 에러 모달
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalText, setModalText] = useState("");

  // petId
  const petData = location.state as { id: string };
  const [id] = useState<string>(petData?.id || '');

  // ---- 커스텀 DatePicker 인풋 ----
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
  // 1) 페이지 최초 로드시: 라벨 목록 가져오기
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;

    const fetchLabelOptions = async () => {
      try {
        const res = await getRecords(id);
        if (res && Array.isArray(res)) {
          const labels = res
            .map((item: any) =>
              typeof item.record === 'string' ? item.record : null
            )
            .filter((label: string | null) => label !== null) as string[];

          setFilterOptions(['All', ...new Set(labels)]);
        } else {
          setFilterOptions(['All']);
        }
      } catch (err) {
        console.error('Failed to fetch filter labels:', err);
        openErrorModal(
          t('ai_page.Failed_to_load_filter_options._Please_try_again_later.')
        );
      }
    };

    fetchLabelOptions();
  }, [id, t]);

  // ─────────────────────────────────────────────────────────────────────────
  // 2) 페이지 최초 + 필터 변경 시: getFilteredDiagnosis로 리스트 불러오기
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;

    const fetchFilteredList = async () => {
      playSfx(Audios.button_click);
      setLoading(true);

      try {
        // 'All'이면 null
        const labelParam = selectedFilter === 'All' ? null : selectedFilter;
        const typeParam = typeFilter === 'All' ? null : typeFilter;

        // 날짜
        const sDate = startDate ? format(startDate, 'yyyy-MM-dd') : null;
        const eDate = endDate ? format(endDate, 'yyyy-MM-dd') : null;

        // 필터 조회
        const result = await getFilteredDiagnosis(typeParam, labelParam, id, eDate, sDate);
        if (result && Array.isArray(result)) {
          // 역순 정렬: 최신 날짜가 상단에 오도록
          // 아래 가정: diagnosisAt이 "YYYY-MM-DD" 포맷이므로 문자열 비교로도 가능
          // 더 정확히 하려면 Date 객체로 변환 후 내림차순 정렬
          const sorted = [...result].sort((a, b) =>
            b.diagnosisAt.localeCompare(a.diagnosisAt)
          );
          setRecords(sorted);
        } else {
          setRecords([]);
        }
      } catch (err) {
        console.error('Failed to fetch filtered records:', err);
        openErrorModal(
          t('ai_page.Failed_to_load_records._Please_try_again_later.')
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredList();
  }, [selectedFilter, typeFilter, startDate, endDate, id, t, playSfx]);

  // ---- 오류 모달 ----
  const openErrorModal = (text: string) => {
    setOpenModal(true);
    setModalText(text);
  };

  // ---- 상세로 이동 ----
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

  // ---- 글자수 제한 (필터 옵션 등) ----
  const truncateText = (text: string, maxLength: number) => {
    if (typeof text !== 'string') return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="flex flex-col items-center text-white px-6 min-h-screen">
      <TopTitle title={t('ai_page.Records')} back={true} />

      {/* 필터 영역 */}
      <div className="flex items-center w-full">
        {/* 라벨 필터 */}
        <div className="relative w-1/2 mr-2">
          <select
            className="text-black p-2 rounded-full bg-white pr-6 pl-6 appearance-none w-full text-sm font-normal"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            {filterOptions.map((option, idx) => (
              <option key={idx} value={option}>
                {truncateText(option, 17)}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black pointer-events-none" />
        </div>

        {/* 타입 필터 */}
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
        <p className="text-lg font-medium mb-2">{t('reward_page.range')}</p>
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

      {/* 로딩 or 리스트 */}
      {loading ? (
        <div className="flex justify-center items-center h-64 min-h-screen">
          <LoadingSpinner
            size={16}
            color="#ffffff"
            duration={1}
            className="h-screen"
          />
        </div>
      ) : (
        <div className="w-full mt-8">
          {records.map((record, index) => {
            // DENTAL_REAL → label(probability%), X-ray → label만
            const detailDisplay = record.details
              .map((detail) =>
                record.type === 'DENTAL_REAL'
                  ? `${detail.label}(${detail.probability}%)`
                  : detail.label
              )
              .join(', ');

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

      {/* 에러 모달 */}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black p-6 rounded-lg text-center">
            <p>{modalText}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={() => setOpenModal(false)}
            >
              {t('OK')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosisRecords;
