import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronDown } from 'react-icons/fa';
import getRecords from '@/entities/AI/api/getRecord';
import getDiagnosisList from '@/entities/Pet/api/getDiagnosisList';
import { useTranslation } from "react-i18next";
import { TopTitle } from '@/shared/components/ui';
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";

const DiagnosisRecords: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { playSfx } = useSound();

    const [open, setOpen] = useState(false);
    const [modalText, setModalText] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<string>('All');
    const [filterOptions, setFilterOptions] = useState<string[]>(['All']);
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

    // 페이지 최초 로드시 모든 기록 조회
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
                setLoading(false); // 로딩 상태 비활성화
            }
        };

        const fetchFilterOptions = async () => {
            try {
              const filters = await getRecords(navigate);
          
              // null 체크와 배열 여부를 함께 확인
              if (filters && Array.isArray(filters)) {
                // filter.record가 실제로 string인지 다시 한 번 검증
                const filterLabels = filters
                  .map((filter) => {
                    if (typeof filter?.record === "string") {
                      return filter.record;
                    } else {
                      // record 필드가 문자열이 아니면 null 처리 또는 기본 문자열로 대체
                      return null;
                    }
                  })
                  .filter((item) => item !== null);
              
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
    }, [id]);

    // 필터 변경 시 기록 조회
    useEffect(() => {
        const fetchFilteredRecords = async () => {    
            playSfx(Audios.button_click);
            setLoading(true);
            if (id) {
                try {
                    const record = selectedFilter === 'All' ? null : selectedFilter;
                    const filteredRecords = await getDiagnosisList(id);
                    if (filteredRecords && Array.isArray(filteredRecords)) {
                        setRecords(filteredRecords);
                    } else {
                        setRecords([]); // 빈 배열로 설정하여 오류 방지
                    }
                } catch (error) {
                    console.error('Failed to fetch filtered records:', error);
                    setModal(t("ai_page.Failed_to_load_records._Please_try_again_later."));
                } finally {
                    setLoading(false); // 로딩 상태 비활성화
                }
            }
        };

        fetchFilteredRecords();
    }, [selectedFilter, id]);

    // 글자수를 17글자로 제한하고 넘으면 "..." 붙이기
    const truncateText = (text: string, maxLength: number) => {
        if (typeof text !== "string") {
            // 예외 처리: 문자열이 아닐 때 기본 값 혹은 공백 처리
            return "";
        }

        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    // 에러 확인 후, 확인 버튼
    const checkError = () => {
        setOpen(false);
    }

    const setModal = (text: string) => {
        setOpen(true);
        setModalText(text);
    }

    const handleNavigateToDetail = (record: typeof records[number]) => {
        playSfx(Audios.button_click);
        navigate('/diagnosis-detail', {
            state: {
                // img: record.diagnosisImgUrl,
                result: record.details,
                // DENTAL_REAL일 때만 description을 전달
                description: record.type === "DENTAL_REAL" ? record.details : "",
            },
        });
    };


    return (
        <div className="flex flex-col items-center text-white px-6 min-h-screen">
            <TopTitle title={t("ai_page.Records")} back={true} />

            {/* 필터링 버튼 */}
            <div className="flex justify-start w-full h-11 relative">
                <div className="relative w-1/2 max-w-xs"> {/* 너비를 절반으로 조정 */}
                    <select
                        className="text-black p-2 rounded-full bg-white pr-6 pl-6 appearance-none w-full text-sm font-normal"
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                        {filterOptions.map((option, index) => (
                            <option key={index} value={option}>
                                {truncateText(option, 17)} {/* 옵션 글자수 제한 */}
                            </option>
                        ))}
                    </select>
                    <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black pointer-events-none" />
                </div>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center h-64 min-h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
                </div>
            ) : (
                <div className="w-full mt-8">
                    {records.map((record, index) => {
                    // details 배열이 있는지 확인 후, label(probability%) 형태로 이어 붙이기
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
                            {/* 예: 2025-01-23  DENTAL_REAL */}
                            <p className="font-semibold text-base">
                            {`${record.diagnosisAt}  ${record.type}`}
                            </p>
                            {/* details의 label과 probability를 붙여서 표시 */}
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

            {/* api 에러 발생 시 모달창  */}
            {open && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white text-black p-6 rounded-lg text-center">
                        <div> &nbsp;</div>
                        <p>{modalText}</p>
                        <div> &nbsp;</div>
                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                            onClick={()=>{
                                playSfx(Audios.button_click);
                                setOpen(false);
                            }}>
                            {t("OK")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiagnosisRecords;
