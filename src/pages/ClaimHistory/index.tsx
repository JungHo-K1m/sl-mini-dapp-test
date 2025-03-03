// ClaimHistory.tsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TopTitle } from "@/shared/components/ui";
import getClaimHistory from "@/entities/Asset/api/getClaimHistory";

const ClaimHistory: React.FC = () => {
  const { t } = useTranslation();
  
  const [claimHistory, setClaimHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // API 호출: 페이지 진입 시 첫 페이지의 클래임 내역을 불러옴
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // 페이지 번호 0으로 호출 (추후 페이징 처리 가능)
        const data = await getClaimHistory(0);
        // API 응답 예시에서 claim 내역은 data.content 배열에 담겨 있음
        setClaimHistory(data.content);
      } catch (error) {
        console.error("Error fetching claim history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // 날짜 포맷 함수: 요청일시(requestedAt)를 로컬 날짜 문자열로 변환
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // 상태에 따른 라벨과 클래스명을 반환하는 함수
  const getStatusInfo = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return {
          label: t("asset_page.claim.claim_completed"),
          className: "bg-[#DCFCE7] text-[#166534]",
        };
      case "PENDING":
        return {
          label: t("asset_page.claim.claim_pending"),
          className: "bg-[#FEF9C3] text-[#713F12]",
        };
      case "FAILED":
        return {
          label: t("asset_page.claim.claim_failed"),
          className: "bg-[#FEE2E2] text-[#991B1B]",
        };
      default:
        return {
          label: t("asset_page.claim.claim_waiting"),
          className: "bg-gray-500 text-white",
        };
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">{t("Loading...")}</div>;
  }

  return (
    <div className="flex flex-col items-center text-white mx-6 relative min-h-screen pb-32">
      {/* 상단 타이틀 및 뒤로가기 버튼 */}
      <TopTitle title={t("asset_page.claim.claim_history")} back={true} />

      {/* 클래임 내역 목록 */}
      <div className="w-full">
        {claimHistory.length > 0 ? (
          claimHistory.map((item) => {
            const { label, className } = getStatusInfo(item.status);
            return (
              <div
                key={item.id}
                className="flex items-center justify-between py-3 border-b border-gray-700 cursor-pointer"
              >
                <div>
                  <p className="text-lg font-normal">
                    {item.claimType} Token
                  </p>
                  <p className="text-xs font-normal text-gray-400">
                    {formatDate(item.requestedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <p className="text-lg font-semibold">
                      {item.amount} {item.claimType}
                    </p>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${className}`}>
                      {label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-sm text-gray-400">
            {t("asset_page.no_records") || "No records found"}
          </p>
        )}
      </div>
    </div>
  );
};

export default ClaimHistory;
