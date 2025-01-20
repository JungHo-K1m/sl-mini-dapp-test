import React from 'react';
import SelectCharacter from './SelectCharacter';
import chooseCharacter from '@/entities/User/api/chooseCharacter';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";


const SelectCharacterPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedPet, setSelectedPet] = React.useState<'DOG' | 'CAT'>('DOG');
  const { playSfx } = useSound();
  
  const handleCharacterSelect = async () => {
    playSfx(Audios.button_click);
    
    try{
      const response = await chooseCharacter(selectedPet);
      if(response){
        // 정상 반환이면 메인 페이지로 이동
        navigate('/first-reward');
      }else{
        console.log("캐릭터 선택 에러 발생");
        localStorage.removeItem('accessToken');
        navigate('/');
      }
    }catch(error: any){
      console.log("다시 시작해보아요.");
      localStorage.removeItem('accessToken');
      navigate('/');
    }
  };

  return (
    <div className="relative">
      <SelectCharacter selectedPet={selectedPet} setSelectedPet={setSelectedPet} />
      <div className="bottom-10 absolute flex w-full self-center">
          <button
            className={`h-14 bg-[#0147e5] text-white rounded-full w-full mx-6 ${
              selectedPet ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!selectedPet}
            onClick={handleCharacterSelect}
            >
            {t("character_page.Continue")}
          </button>
        </div>
    </div>
  );
};

export default SelectCharacterPage;
