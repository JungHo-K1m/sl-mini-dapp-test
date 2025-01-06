import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TopTitle } from '@/shared/components/ui';
import { FaChevronLeft } from 'react-icons/fa';
import { useTranslation } from "react-i18next";


const SettingsPage: React.FC =() => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // navigate에 policyType을 전달
    const handleNavigation = (policyType: string) => {
        navigate('/policy-detail', { state: { policyType } });
    };


    return(
        <div className="flex flex-col items-center text-white px-6 min-h-screen">
            <TopTitle title="Settings" back={true} />

            <div className="w-full">
                {/* 서비스 이용 약관 */}
                <div 
                    className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center"
                    onClick={() => handleNavigation('service')}>
                    <div>
                        <p className="font-semibold">Terms of Service</p>
                    </div>
                    <FaChevronLeft className="text-lg cursor-pointer transform rotate-180" />
                </div>
                {/* 개인정보 처리 방침 */}
                <div 
                    className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center"
                    onClick={() => handleNavigation('privacy')}>
                    <div>
                        <p className="font-semibold">Privacy Policy</p>
                    </div>
                    <FaChevronLeft className="text-lg cursor-pointer transform rotate-180" />
                </div>
                {/* 전자상거래 이용약관 */}
                <div 
                    className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center"
                    onClick={() => handleNavigation('commerce')}>
                    <div>
                        <p className="font-semibold">Electronic Commerce Policy</p>
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
                <div 
                    className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center"
                    onClick={() => navigate('/sdk-test')}>
                    <div>
                        <p className="font-semibold">sdk-test</p>
                    </div>
                    <FaChevronLeft className="text-lg cursor-pointer transform rotate-180" />
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;