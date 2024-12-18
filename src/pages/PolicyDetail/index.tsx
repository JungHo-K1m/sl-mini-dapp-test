import React, { useEffect, useState } from "react";
import { TopTitle } from "@/shared/components/ui";

const PolicyDetailPage: React.FC = () => {
  const [iframeHeight, setIframeHeight] = useState<string>("0px");
  const iframeSrc = "/policies/personalInfo.html";

  useEffect(() => {
    const handleResizeMessage = (event: MessageEvent) => {
      if (event.data?.type === "resizeIframe" && event.data.height) {
        const newHeight = `${event.data.height + 16}px`; // 동적 높이 + 여백
        if (newHeight !== iframeHeight) {
          setIframeHeight(newHeight); // 높이가 변경된 경우에만 업데이트
        }
      }
    };

    window.addEventListener("message", handleResizeMessage);

    return () => {
      window.removeEventListener("message", handleResizeMessage);
    };
  }, [iframeHeight]);

  return (
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
            height: iframeHeight,
          }}
        />
      </div>
    </div>
  );
};

export default PolicyDetailPage;
