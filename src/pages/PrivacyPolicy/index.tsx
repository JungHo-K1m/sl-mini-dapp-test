import React from "react";
import { TopTitle } from '@/shared/components/ui';

const PrivacyPolicy: React.FC = () => {

    return (
        <div className="flex flex-col items-center bg-transparent text-white mx-6 min-h-screen">
            <TopTitle title="Policy" back={true} />

        </div>
    );
};

export default PrivacyPolicy;