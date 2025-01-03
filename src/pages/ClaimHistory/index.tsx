import React from "react";
import { useNavigate } from "react-router-dom";
import { TopTitle } from '@/shared/components/ui';
import { FaChevronRight } from "react-icons/fa";

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
                return "bg-[#DCFCE7] text-[#166534]";
            case "Pending":
                return "bg-[#FEF9C3] text-[#713F12]";
            case "Failed":
                return "bg-[#FEE2E2] text-[#991B1B]";
            default:
                return "bg-gray-500 text-white";
        }
    };

    return (
        <div className="flex flex-col items-center text-white mx-6 relative min-h-screen pb-32">
            {/* 상단 타이틀 */}
            <TopTitle title="Claim History" back={true} />

            {/* 히스토리 목록 */}
            <div className="w-full">
                {claimHistory.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between py-3 border-b border-gray-700 cursor-pointer"
                        onClick={() => navigate(`/claim-details/${item.id}`)}
                    >
                        <div>
                            <p className="text-lg font-normal">{item.token}</p>
                            <p className="text-xs font-normal text-gray-400">{item.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end">
                                <p className="text-lg font-semibold">{item.amount}</p>
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                                    {item.status}
                                </span>
                            </div>
                            <FaChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClaimHistory;
