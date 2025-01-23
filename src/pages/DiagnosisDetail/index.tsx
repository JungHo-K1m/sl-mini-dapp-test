import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { TopTitle } from '@/shared/components/ui';
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";

type DetailItem = {
  label: string;
  probability: number;
  description: string;
  caution: string;
};

const DiagnosisDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { playSfx } = useSound();

  // 배열 형태로 수신
  const { img, result, description } = location.state as {
    img: string;
    result: string;
    description: DetailItem[];
  };

  const [showFullText, setShowFullText] = useState(false);

  const handleGoHome = () => {
    playSfx(Audios.button_click);
    navigate('/AI-menu');
  }

  return (
    <div className="relative flex flex-col items-center text-white mx-6 md:mx-28 min-h-screen">
      <div className="flex-1 w-full overflow-y-auto pb-6">
        <TopTitle title={t("ai_page.Record_Details")} back={true} />

        {/* 이미지 표시 */}
        <div className="mt-6 w-full max-w-sm lg:max-w-md mx-auto rounded-2xl overflow-hidden p-2 flex flex-col items-center">
          <div className="w-[240px] h-[240px] md:w-[400px] md:h-[400px] lg:w-[400px] lg:h-[400px] bg-gray-600 rounded-2xl flex items-center justify-center">
            {img ? (
              <img
                src={img}
                alt="Diagnosis Result"
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <div className="text-lg">{t("ai_page.Loading_image...")}</div>
            )}
          </div>
        </div>

        {/* 결과 라벨 */}
        <div className="mt-4 text-base md:text-xl lg:text-2xl font-semibold">
          <p>
            {t("ai_page.Analysis_results")}: {result}
          </p>
        </div>

        {/* 배열 형태의 details(=description) 표시 */}
        <div className="mt-4 p-4 bg-gray-800 text-white rounded-xl shadow-md max-w-2xl lg:max-w-3xl mx-auto">
          {Array.isArray(description) && description.length > 0 ? (
            <>
              {description.map((item, idx) => (
                <div key={idx} className="mb-4">
                  <p className="font-semibold text-base">
                    {item.label} ({Math.round(item.probability)}%)
                  </p>
                  <p
                    className={`overflow-hidden text-sm ${
                      showFullText ? "" : "line-clamp-3"
                    }`}
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: showFullText ? undefined : 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.description}
                  </p>
                  {item.caution && (
                    <p className="text-sm text-red-300 mt-1">
                      {item.caution}
                    </p>
                  )}
                </div>
              ))}

              {/* “See more / See less” 버튼 */}
              <div className="flex justify-center mt-2">
                <button
                  className="mt-2 w-1/2 text-black font-semibold py-2 px-4 rounded-xl"
                  style={{ backgroundColor: "#FFFFFF" }}
                  onClick={() => setShowFullText(!showFullText)}
                >
                  {showFullText ? t("ai_page.See_less") : t("ai_page.See_more")}
                </button>
              </div>
            </>
          ) : (
            <p>{t("ai_page.Diagnosis_information_not_available.")}</p>
          )}
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="w-11/12 max-w-md absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <button
          className="w-full py-4 rounded-full text-lg font-semibold"
          style={{ backgroundColor: '#0147E5' }}
          onClick={handleGoHome}
        >
          {t("ai_page.Home")}
        </button>
      </div>
    </div>
  );
};

export default DiagnosisDetail;
