import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Images from "@/shared/assets/images";
import { useTranslation } from "react-i18next";
import { TopTitle } from '@/shared/components/ui';

const DiagnosisDetail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // description까지 받아오기
    const { img, result, description } = location.state as {
      img: string;
      result: string;
      description?: string;
    };

    // 기존 state
    const [label] = useState<string>(result || '');
    const [imageUrl] = useState<string>(img || '');
    const [showFullText, setShowFullText] = useState(false);

    return (
        // 1) 부모 컨테이너: relative + min-h-screen
        <div className="relative flex flex-col items-center text-white mx-6 md:mx-28 min-h-screen">
            
            {/* 2) 스크롤 영역: flex-1, overflow-y-auto, 하단 버튼과 겹치지 않도록 pb-36 등으로 충분히 여백 */}
            <div className="flex-1 w-full overflow-y-auto pb-36">
                
                <TopTitle title={t("ai_page.Record_Details")} back={true} />

                {/* 이미지 표시 영역 */}
                <div className="mt-6 w-full max-w-sm lg:max-w-md mx-auto rounded-2xl overflow-hidden p-2 flex flex-col items-center">
                    <div className="w-[240px] h-[240px] md:w-[400px] md:h-[400px] lg:w-[400px] lg:h-[400px] bg-gray-600 rounded-2xl flex items-center justify-center">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="Diagnosis Result"
                                className="w-full h-full object-cover rounded-2xl"
                            />
                        ) : (
                            <div className="text-lg">{t("ai_page.Loading_image...")}</div>
                        )}
                    </div>
                </div>

                <div className="w-full">
                    <div
                        id="label-container"
                        className="mt-4 text-base md:text-xl lg:text-2xl font-semibold"
                    >
                        <p>
                            {t("ai_page.Analysis_results")}: {label}
                        </p>
                    </div>

                    <div className="mt-4 p-4 bg-gray-800 text-white rounded-xl shadow-md max-w-2xl lg:max-w-3xl mx-auto">
                        {description ? (
                            <p
                                className="overflow-hidden text-sm md:text-base lg:text-lg font-normal"
                                style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: showFullText ? undefined : 3,
                                    WebkitBoxOrient: "vertical",
                                }}
                            >
                                {description}
                            </p>
                        ) : (
                            <p
                                className="overflow-hidden text-sm md:text-base lg:text-lg font-normal"
                                style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: showFullText ? undefined : 3,
                                    WebkitBoxOrient: "vertical",
                                }}
                            >
                                {t(`ai_page.reuslts.symptoms_of_${label.replace(/ /g, "_").toLowerCase()}`) ||
                                t("ai_page.Diagnosis_information_not_available.")}
                            </p>
                        )}

                        <div className="flex justify-center mt-2">
                            {!showFullText ? (
                                <button
                                    className="mt-2 w-1/2 text-black text-base md:text-lg lg:text-xl font-semibold py-2 px-4 rounded-xl"
                                    style={{ backgroundColor: "#FFFFFF" }}
                                    onClick={() => setShowFullText(true)}
                                >
                                    {t("ai_page.See_more")}
                                </button>
                            ) : (
                                <button
                                    className="mt-2 w-1/2 text-black text-base md:text-lg lg:text-xl font-semibold py-2 px-4 rounded-xl"
                                    style={{ backgroundColor: "#FFFFFF" }}
                                    onClick={() => setShowFullText(false)}
                                >
                                    {t("ai_page.See_less")}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 
              3) 하단 고정 버튼 (absolute)
              스크롤 영역이 커져도 버튼은 화면 하단에 고정되어, 텍스트가 뒤로 넘어가지 않음 
            */}
            <div className="w-11/12 max-w-md absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <button
                    className="w-full py-4 rounded-full text-lg font-semibold"
                    style={{ backgroundColor: '#0147E5' }}
                    onClick={() => navigate('/AI-menu')}
                >
                    {t("ai_page.Home")}
                </button>
            </div>
        </div>
    );
};

export default DiagnosisDetail;
