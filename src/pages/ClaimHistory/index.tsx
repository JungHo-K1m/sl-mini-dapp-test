import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TopTitle } from '@/shared/components/ui';
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
                            <p className="text-sm font-medium">{item.token}</p>
                            <p className="text-xs text-gray-400">{item.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="text-sm font-bold">{item.amount}</p>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                                {item.status}
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClaimHistory;
