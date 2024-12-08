import './AIMenu.css';
import Images from '@/shared/assets/images';
import useMainPageStore from '@/shared/store/useMainPageStore';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect  } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { useTranslation } from "react-i18next";
import useUserStore from "@/shared/store/useInfoStore";
import LoadingSpinner from '@/shared/components/ui/loadingSpinner';

interface AIMenuProps {
  title: string;
  alt: string;
  image: string;
  onClick: () => void;
  className: string;
}

const AIMenus: React.FC<AIMenuProps> = ({
  title,
  alt,
  image,
  className,
  onClick,
}) => {
  return (
    <div
      className={`flex flex-col rounded-3xl aspect-square items-center justify-center gap-3 ${
        className && className
      }`}
      onClick={onClick}
      >
      <img src={image} alt={alt} className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain" />
      <div className="flex flex-col items-center justify-center">
        <p className="text-sm md:text-xl lg:text-2xl font-semibold text-center px-2">{title}</p>
      </div>
    </div>
  );
};


const AIMenu: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const setSelectedMenu = useMainPageStore((state) => state.setSelectedMenu);
  const {slToken} = useUserStore(); // 사용자가 보유한 SL토큰 수
  const [loading, setLoading] = useState(true);

  // 모달 초기 상태를 LocalStorage 확인 후 설정
  const [showModal, setShowModal] = useState(() => {
    return !localStorage.getItem('modalDisplayed');
  });

  const handleCloseModal = () => {
    setShowModal(false);
    localStorage.setItem('modalDisplayed', 'true'); // 모달 표시 여부 기록
  };

  // 각 메뉴 클릭 시 전역 상태 설정 후 반려동물 선택 페이지로 이동
  const handleMenuClick = (menu: 'x-ray' | 'ai-analysis' | 'records') => {
    // x-ray 또는 ai-analysis 선택 시 전역 상태에 저장 후 반려동물 선택 페이지로 이동
    setSelectedMenu(menu);
    navigate('/select-pet');
  };

  // 페이지 진입 후 0.2초 뒤 loading을 false로 변경
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200); 
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    // 로딩 중일 때는 로딩스피너만 보여줌
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col text-white mx-6 md:mx-28 min-h-screen">
      <div 
        className="flex items-center w-full mt-8 relative"
        onClick={()=> navigate('/reward-history')}>
        <img
          src={Images.SLToken}
          alt="Star"
          className="w-6 h-6 mr-2"
          />
        <p className="text-lg font-semibold mr-2">{slToken} SL</p>
        <FaChevronRight className="text-lg cursor-pointer" />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        {/* 실사진 진단 */}
        <AIMenus
          title={t("ai_page.AI_based_examination_for_pets")}
          image={Images.HomeTooth}
          alt="HomeTooth"
          className="follow-on-x-mission-card"
          onClick={() => handleMenuClick('ai-analysis')}
        />
        {/* x-ray 이미지 진단 */}
        <AIMenus
          title={t("ai_page.AI_based_dental_X_ray_analysis")}
          image={Images.HomeXray}
          alt="HomeXray"
          className="join-telegram-mission-card"
          onClick={() => handleMenuClick('x-ray')}
        />
        {/* 진단 목록 */}
        <AIMenus
          title={t("ai_page.Viewing_Records")}
          image={Images.HomeReport}
          alt="HomeReport"
          className="join-the-sl-discord-mission-card"
          onClick={() => handleMenuClick('records')}
        />
        </div>
      <br /> <br /> <br /> <br />
      <br />


      {/* SL토큰 소요 알림 모달창 */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white text-black p-6 rounded-lg text-center">
                <p>{t("ai_page.10SL_tokens")}</p>
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                    onClick={handleCloseModal}
                    >
                    {t("OK")}
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default AIMenu;
