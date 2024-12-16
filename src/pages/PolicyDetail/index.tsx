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
        <div className="flex flex-col items-center text-white mx-6 min-h-screen">
            <TopTitle title="Policy" back={true} />

            {/* 정책 내용 */}
            <div
                className="text-white mx-4 mt-4"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
};

export default PolicyDetailPage;