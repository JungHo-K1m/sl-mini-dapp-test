import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronDown } from 'react-icons/fa';
import getRecords from '@/entities/AI/api/getRecord';
import getDiagnosisList from '@/entities/Pet/api/getDiagnosisList';
import { useTranslation } from "react-i18next";
import { TopTitle } from '@/shared/components/ui';
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

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

    type RecordItem = {
        diagnosisAt: string;
        petName: string;
        type: string;
        details: {
        label: string;
        probability: number;
        }[];
    };
    const [records, setRecords] = useState<RecordItem[]>([]);

    const petData = location.state as { id: string };
    const [id] = useState<string>(petData?.id || '');

    // 날짜 필터 state
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

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

  // 페이지 최초 로드시 모든 기록 조회 & 필터 옵션 조회
    useEffect(() => {
        const fetchAllRecords = async () => {
        setLoading(true);
        try {
            const allRecords = await getDiagnosisList(id);
            if (allRecords && Array.isArray(allRecords)) {
            setRecords(allRecords);
            } else {
            setRecords([]);
            }
        } catch (error) {
            console.error('Failed to fetch records:', error);
            setModal(t("ai_page.Failed_to_load_records._Please_try_again_later."));
        } finally {
            setLoading(false);
        }
        };

        const fetchFilterOptions = async () => {
        try {
            const filters = await getRecords(navigate);

            // null 체크와 배열 여부를 함께 확인
            if (filters && Array.isArray(filters)) {
            // filter.record가 string인지 확인
            const filterLabels = filters
                .map((filter) => {
                if (typeof filter?.record === "string") {
                    return filter.record;
                }
                return null;
                })
                .filter((item) => item !== null) as string[];

            setFilterOptions(["All", ...new Set(filterLabels)]);
            } else {
            setFilterOptions(["All"]);
            }
        } catch (error) {
            console.error('Failed to fetch filter options:', error);
            setModal(t("ai_page.Failed_to_load_filter_options._Please_try_again_later."));
        }
        };

        fetchAllRecords();
        fetchFilterOptions();
    }, [id, navigate, t]);

    // 필터 변경 시 기록 조회
    useEffect(() => {
        const fetchFilteredRecords = async () => {
        playSfx(Audios.button_click);
        setLoading(true);
        if (id) {
            try {
            // 예: selectedFilter: "All" 이면 null 처리
            const record = selectedFilter === 'All' ? null : selectedFilter;
            const filteredRecords = await getDiagnosisList(id);

            if (filteredRecords && Array.isArray(filteredRecords)) {
                // 1) 우선 전체 리스트를 불러온 후
                let result = filteredRecords as RecordItem[];

                // 2) selectedFilter로 1차 필터 (원하는 로직으로 수정)
                if (record) {
                // 필터 로직 예시 (record와 일치하는 어떤 조건?)
                // result = result.filter(r => r.someProperty === record);
                }

                // 3) typeFilter로 2차 필터 (DENTAL_REAL / DENTAL_X_RAY)
                if (typeFilter !== 'All') {
                result = result.filter(r => r.type === typeFilter);
                }

                setRecords(result);
            } else {
                setRecords([]);
            }
            } catch (error) {
            console.error('Failed to fetch filtered records:', error);
            setModal(t("ai_page.Failed_to_load_records._Please_try_again_later."));
            } finally {
            setLoading(false);
            }
        }
        };

        fetchFilteredRecords();
    }, [selectedFilter, typeFilter, id, playSfx, t]);

    // 글자수를 17글자로 제한
    const truncateText = (text: string, maxLength: number) => {
        if (typeof text !== "string") {
        return "";
        }
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    // 에러 모달
    const setModal = (text: string) => {
        setOpen(true);
        setModalText(text);
    };

    const handleNavigateToDetail = (record: RecordItem) => {
        playSfx(Audios.button_click);
        navigate('/diagnosis-detail', {
        state: {
            result: record.details,
            description: record.type === "DENTAL_REAL" ? record.details : "",
        },
        });
    };

    return (
        <div className="flex flex-col items-center text-white px-6 min-h-screen">
        <TopTitle title={t("ai_page.Records")} back={true} />

        {/* "range" 텍스트 왼쪽 / 필터 2개 오른쪽 */}
        <div className="flex items-center justify-between w-full mt-4">            
            <div className="flex items-center space-x-3">
            {/* 첫 번째 필터 */}
            <div className="relative w-[120px]">
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

            {/* 두 번째 필터 (타입 필터) */}
            <div className="relative w-[140px]">
                <select
                    className="text-black p-2 rounded-full bg-white pr-6 pl-6 appearance-none w-full text-sm font-normal"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    >
                    <option value="All">All</option>
                    <option value="DENTAL_REAL">DENTAL_REAL</option>
                    <option value="DENTAL_X_RAY">DENTAL_X_RAY</option>
                </select>
                <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black pointer-events-none" />
            </div>
            </div>
        </div>

        {/* 날짜 범위 선정 */}
        <div className="flex items-center gap-4 mt-4 w-full">
            {/* 왼쪽에 range 텍스트 */}
            <p className="text-lg font-medium">{t("reward_page.range")}</p>
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

        {loading ? (
            <div className="flex justify-center items-center h-64 min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            </div>
        ) : (
            <div className="w-full mt-8">
                {records.map((record, index) => {
                    // details 배열의 label(probability%) 합치기
                    const detailDisplay = record.details
                    ? record.details.map(detail => `${detail.label}(${detail.probability}%)`).join(', ')
                    : '';

                    return (
                    <div
                        key={index}
                        className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center"
                        onClick={() => handleNavigateToDetail(record)}
                    >
                        <div>
                        <p className="font-semibold text-base">
                            {/* 예: 2025-01-23  DENTAL_REAL */}
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
