import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { TopTitle } from '@/shared/components/ui';


const InviteFriendsList: React.FC = () => {

    return (
        <div className="flex flex-col items-center text-white mx-6 relative min-h-screen pb-32">
            {/* 상단 타이틀 */}
            <TopTitle title="Invite Friends List" back={true} />

        </div>
    );
};

export default InviteFriendsList;