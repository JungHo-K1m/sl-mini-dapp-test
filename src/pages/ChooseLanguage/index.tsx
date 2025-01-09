import React from 'react';
import { useNavigate } from 'react-router-dom';
import i18n from "@/shared/lib/il8n";
import { TopTitle } from '@/shared/components/ui';
import { FaChevronLeft } from 'react-icons/fa';
import { useTranslation } from "react-i18next";


const LanguagePage: React.FC =() => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleChooseLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        navigate('/setting-page');
    };


    return(
        <div className="flex flex-col items-center text-white px-6 min-h-screen">
            <TopTitle title="Settings" back={true} />

            <div className="w-full">
                {/* 영어 선택 */}
                <div 
                    className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center"
                    onClick={() => handleChooseLanguage("en")}>
                    <div>
                        <p className="font-semibold">English</p>
                    </div>
                    <FaChevronLeft className="text-lg cursor-pointer transform rotate-180" />
                </div>
                {/* 일본어 선택 */}
                <div 
                    className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center"
                    onClick={() => handleChooseLanguage("ja")}>
                    <div>
                        <p className="font-semibold">Japanese</p>
                    </div>
                    <FaChevronLeft className="text-lg cursor-pointer transform rotate-180" />
                </div>
                {/* 대만어 선택 */}
                <div 
                    className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center"
                    onClick={() => handleChooseLanguage("zh")}>
                    <div>
                        <p className="font-semibold">Taiwanese</p>
                    </div>
                    <FaChevronLeft className="text-lg cursor-pointer transform rotate-180" />
                </div>
                {/* 태국어 선택 */}
                <div 
                    className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center"
                    onClick={() => handleChooseLanguage("th")}>
                    <div>
                        <p className="font-semibold">Thai</p>
                    </div>
                    <FaChevronLeft className="text-lg cursor-pointer transform rotate-180" />
                </div>
            </div>
        </div>
    );
};

export default LanguagePage;