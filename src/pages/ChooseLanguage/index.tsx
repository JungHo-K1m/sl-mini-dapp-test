import React from 'react';
import { useNavigate } from 'react-router-dom';
import i18n from "@/shared/lib/il8n";
import { TopTitle } from '@/shared/components/ui';
import { FaChevronLeft } from 'react-icons/fa';
import { useTranslation } from "react-i18next";
import Images from '@/shared/assets/images';
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";


const LanguagePage: React.FC =() => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { playSfx } = useSound();

    const handleChooseLanguage = (lang: string) => {
      playSfx(Audios.button_click);
      i18n.changeLanguage(lang);
      navigate('/dice-event');
    };


    return(
      <div className="flex flex-col items-center text-white px-6 min-h-screen">
        <TopTitle title="Settings" back={true} />

        <div className="w-full">
        {/* 영어 선택 */}
        <div 
          className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center cursor-pointer"
          onClick={() => handleChooseLanguage("en")}
        >
          {/* 왼쪽 국기 + 텍스트 */}
          <div className="flex items-center space-x-2">
            <img 
              src={Images.en}
              alt="English Flag" 
              className="w-6 h-6 rounded-full object-cover" 
            />
            <p className="font-semibold">{t("setting.eng")}</p>
          </div>
          <FaChevronLeft className="text-lg transform rotate-180" />
        </div>

        {/* 일본어 선택 */}
        <div 
          className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center cursor-pointer"
          onClick={() => handleChooseLanguage("ja")}
        >
          <div className="flex items-center space-x-2">
            <img 
              src={Images.jp} 
              alt="Japanese Flag" 
              className="w-6 h-6 rounded-full object-cover" 
            />
            <p className="font-semibold">{t("setting.jpn")}</p>
          </div>
          <FaChevronLeft className="text-lg transform rotate-180" />
        </div>

        {/* 한국어 선택 */}
        <div 
          className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center cursor-pointer"
          onClick={() => handleChooseLanguage("ko")}
        >
          <div className="flex items-center space-x-2">
            <img 
              src={Images.ko}
              alt="Thailand Flag" 
              className="w-6 h-6 rounded-full object-cover" 
            />
            <p className="font-semibold">{t("setting.kor")}</p>
          </div>
          <FaChevronLeft className="text-lg transform rotate-180" />
        </div>

        {/* 대만어 선택 */}
        <div 
          className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center cursor-pointer"
          onClick={() => handleChooseLanguage("zh")}
        >
          <div className="flex items-center space-x-2">
            <img 
              src={Images.tw} 
              alt="Taiwan Flag" 
              className="w-6 h-6 rounded-full object-cover" 
            />
            <p className="font-semibold">{t("setting.tw")}</p>
          </div>
          <FaChevronLeft className="text-lg transform rotate-180" />
        </div>

        {/* 태국어 선택 */}
        <div 
          className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center cursor-pointer"
          onClick={() => handleChooseLanguage("th")}
        >
          <div className="flex items-center space-x-2">
            <img 
              src={Images.th}
              alt="Thailand Flag" 
              className="w-6 h-6 rounded-full object-cover" 
            />
            <p className="font-semibold">{t("setting.thi")}</p>
          </div>
          <FaChevronLeft className="text-lg transform rotate-180" />
        </div>
      </div>
    </div>
  );
};


export default LanguagePage;