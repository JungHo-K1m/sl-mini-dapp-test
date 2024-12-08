import api from '@/shared/api/axiosInstance';

// 사용자의 캐릭터 선택 API 
export const chooseCharacter = async(characterType: string): Promise<any> => {
    // body에 선택한 캐릭터 타입(CAT | DOG)을 담아서 보냄
    const response = await api.post("select/character", {characterType});

    if(response.data.code === "OK"){
        return true;
    }else{
        return false;
    }
};

export default chooseCharacter;