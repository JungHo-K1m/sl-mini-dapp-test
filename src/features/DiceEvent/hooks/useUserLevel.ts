import { useState, useEffect } from 'react';
import Images from '@/shared/assets/images';

const useUserLevel = (initialCharacterType: 'dog' | 'cat') => {
  const [userLv, setUserLv] = useState<number>(20);
  const [mainColorClassName, setMainColorClassName] = useState<string>('');
  const [charactorImageSrc, setCharactorImageSrc] = useState<string>('');
  const [characterType, setCharacterType] = useState<'dog' | 'cat'>(
    initialCharacterType,
  ); // 캐릭터 유형을 초기 상태로 설정

  const getMainColorForUserLv = () => {
    if (userLv >= 1 && userLv <= 4) {
      return 'lv1to4-box';
    } else if (userLv >= 5 && userLv <= 8) {
      return 'lv5to8-box';
    } else if (userLv >= 9 && userLv <= 12) {
      return 'lv9to12-box';
    } else if (userLv >= 13 && userLv <= 16) {
      return 'lv13to16-box';
    } else if (userLv >= 17 && userLv <= 20) {
      return 'lv17to20-box';
    } else {
      return '';
    }
  };

  const getCharactorForUserLv = () => {
    if (characterType === 'dog') {
      if (userLv >= 1 && userLv <= 2) {
        return Images.DogLv1to2;
      } else if (userLv >= 3 && userLv <= 4) {
        return Images.DogLv3to4;
      } else if (userLv >= 5 && userLv <= 6) {
        return Images.DogLv5to6;
      } else if (userLv >= 7 && userLv <= 8) {
        return Images.DogLv7to8;
      } else if (userLv >= 9 && userLv <= 10) {
        return Images.DogLv9to10;
      } else if (userLv >= 11 && userLv <= 12) {
        return Images.DogLv11to12;
      } else if (userLv >= 13 && userLv <= 14) {
        return Images.DogLv13to14;
      } else if (userLv >= 15 && userLv <= 16) {
        return Images.DogLv15to16;
      } else if (userLv >= 17 && userLv <= 18) {
        return Images.DogLv17to18;
      } else if (userLv >= 19 && userLv <= 20) {
        return Images.DogLv19to20;
      }
    } else if (characterType === 'cat') {
      if (userLv >= 1 && userLv <= 2) {
        return Images.CatLv1to2;
      } else if (userLv >= 3 && userLv <= 4) {
        return Images.CatLv3to4;
      } else if (userLv >= 5 && userLv <= 6) {
        return Images.CatLv5to6;
      } else if (userLv >= 7 && userLv <= 8) {
        return Images.CatLv7to8;
      } else if (userLv >= 9 && userLv <= 10) {
        return Images.CatLv9to10;
      } else if (userLv >= 11 && userLv <= 12) {
        return Images.CatLv11to12;
      } else if (userLv >= 13 && userLv <= 14) {
        return Images.CatLv13to14;
      } else if (userLv >= 15 && userLv <= 16) {
        return Images.CatLv15to16;
      } else if (userLv >= 17 && userLv <= 18) {
        return Images.CatLv17to18;
      } else if (userLv >= 19 && userLv <= 20) {
        return Images.CatLv19to20;
      }
    }
    return '';
  };

  useEffect(() => {
    setMainColorClassName(getMainColorForUserLv());
    setCharactorImageSrc(getCharactorForUserLv());
  }, [userLv, characterType]);

  return {
    userLv,
    setUserLv,
    mainColorClassName,
    charactorImageSrc,
    characterType,
    setCharacterType,
  };
};

export default useUserLevel;
