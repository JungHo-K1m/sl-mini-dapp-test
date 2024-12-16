import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { TopTitle } from '@/shared/components/ui';

const PolicyDetailPage: React.FC = () => {
    const [content, setContent] = useState<string>("");
  
    // HTML 파일 불러오기
    useEffect(() => {
      const fetchContent = async () => {
        try {
          const response = await fetch("/policies/personalInfo.html");
          const htmlContent = await response.text();
          setContent(htmlContent);
        } catch (error) {
          console.error("Failed to load policy content:", error);
        }
      };
  
      fetchContent();
    }, []);


    return(
        <div 
            className="flex flex-col items-center bg-transparent text-white mx-0 p-0 min-h-screen w-screen"
            style={{
                margin: 0,
                padding: 0,
                border: "none",
                background: "transparent",
              }}>
            <TopTitle title="Policy" back={true} />

            {/* 정책 내용 */}
            <div
                className="w-full bg-transparent p-4"
                style={{
                    background: "transparent",
                    margin: 0,
                    padding: 0,
                    border: "none",
                    boxShadow: "none",
                }}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
};

export default PolicyDetailPage;