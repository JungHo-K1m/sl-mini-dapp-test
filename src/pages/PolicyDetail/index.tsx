import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { TopTitle } from "@/shared/components/ui";
import LoadingSpinner from "@/shared/components/ui/loadingSpinner";

const PolicyDetailPage: React.FC = () => {
  const location = useLocation();
  const [iframeHeight, setIframeHeight] = useState<string>("0px");
  const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 상태 추가

  // 전달된 정책 타입을 가져옴
  const policyType = location.state?.policyType || 'service';

  // 정책 타입에 따라 HTML 파일 경로 설정
  const policyFiles: { [key: string]: string } = {
      service: "/policies/termsOfService.html",
      privacy: "/policies/privacyPolicy.html",
      commerce: "/policies/electronicCommerce.html",
      // personal: "/policies/personalInfo.html",
  };

  const iframeSrc = policyFiles[policyType] || policyFiles.service;

  useEffect(() => {
    const handleResizeMessage = (event: MessageEvent) => {
      if (event.data?.type === "resizeIframe" && event.data.height) {
        setIframeHeight(`${event.data.height}px`);
      }
    };

    window.addEventListener("message", handleResizeMessage);

    return () => {
      window.removeEventListener("message", handleResizeMessage);
    };
  }, []);

  // iframe 로드 완료 시 로딩 상태 해제
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center bg-transparent text-white px-6 min-h-screen mb-5">
      <TopTitle title="Policy" back={true} />

      {/* 로딩 스피너 표시 */}
      {isLoading && (
        <div className="flex justify-center items-center w-full h-screen">
          <LoadingSpinner size={20} color="#4A90E2" duration={0.8} className="h-screen"/>
        </div>
      )}

      {/* iframe */}
      <div
        className="w-full"
        style={{
          display: isLoading ? "none" : "block", // 로딩 중에는 iframe 숨김
        }}
      >
        <iframe
          src={iframeSrc}
          title="Policy Detail"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          onLoad={handleIframeLoad} // iframe 로드 완료 시 호출
          style={{
            border: "none",
            width: "100%",
            height: iframeHeight,
          }}
        />
      </div>

      {/* 추가 여백 */}
      <div className="w-full h-5"></div>
    </div>
  );
};

export default PolicyDetailPage;
