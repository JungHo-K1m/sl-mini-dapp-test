import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Images from "@/shared/assets/images";
import { useTranslation } from "react-i18next";

const DiagnosisDetail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const resultData = location.state as { img: string, result: string };
    const [label] = useState<string>(resultData?.result || ''); // 진단명
    const [imageUrl] = useState<string>(resultData?.img || ''); // 진단 이미지
    const [showFullText, setShowFullText] = useState(false);

    return (
        <div className="flex flex-col items-center text-white mx-6 md:mx-28  min-h-screen">
            <div className="flex items-center w-full mt-4 relative">
                <img
                    src={Images.goback}
                    alt="Go Back"
                    className="w-8 h-8 cursor-pointer absolute left-0"
                    onClick={() => navigate(-1)}
                />
                <h1 className="text-2xl mx-auto font-semibold">{t("ai_page.Record_Details")}</h1>
            </div>

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
                <div id="label-container" className="mt-4 text-lg md:text-xl lg:text-2xl font-semibold">
                    {/* 진단 결과 라벨 번역 */}
                    <p>
                        {t("ai_page.Analysis_results")}: {t(`ai_page.reuslts.${label}`)}
                    </p>
                </div>

                <div className="mt-4 p-4 bg-gray-800 text-white rounded-xl shadow-md max-w-2xl lg:max-w-3xl mx-auto">
                    <p
                        className="overflow-hidden text-sm md:text-base lg:text-lg"
                        style={{
                            display: "-webkit-box",
                            WebkitLineClamp: showFullText ? undefined : 3,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {t(`ai_page.reuslts.symptoms_of_${label.replace(/ /g, "_").toLowerCase()}`) ||
                            t("ai_page.Diagnosis_information_not_available.")}
                    </p>
                    <div className="flex justify-center mt-2">
                        {!showFullText && (
                            <button
                                className="mt-2 w-1/2 text-black text-base md:text-lg lg:text-xl font-semibold py-2 px-4 rounded-xl"
                                style={{ backgroundColor: "#FFFFFF" }}
                                onClick={() => setShowFullText(true)}
                            >
                                {t("ai_page.See_more")}
                            </button>
                        )}
                        {showFullText && (
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
            
            <div className="w-11/12 max-w-md absolute bottom-16 left-1/2 transform -translate-x-1/2">
                <button
                    className="w-full py-4 rounded-full text-lg font-semibold"
                    style={{backgroundColor: '#0147E5'}}
                    onClick={() => navigate('/AI-menu')}
                    >
                    {t("ai_page.Home")}
                </button>
            </div>
        </div>
    );
};

export default DiagnosisDetail;
