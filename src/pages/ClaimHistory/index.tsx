import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TopTitle } from '@/shared/components/ui';
import { FaChevronRight } from "react-icons/fa";
import LoadingSpinner from '@/shared/components/ui/loadingSpinner';

const ClaimHistory: React.FC = () => {
    const navigate = useNavigate();

    // 더미 데이터
    const claimHistory = [
        { id: 1, token: "SL Token", amount: "150SL", date: "17 Oct 2024 14:30", status: "Completed" },
        { id: 2, token: "USDC", amount: "50.00USDC", date: "17 Oct 2024 14:30", status: "Pending" },
        { id: 3, token: "USDC", amount: "50.00USDC", date: "17 Oct 2024 14:30", status: "Failed" },
    ];

    // 상태 색상 결정 함수
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed":
                return "bg-green-500 text-white";
            case "Pending":
                return "bg-yellow-500 text-black";
            case "Failed":
                return "bg-red-500 text-white";
            default:
                return "bg-gray-500 text-white";
        }
    };

    return (
        <div className="flex flex-col items-center text-white mx-6 relative min-h-screen pb-32">
            {/* 상단 타이틀 */}
            <TopTitle title="Claim History" back={true} />

            {/* 히스토리 목록 */}
            <div className="w-full mt-6">
                {claimHistory.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between py-3 border-b border-gray-700 cursor-pointer"
                        onClick={() => navigate(`/claim-details/${item.id}`)}
                    >
                        <div>
                            <p className="text-lg font-medium">{item.token}</p>
                            <p className="text-xs font-normal text-gray-400">{item.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="text-lg font-semibold">{item.amount}</p>
                            <span className={`px-3 py-1 h-5 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                                {item.status}
                            </span>
                            <FaChevronRight className="ml-1 w-5 h-5" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClaimHistory;
