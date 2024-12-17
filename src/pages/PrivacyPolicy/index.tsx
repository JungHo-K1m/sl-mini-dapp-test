import React from "react";
import { TopTitle } from '@/shared/components/ui';

const PrivacyPolicy: React.FC = () => {

    return (
        <div className="flex flex-col items-center bg-transparent text-white mx-6 min-h-screen">
            <TopTitle title="Policy" back={true} />

            
            {/* 본문 내용 */}
            <div className="text-left w-full mt-4">
                <p className="text-xl font-semibold">Privacy Policy</p><br />
                
            </div>
        </div>
    );
};

export default PrivacyPolicy;