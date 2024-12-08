// src/pages/SignUp/SelectCharacter.tsx

import React from 'react';
import Images from '@/shared/assets/images';
import { useTranslation } from "react-i18next";

interface SelectCharacterProps {
  selectedPet: 'DOG' | 'CAT';
  setSelectedPet: (pet: 'DOG' | 'CAT') => void;
}

const SelectCharacter: React.FC<SelectCharacterProps> = ({ selectedPet, setSelectedPet }) => {
  const { t } = useTranslation();
  React.useEffect(() => {
    console.log('Step 5-0: SelectCharacter 컴포넌트 마운트됨.');
    return () => {
      console.log('Step 5-0: SelectCharacter 컴포넌트 언마운트됨.');
    };
  }, []);

  const handlePetSelection = (pet: 'DOG' | 'CAT') => {
    console.log(`Step 5-0: ${pet} 선택됨.`);
    setSelectedPet(pet);
  };

  return (
    <div className="flex flex-col bg-[#0D1226] h-screen text-white items-center mx-6">
      <h2 className="font-semibold text-xl text-center mt-32">
        Save the Life!
        <br />
        {t("character_page.Choose_your_character!")}
      </h2>
      <div className="flex flex-row mt-14 gap-3">
        <div
          className="flex flex-col items-center justify-center gap-3 cursor-pointer"
          onClick={() => handlePetSelection('DOG')}
        >
          <div
            className={`w-40 h-48 rounded-[30px] border-2 ${
              selectedPet === 'DOG'
                ? 'border-[#0147E5] bg-[#1E1B4B]'
                : 'border-[#737373] bg-[#1f1e27]'
            } flex items-center justify-center`}
          >
            <img
              src={
                selectedPet === 'DOG'
                  ? Images.DogLv19to20
                  : Images.DogLv1to2
              }
              alt="dog"
              className="w-36 h-36"
            />
          </div>
          <div
            className={`flex w-11 h-7 border rounded-full items-center justify-center text-xs font-medium ${
              selectedPet === 'DOG'
                ? 'border-white text-white'
                : 'border-[#737373]'
            }`}
          >
            Dog
          </div>
        </div>
        <div
          className="flex flex-col items-center justify-center gap-3 cursor-pointer"
          onClick={() => handlePetSelection('CAT')}
        >
          <div
            className={`w-40 h-48 rounded-[30px] border-2 ${
              selectedPet === 'CAT'
                ? 'border-[#0147E5] bg-[#1E1B4B]'
                : 'border-[#737373] bg-[#1f1e27]'
            } flex items-center justify-center`}
          >
            <img
              src={
                selectedPet === 'CAT'
                  ? Images.CatLv19to20
                  : Images.CatLv1to2
              }
              alt="cat"
              className="w-36 h-36"
            />
          </div>
          <div
            className={`flex w-11 h-7 border rounded-full items-center justify-center text-xs font-medium ${
              selectedPet === 'CAT'
                ? 'border-white text-white'
                : 'border-[#737373]'
            }`}
          >
            Cat
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectCharacter;
