import React from 'react';
import { FaPen, FaChevronLeft } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import useMainPageStore from '@/shared/store/useMainPageStore';
import { getPetList } from '@/entities/Pet/api/getPetList';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Pet } from '@/entities/Pet/model/types';
import { useTranslation } from "react-i18next";

const SelectPet: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { selectedMenu } = useMainPageStore();
  const queryClient = useQueryClient();

  // 반려동물 목록 가져오기
  const { data: pets = [], isLoading, isError, error } = useQuery<Pet[]>({
    queryKey: ['petList'],
    queryFn: getPetList,
  });

  // 반려동물 추가 후 쿼리 무효화
  React.useEffect(() => {
    if (location.state && location.state.petAdded) {
      // 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['petList'] });
      // location.state 초기화
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  // 반려동물 선택 시 페이지 이동 함수
  const handlePetSelect = (petId: number) => {
    if (selectedMenu === 'x-ray' || selectedMenu === 'ai-analysis') {
      navigate(`/ai-xray-analysis`, { state: { id: petId } });
    } else if (selectedMenu === 'records') {
      navigate(`/diagnosis-list`, { state: { id: petId } });
    }
  };

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  // 에러 발생 시 표시
  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Error: {error instanceof Error ? error.message : 'An error occurred.'}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-white mx-6 h-screen overflow-x-hidden">
      <div className="flex items-center w-full mt-7 mb-8 relative">
        {/* 뒤로가기 버튼 */}
        <FaChevronLeft
          className="text-xl cursor-pointer"
          onClick={() => navigate('/AI-menu')}
        />
        <h1 className="text-xl font-bold flex-1 text-center">{t("ai_page.Select_Pet")}</h1>
        <div className="w-5"></div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-11 w-full max-w-md">
        {/* 반려동물 목록 */}
        {pets.map((pet) => (
          <div key={pet.petId} className="w-full max-w-[180px] flex flex-col items-center">
            <div className="relative w-full h-full rounded-lg bg-[#0D1226] flex items-center justify-center overflow-hidden">
              <img
                src={pet.imageUrl}
                alt={pet.name}
                className="w-[130px] h-[130px] md:w-[150px] md:h-[150px] lg:w-[180px] lg:h-[180px] object-cover rounded-2xl"
                onClick={() => handlePetSelect(pet.petId)}
              />
              <button
                className="absolute bottom-2 right-8 bg-blue-500 p-1 rounded-full cursor-pointer"
                onClick={() =>
                  navigate(`/edit-pet`, {
                    state: { id: pet.petId, name: pet.name, imageUrl: pet.imageUrl },
                  })
                }
              >
                <FaPen className="text-white" />
              </button>
            </div>
            <div className="mt-2 mb-6 text-center font-semibold text-lg w-full">{pet.name}</div>
          </div>
        ))}

        {/* 반려동물 추가 버튼 */}
        <div key="add-pet" className="flex flex-col items-center">
          <div
            className="w-[130px] h-[130px] md:w-[150px] md:h-[150px] lg:w-[180px] lg:h-[180px] rounded-lg bg-gray-800 flex items-center justify-center cursor-pointer"
            onClick={() => navigate('/regist-pet')}
          >
            <button className="text-white text-5xl">+</button>
          </div>
          <div className="mt-2 text-center font-semibold text-lg">{t("ai_page.Add_Profile")}</div>
        </div>
      </div>
    </div>
  );
};

export default SelectPet;
