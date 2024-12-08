// src/features/DiceEvent/api/rollDiceApi.ts

import api from '@/shared/api/axiosInstance';

// RollDiceResponseData 인터페이스 정의 및 export
export interface RollDiceResponseData {
  rank: number;
  star: number;
  ticket: number;
  dice: number;
  slToken: number;
  diceResult: number;
  tileSequence: number;
}

export const rollDiceAPI = async (gauge: number, sequence: number): Promise<RollDiceResponseData> => {
  const response = await api.post('/roll-dice', { gauge, sequence });

  if (response.data.code === 'OK') {
    console.log('rollDiceAPI: 서버 응답 데이터:', response.data.data);
    return response.data.data;
  } else {
    console.error('rollDiceAPI Error:', response.data.message);
    throw new Error(response.data.message || 'Roll dice failed');
  }
};
