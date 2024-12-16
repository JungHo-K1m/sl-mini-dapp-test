import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TopTitle } from '@/shared/components/ui';

const PolicyDetailPage: React.FC = () => {


    return(
        <div className="flex flex-col items-center text-white mx-6 min-h-screen">
            <TopTitle title="Policy" back={true} />

        </div>
    );
};

export default PolicyDetailPage;