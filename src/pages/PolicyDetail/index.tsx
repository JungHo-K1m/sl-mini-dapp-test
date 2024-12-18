import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { TopTitle } from '@/shared/components/ui';

const PolicyDetailPage: React.FC = () => {
  const [iframeSrc] = useState<string>("/policies/personalInfo.html");

  return(
      <div className="flex flex-col items-center bg-transparent text-white mx-6 min-h-screen">
          <TopTitle title="Policy" back={true} />

          {/* 정책 내용 */}
          <div className="w-full h-screen border border-gray-300 rounded-md">
            <iframe
              src={iframeSrc}
              title="Policy Detail"
              className="w-full h-full"
              style={{ border: "none" }}
            />
          </div>
      </div>
  );
};

export default PolicyDetailPage;