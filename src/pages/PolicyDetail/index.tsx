import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { TopTitle } from '@/shared/components/ui';

const PolicyDetailPage: React.FC = () => {
  const [iframeHeight, setIframeHeight] = useState<string>("0px");
  const iframeSrc = "/policies/personalInfo.html";

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

  return(
      <div className="flex flex-col items-center bg-transparent text-white mx-6 min-h-screen">
          <TopTitle title="Policy" back={true} />

          {/* 정책 내용 */}
          <div className="w-full">
            <iframe
              src={iframeSrc}
              title="Policy Detail"
              style={{
                border: "none",
                width: "100%",
                height: iframeHeight, // 동적으로 높이 설정
              }}
            />
          </div>
          <div className="mb-8"> </div>
      </div>
  );
};

export default PolicyDetailPage;