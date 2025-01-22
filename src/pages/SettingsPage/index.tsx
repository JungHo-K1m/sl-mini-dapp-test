import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TopTitle } from '@/shared/components/ui';
import { FaChevronLeft } from 'react-icons/fa';
import { useTranslation } from "react-i18next";
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";


const SettingsPage: React.FC =() => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { playSfx } = useSound();

    // navigate에 policyType을 전달
    const handleNavigation = (policyType: string) => {
        playSfx(Audios.button_click);
        navigate('/policy-detail', { state: { policyType } });
    };

    const handleLanguage = () => {
        playSfx(Audios.button_click);
        navigate('/choose-language');
    };

    const handleSound = () => {
        playSfx(Audios.button_click);
        navigate('/sound-setting');
    };

    // const handleLanguage = () => {
    //     const { playSfx } = useSound();
    //     navigate("");
    // };


    return(
        <div className="flex flex-col items-center text-white px-6 min-h-screen">
            <TopTitle title="Settings" back={true} />

            <div className="w-full">
                {/* 서비스 이용 약관 */}
                <div 
                    className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center"
                    onClick={() => handleNavigation('service')}>
                    <div>
                        <p className="font-semibold">{t("setting.terms_of_service")}</p>
                    </div>
                    <FaChevronLeft className="text-lg cursor-pointer transform rotate-180" />
                </div>
                {/* 개인정보 처리 방침 */}
                <div 
                    className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center"
                    onClick={() => handleNavigation('privacy')}>
                    <div>
                        <p className="font-semibold">{t("setting.privacy_policy")}</p>
                    </div>
                    <FaChevronLeft className="text-lg cursor-pointer transform rotate-180" />
                </div>
                {/* 전자상거래 이용약관 */}
                <div 
                    className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center"
                    onClick={() => handleNavigation('commerce')}>
                    <div>
                        <p className="font-semibold">{t("setting.electronic_commerce_policy")}</p>
                    </div>
                    <FaChevronLeft className="text-lg cursor-pointer transform rotate-180" />
                </div>
                {/* 개인정보 수집 */}
                {/* <div 
                    className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center"
                    onClick={() => handleNavigation('personal')}>
                    <div>
                        <p className="font-semibold">Collecting Personal Information</p>
                    </div>
                    <FaChevronLeft className="text-lg cursor-pointer transform rotate-180" />
                </div> */}
                {/* <div 
                    className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center"
                    onClick={() => navigate('/sdk-test')}>
                    <div>
                        <p className="font-semibold">sdk-test</p>
                    </div>
                    <FaChevronLeft className="text-lg cursor-pointer transform rotate-180" />
                </div> */}
                <div 
                    className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center"
                    onClick={handleLanguage}>
                    <div>
                        <p className="font-semibold">{t("setting.language")}</p>
                    </div>
                    <FaChevronLeft className="text-lg cursor-pointer transform rotate-180" />
                </div>
                <div 
                    className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center"
                    onClick={handleSound}>
                    <div>
                        <p className="font-semibold">{t("setting.sound")}</p>
                    </div>
                    <FaChevronLeft className="text-lg cursor-pointer transform rotate-180" />
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;