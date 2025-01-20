import React from 'react';
import { FaPen } from 'react-icons/fa';
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate, useLocation } from 'react-router-dom';
import useMainPageStore from '@/shared/store/useMainPageStore';
import { getPetList } from '@/entities/Pet/api/getPetList';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Pet } from '@/entities/Pet/model/types';
import { useTranslation } from "react-i18next";
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";

const SelectPet: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { playSfx } = useSound();
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
    if (selectedMenu === 'x-ray') {
      playSfx(Audios.button_click);
      navigate(`/ai-xray-analysis`, { state: { id: petId } });
    } else if(selectedMenu === 'ai-analysis'){
      playSfx(Audios.button_click);
      navigate(`/ai-dental-analysis`, { state: { id: petId } });
    } else if (selectedMenu === 'records') {
      playSfx(Audios.button_click);
      navigate(`/diagnosis-list`, { state: { id: petId } });
    }
  };

  const handleEdit = (petId: number, name: string, imageUrl: string) => {
    playSfx(Audios.button_click);
    navigate(`/edit-pet`, {
      state: { id: petId, name, imageUrl },
    });
  };

  const handleAdd = () => {
    playSfx(Audios.button_click);
    navigate("/regist-pet");
  }

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
      <div
        className={`h-14 flex items-center w-full font-bold text-xl mb-8 justify-between`}
        onClick={() => navigate("/AI-menu")}
        >
        <IoChevronBackOutline className={`w-6 h-6`} />
        <p>Select Pet</p>
        <div className={`w-6 h-6`} ></div>
      </div>

      <div className="px-6">
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto justify-items-center">
          {/* 반려동물 목록 */}
          {pets.map((pet) => (
            <div key={pet.petId} className="flex flex-col items-center">
              <div className="relative w-[130px] h-[130px] rounded-3xl bg-[#0D1226] flex items-center justify-center overflow-hidden">
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="w-full h-full object-cover rounded-3xl"
                  onClick={() => handlePetSelect(pet.petId)}
                />
                <button
                  className="absolute bottom-2 right-3 bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center"
                  onClick={() => handleEdit(pet.petId, pet.name, pet.imageUrl)}
                >
                  <FaPen className="text-white w-3 h-3" />
                </button>
              </div>
              <div className="mt-1 mb-2 text-sm text-center">{pet.name}</div>
            </div>
          ))}

          {/* 반려동물 추가 버튼 */}
          <div key="add-pet" className="flex flex-col items-center">
            <div
              className="w-[130px] h-[130px] rounded-3xl bg-gray-800 flex items-center justify-center cursor-pointer"
              onClick={handleAdd}
            >
              <button className="text-white text-5xl">+</button>
            </div>
            <div className="mt-1 text-sm text-center">{t("ai_page.Add_Profile")}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectPet;
